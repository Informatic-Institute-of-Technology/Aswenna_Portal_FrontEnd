import type { User, UserRole } from "@/Context/createAuthContext";
import { decryptToken } from "@/utils";
import { httpClient } from "./httpClient";
import { setAuthHeader, setCsrfToken } from "./tokenStore";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface UserApiResponse {
  _id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  address: string | null;
  email: string | null;
  emailVerified: boolean | null;
  phoneNumber: string | null;
  phoneNumberVerified: boolean | null;
  roles: string[];
  permissions: string[];
  createdBy: string | null;
  updatedBy: string | null;
  meta: unknown[];
  createdAt: string | null;
  updatedAt: string | null;
  __v: number | null;
}

interface SessionPayload {
  token: string;
  tokenType: string;
  user: User;
  csrfToken: string;
  fingerprint: string;
  nonce: string;
  createdAt: number;
}
const SALT = new TextEncoder().encode("aswenna-portal-session-v2");
const SESSION_ID_KEY = "session_id";
const SESSION_EXPIRY_KEY = "session_expiry";
const IDLE_EXPIRY_KEY = "idle_expiry";
const SESSION_DATA_KEY = "session_data";
const LOGIN_ATTEMPTS_KEY = "login_attempts";

const ABSOLUTE_TIMEOUT_MS = 12 * 60 * 60 * 1000;   
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;       
const MAX_LOGIN_ATTEMPTS = 5;
const BASE_LOCKOUT_MS = 30_000;        
const MAX_LOCKOUT_MS = 15 * 60 * 1000;         
async function deriveKey(sessionId: string): Promise<CryptoKey> {
  const raw = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionId),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: SALT, iterations: 100_000, hash: "SHA-256" },
    raw,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptSession(
  payload: SessionPayload,
  sessionId: string,
): Promise<string> {
  const key = await deriveKey(sessionId);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

async function decryptSession(
  encrypted: string,
  sessionId: string,
): Promise<SessionPayload> {
  const key = await deriveKey(sessionId);
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );
  return JSON.parse(new TextDecoder().decode(plaintext)) as SessionPayload;
}
async function generateFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.languages?.join(",") ?? "",
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    navigator.hardwareConcurrency?.toString() ?? "",
    navigator.platform ?? "",
  ];
  const raw = components.join("|");
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(raw),
  );
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
interface LoginAttempts {
  count: number;
  lastAttempt: number;
  lockedUntil: number;
}

function getLoginAttempts(): LoginAttempts {
  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { count: 0, lastAttempt: 0, lockedUntil: 0 };
}

function setLoginAttempts(attempts: LoginAttempts): void {
  sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
}

function clearLoginAttempts(): void {
  sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
}


class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {

    const attempts = getLoginAttempts();
    if (attempts.lockedUntil > Date.now()) {
      const remainingSec = Math.ceil(
        (attempts.lockedUntil - Date.now()) / 1000,
      );
      throw new Error(
        `Too many failed attempts. Try again in ${remainingSec} seconds.`,
      );
    }

    let loginResponse: LoginResponse;
    try {
      loginResponse = await httpClient.post<LoginResponse>(
        "/auth/login",
        credentials,
      );
    } catch (err) {
      const newCount = attempts.count + 1;
      let lockedUntil = 0;
      if (newCount >= MAX_LOGIN_ATTEMPTS) {
        const backoff = Math.min(
          BASE_LOCKOUT_MS * Math.pow(2, newCount - MAX_LOGIN_ATTEMPTS),
          MAX_LOCKOUT_MS,
        );
        lockedUntil = Date.now() + backoff;
      }
      setLoginAttempts({
        count: newCount,
        lastAttempt: Date.now(),
        lockedUntil,
      });
      throw err;
    }
    clearLoginAttempts();

    if (!loginResponse.access_token) {
      throw new Error("No access token received");
    }

    const token = loginResponse.access_token;
    const decryptedData = decryptToken(token);

    const userId =
      decryptedData?.sub || decryptedData?.userId || decryptedData?.id;
    const userRole = decryptedData?.role;

    if (!userId) throw new Error("No user ID found in token");

    const userProfile = await httpClient.get<UserApiResponse>(
      `/v1/user/${userId}`,
    );

    const userData: User = {
      _id: userProfile._id || null,
      firstName: userProfile.firstName || null,
      lastName: userProfile.lastName || null,
      fullName: userProfile.fullName || null,
      address: userProfile.address || null,
      email: userProfile.email || null,
      emailVerified: userProfile.emailVerified ?? null,
      phoneNumber: userProfile.phoneNumber || null,
      phoneNumberVerified: userProfile.phoneNumberVerified ?? null,
      roles: Array.isArray(userProfile.roles) ? userProfile.roles : [],
      permissions: Array.isArray(userProfile.permissions)
        ? userProfile.permissions
        : [],
      createdBy: userProfile.createdBy || null,
      updatedBy: userProfile.updatedBy || null,
      meta: Array.isArray(userProfile.meta) ? userProfile.meta : [],
      createdAt: userProfile.createdAt || null,
      updatedAt: userProfile.updatedAt || null,
      __v: userProfile.__v ?? null,
      role: userRole as UserRole,
    };

