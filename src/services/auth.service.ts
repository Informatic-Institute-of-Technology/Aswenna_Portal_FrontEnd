import type { User, UserRole } from "@/Context/createAuthContext";
import { config } from "@/core/config";
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
  status?: string | null;
  termsAccepted?: boolean | null;
  role?:
    | string
    | {
        _id?: string;
        name?: string;
        description?: string;
      }
    | null;
  personalInfo?: {
    nicNumber?: string;
    gender?: string;
    birthday?: string;
    age?: number;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    district?: string;
    profilePicture?: string | { url?: string; filename?: string } | null;
    nicFrontImage?: { url?: string; filename?: string } | null;
    nicBackImage?: { url?: string; filename?: string } | null;
  } | null;
  investor?: {
    organizationName?: string;
    registrationNo?: string;
    companyAddress?: string;
    organizationPhoneNumber?: string;
    dsDivision?: string;
    gnDivision?: string;
    cropFocus?: string | string[];
  } | null;
}

const ROLE_ID_MAP: Record<string, UserRole> = {
  "696e40fda4f896e9f40c8b93": "farmer",
  "696e6163b558abe269548099": "investor",
  "696e616db558abe26954809c": "landowner",
  "696f008a3e12fb6fd9ed945b": "superadmin",
};

const normalizeCropFocus = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const deriveRoleFromProfile = (
  roleValue: UserApiResponse["role"],
): UserRole | undefined => {
  const roleName =
    typeof roleValue === "string"
      ? roleValue
      : typeof roleValue === "object" && roleValue
        ? roleValue.name
        : undefined;
  const roleId =
    typeof roleValue === "object" && roleValue
      ? roleValue._id
      : typeof roleValue === "string"
        ? roleValue
        : undefined;

  const normalized = roleName?.toLowerCase();
  if (
    normalized === "farmer" ||
    normalized === "investor" ||
    normalized === "landowner" ||
    normalized === "superadmin"
  ) {
    return normalized;
  }

  if (roleId && ROLE_ID_MAP[roleId]) {
    return ROLE_ID_MAP[roleId];
  }

  return undefined;
};

type ProfilePictureApiValue =
  | string
  | {
      url?: string;
      filename?: string;
      [key: string]: unknown;
    }
  | null
  | undefined;

type UploadedMediaApiValue =
  | {
      url?: string;
      filename?: string;
      [key: string]: unknown;
    }
  | null
  | undefined;

const resolveProfilePicture = (
  value: ProfilePictureApiValue,
): ProfilePictureApiValue => {
  if (!value || typeof value === "string") return value;
  if (value.url || !value.filename) return value;

  return {
    ...value,
    url: `${config.storage.baseUrl}/${value.filename}`,
  };
};

const resolveUploadedMedia = (
  value: UploadedMediaApiValue,
): UploadedMediaApiValue => {
  if (!value) return value;
  if (value.url || !value.filename) return value;

  return {
    ...value,
    url: `${config.storage.baseUrl}/${value.filename}`,
  };
};

export type AuthBroadcastMessage =
  | { type: "LOGIN"; role: string | undefined }
  | { type: "LOGOUT" };

interface SessionPayload {
  token: string;
  tokenType: string;
  user: User;
  csrfToken: string;
  nonce: string;
  createdAt: number;
}

interface LoginAttempts {
  count: number;
  lastAttempt: number;
  lockedUntil: number;
}

const SS_SESSION_ID = "aswenna.sid";
const SS_EXPIRY = "aswenna.exp";
const SS_IDLE = "aswenna.idle";
const SS_DATA = "aswenna.dat";
const SS_ATTEMPTS = "aswenna.attempts";

const ABSOLUTE_TIMEOUT_MS = 12 * 60 * 60 * 1000;
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const BASE_LOCKOUT_MS = 30_000;

const BROADCAST_CHANNEL = "aswenna_auth";

const HKDF_SALT = new TextEncoder().encode("aswenna-portal-2025");
const HKDF_INFO = new TextEncoder().encode("aswenna-portal-session-v3");

let _cachedKey: CryptoKey | null = null;
let _cachedSessionId: string | null = null;

async function deriveKey(sessionId: string): Promise<CryptoKey> {
  if (_cachedKey && _cachedSessionId === sessionId) return _cachedKey;

  const raw = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionId),
    "HKDF",
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: HKDF_SALT, info: HKDF_INFO },
    raw,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  _cachedKey = key;
  _cachedSessionId = sessionId;
  return key;
}

function clearKeyCache(): void {
  _cachedKey = null;
  _cachedSessionId = null;
}