    const sessionId = crypto.randomUUID();
    const csrfToken = crypto.randomUUID();
    const nonce = crypto.randomUUID();
    const fingerprint = await generateFingerprint();
    const now = Date.now();

    const encryptedPayload = await encryptSession(
      {
        token,
        tokenType: loginResponse.token_type || "Bearer",
        user: userData,
        csrfToken,
        fingerprint,
        nonce,
        createdAt: now,
      },
      sessionId,
    );

    localStorage.setItem(SESSION_ID_KEY, sessionId);
    localStorage.setItem(
      SESSION_EXPIRY_KEY,
      (now + ABSOLUTE_TIMEOUT_MS).toString(),
    );
    localStorage.setItem(
      IDLE_EXPIRY_KEY,
      (now + IDLE_TIMEOUT_MS).toString(),
    );

    sessionStorage.setItem(SESSION_DATA_KEY, encryptedPayload);

    setAuthHeader(
      `${loginResponse.token_type || "Bearer"} ${token}`,
    );
    setCsrfToken(csrfToken);

    console.log("Secure session created:", sessionId);

    return userData;
  }

  async restoreSession(): Promise<{
    user: User;
    sessionId: string;
  } | null> {
    try {
      if (this.isSessionExpired()) {
        this.logout();
        return null;
      }

      const sessionId = localStorage.getItem(SESSION_ID_KEY);
      const encryptedData = sessionStorage.getItem(SESSION_DATA_KEY);
      if (!sessionId || !encryptedData) return null;

      const payload = await decryptSession(encryptedData, sessionId);

      const currentFingerprint = await generateFingerprint();
      if (payload.fingerprint !== currentFingerprint) {
        console.warn("Session fingerprint mismatch — possible hijack.");
        this.logout();
        return null;
      }

      setAuthHeader(`${payload.tokenType} ${payload.token}`);
      setCsrfToken(payload.csrfToken);

      this.touchIdleTimer();

      return { user: payload.user, sessionId };
    } catch (err) {
      console.error("Failed to restore session:", err);
      this.logout();
      return null;
    }
  }
  async updateSessionUser(updatedUser: User): Promise<void> {
    try {
      const sessionId = localStorage.getItem(SESSION_ID_KEY);
      const encryptedData = sessionStorage.getItem(SESSION_DATA_KEY);
      if (!sessionId || !encryptedData) return;

      const payload = await decryptSession(encryptedData, sessionId);
      payload.user = updatedUser;
      payload.nonce = crypto.randomUUID();
      const newEncrypted = await encryptSession(payload, sessionId);
      sessionStorage.setItem(SESSION_DATA_KEY, newEncrypted);
    } catch (err) {
      console.error("Failed to update session user:", err);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const sessionId = localStorage.getItem(SESSION_ID_KEY);
      const encryptedData = sessionStorage.getItem(SESSION_DATA_KEY);
      if (!sessionId || !encryptedData || this.isSessionExpired()) return null;
      const payload = await decryptSession(encryptedData, sessionId);
      return `${payload.tokenType} ${payload.token}`;
    } catch {
      return null;
    }
  }

  touchIdleTimer(): void {
    if (!localStorage.getItem(SESSION_ID_KEY)) return;
    localStorage.setItem(
      IDLE_EXPIRY_KEY,
      (Date.now() + IDLE_TIMEOUT_MS).toString(),
    );
  }

  isIdle(): boolean {
    const idle = localStorage.getItem(IDLE_EXPIRY_KEY);
    if (!idle) return true;
    return Date.now() > parseInt(idle, 10);
  }

  isSessionExpired(): boolean {
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (!expiry) return true;
    if (Date.now() > parseInt(expiry, 10)) return true;
    return this.isIdle();
  }

  isAuthenticated(): boolean {
    return (
      !!localStorage.getItem(SESSION_ID_KEY) && !this.isSessionExpired()
    );
  }

  getSessionId(): string | null {
    return localStorage.getItem(SESSION_ID_KEY);
  }

  validateSessionId(urlSessionId: string): boolean {
    const storedId = localStorage.getItem(SESSION_ID_KEY);
    if (!storedId) return false;
    if (storedId.length !== urlSessionId.length) return false;
    let mismatch = 0;
    for (let i = 0; i < storedId.length; i++) {
      mismatch |= storedId.charCodeAt(i) ^ urlSessionId.charCodeAt(i);
    }
    return mismatch === 0;
  }

  logout(): void {
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    localStorage.removeItem(IDLE_EXPIRY_KEY);
    sessionStorage.removeItem(SESSION_DATA_KEY);
    setAuthHeader(null);
    setCsrfToken(null);
    console.log("User logged out — session destroyed");
  }

  getSessionInfo(): {
    remainingMs: number;
    idleRemainingMs: number;
  } | null {
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    const idle = localStorage.getItem(IDLE_EXPIRY_KEY);
    if (!expiry || !idle) return null;
    return {
      remainingMs: Math.max(0, parseInt(expiry, 10) - Date.now()),
      idleRemainingMs: Math.max(0, parseInt(idle, 10) - Date.now()),
    };
  }
}

export const authService = new AuthService();