async function encryptSession(
  payload: SessionPayload,
  sessionId: string,
): Promise<string> {
  const key = await deriveKey(sessionId);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const combined = new Uint8Array(iv.byteLength + ct.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ct), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

async function decryptSession(
  encrypted: string,
  sessionId: string,
): Promise<SessionPayload> {
  const key = await deriveKey(sessionId);
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: combined.slice(0, 12) },
    key,
    combined.slice(12),
  );
  return JSON.parse(new TextDecoder().decode(plain)) as SessionPayload;
}
async function withLock<T>(name: string, fn: () => Promise<T>): Promise<T> {
  if (typeof navigator !== "undefined" && "locks" in navigator) {
    return navigator.locks.request(`aswenna_${name}`, fn);
  }
  return fn();
}

function broadcastAuth(msg: AuthBroadcastMessage): void {
  try {
    const bc = new BroadcastChannel(BROADCAST_CHANNEL);
    bc.postMessage(msg);
    bc.close();
  } catch {
    console.warn("BroadcastChannel not supported in this browser.");
  }
}

function getLoginAttempts(): LoginAttempts {
  try {
    const raw = sessionStorage.getItem(SS_ATTEMPTS);
    if (raw) {
      const parsed = JSON.parse(raw) as LoginAttempts;
      if (parsed.lockedUntil > 0 && parsed.lastAttempt > 0) {
        parsed.lockedUntil = Math.min(
          parsed.lockedUntil,
          parsed.lastAttempt + BASE_LOCKOUT_MS,
        );
      }
      return parsed;
    }
  } catch {
    console.error("Failed to parse login attempts:");
  }
  return { count: 0, lastAttempt: 0, lockedUntil: 0 };
}

function setLoginAttempts(a: LoginAttempts): void {
  sessionStorage.setItem(SS_ATTEMPTS, JSON.stringify(a));
}

function clearLoginAttempts(): void {
  sessionStorage.removeItem(SS_ATTEMPTS);
}
class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    return withLock("login", async () => {
      const attempts = getLoginAttempts();
      if (attempts.lockedUntil > Date.now()) {
        const remaining = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
        throw new Error(
          `Too many failed attempts. Try again in ${remaining} seconds.`,
        );
      }

      let loginResponse: LoginResponse;
      try {
        loginResponse = await httpClient.post<LoginResponse>(
          "/auth/login",
          credentials,
        );
      } catch (err) {
        const isExpiredLockout =
          attempts.lockedUntil > 0 && Date.now() >= attempts.lockedUntil;
        const baseCount = isExpiredLockout ? 0 : attempts.count;
        const newCount = baseCount + 1;
        setLoginAttempts({
          count: newCount,
          lastAttempt: Date.now(),
          lockedUntil:
            newCount >= MAX_LOGIN_ATTEMPTS ? Date.now() + BASE_LOCKOUT_MS : 0,
        });
        throw err;
      }
      clearLoginAttempts();

      if (!loginResponse.access_token)
        throw new Error("No access token received");

      const token = loginResponse.access_token;
      const decryptedData = decryptToken(token);
      const userId =
        decryptedData?.sub ?? decryptedData?.userId ?? decryptedData?.id;
      const userRole = decryptedData?.role;

      if (!userId) throw new Error("No user ID found in token");

      const userProfile = await httpClient.get<UserApiResponse>(
        `/v1/user/${userId}`,
      );

      const mappedPersonalInfo = userProfile.personalInfo
        ? {
            ...userProfile.personalInfo,
            profilePicture: resolveProfilePicture(
              userProfile.personalInfo.profilePicture,
            ),
            nicFrontImage: resolveUploadedMedia(
              userProfile.personalInfo.nicFrontImage,
            ),
            nicBackImage: resolveUploadedMedia(
              userProfile.personalInfo.nicBackImage,
            ),
          }
        : null;

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
        role: (userRole as UserRole) ?? deriveRoleFromProfile(userProfile.role),
        roleInfo:
          typeof userProfile.role === "object" && userProfile.role
            ? userProfile.role
            : null,
        status: userProfile.status ?? null,
        termsAccepted: userProfile.termsAccepted ?? null,
        investor: userProfile.investor
          ? {
              ...userProfile.investor,
              cropFocus: normalizeCropFocus(userProfile.investor.cropFocus),
            }
          : null,
        personalInfo: mappedPersonalInfo,
      };

      const sessionId = crypto.randomUUID();
      const csrfToken = crypto.randomUUID();
      const nonce = crypto.randomUUID();
      const now = Date.now();

      const encrypted = await encryptSession(
        {
          token,
          tokenType: loginResponse.token_type || "Bearer",
          user: userData,
          csrfToken,
          nonce,
          createdAt: now,
        },
        sessionId,
      );
      sessionStorage.setItem(SS_SESSION_ID, sessionId);
      sessionStorage.setItem(SS_EXPIRY, String(now + ABSOLUTE_TIMEOUT_MS));
      sessionStorage.setItem(SS_IDLE, String(now + IDLE_TIMEOUT_MS));
      sessionStorage.setItem(SS_DATA, encrypted);

      setAuthHeader(`${loginResponse.token_type || "Bearer"} ${token}`);
      setCsrfToken(csrfToken);

      broadcastAuth({ type: "LOGIN", role: userData.role });

      return userData;
    });
  }

  async restoreSession(): Promise<{ user: User; sessionId: string } | null> {
    return withLock("restore", async () => {
      try {
        if (this.isSessionExpired()) {
          this.logout();
          return null;
        }

        const sessionId = sessionStorage.getItem(SS_SESSION_ID);
        const encryptedData = sessionStorage.getItem(SS_DATA);
        if (!sessionId || !encryptedData) return null;

        const payload = await decryptSession(encryptedData, sessionId);

        setAuthHeader(`${payload.tokenType} ${payload.token}`);
        setCsrfToken(payload.csrfToken);
        this.touchIdleTimer();

        return { user: payload.user, sessionId };
      } catch (err) {
        console.error("Failed to restore session:", err);
        this.logout();
        return null;
      }
    });
  }

  async updateSessionUser(updatedUser: User): Promise<void> {
    return withLock("update", async () => {
      try {
        const sessionId = sessionStorage.getItem(SS_SESSION_ID);
        const encryptedData = sessionStorage.getItem(SS_DATA);
        if (!sessionId || !encryptedData) return;

        const payload = await decryptSession(encryptedData, sessionId);
        payload.user = updatedUser;
        payload.nonce = crypto.randomUUID();
        sessionStorage.setItem(
          SS_DATA,
          await encryptSession(payload, sessionId),
        );
      } catch (err) {
        console.error("Failed to update session user:", err);
      }
    });
  }
  async getToken(): Promise<string | null> {
    try {
      const sessionId = sessionStorage.getItem(SS_SESSION_ID);
      const encryptedData = sessionStorage.getItem(SS_DATA);
      if (!sessionId || !encryptedData || this.isSessionExpired()) return null;
      const payload = await decryptSession(encryptedData, sessionId);
      return `${payload.tokenType} ${payload.token}`;
    } catch {
      return null;
    }
  }

  touchIdleTimer(): void {
    if (!sessionStorage.getItem(SS_SESSION_ID)) return;
    sessionStorage.setItem(SS_IDLE, String(Date.now() + IDLE_TIMEOUT_MS));
  }

  isIdle(): boolean {
    const idle = sessionStorage.getItem(SS_IDLE);
    return !idle || Date.now() > parseInt(idle, 10);
  }

  isSessionExpired(): boolean {
    const expiry = sessionStorage.getItem(SS_EXPIRY);
    if (!expiry || Date.now() > parseInt(expiry, 10)) return true;
    return this.isIdle();
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(SS_SESSION_ID) && !this.isSessionExpired();
  }

  getSessionId(): string | null {
    return sessionStorage.getItem(SS_SESSION_ID);
  }

  validateSessionId(urlSessionId: string): boolean {
    const stored = sessionStorage.getItem(SS_SESSION_ID);
    if (!stored || stored.length !== urlSessionId.length) return false;
    let mismatch = 0;
    for (let i = 0; i < stored.length; i++) {
      mismatch |= stored.charCodeAt(i) ^ urlSessionId.charCodeAt(i);
    }
    return mismatch === 0;
  }

  logout(): void {
    clearKeyCache();
    sessionStorage.removeItem(SS_SESSION_ID);
    sessionStorage.removeItem(SS_EXPIRY);
    sessionStorage.removeItem(SS_IDLE);
    sessionStorage.removeItem(SS_DATA);
    setAuthHeader(null);
    setCsrfToken(null);
    broadcastAuth({ type: "LOGOUT" });
  }

  getSessionInfo(): { remainingMs: number; idleRemainingMs: number } | null {
    const expiry = sessionStorage.getItem(SS_EXPIRY);
    const idle = sessionStorage.getItem(SS_IDLE);
    if (!expiry || !idle) return null;
    return {
      remainingMs: Math.max(0, parseInt(expiry, 10) - Date.now()),
      idleRemainingMs: Math.max(0, parseInt(idle, 10) - Date.now()),
    };
  }
}

export const authService = new AuthService();
