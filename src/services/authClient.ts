import { authService } from "./auth.service";
import { config } from "@/core/config";

export class AuthClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "AuthClientError";
    this.status = status;
  }
}

type HttpMethod = "GET" | "POST" | "DELETE";

const parseRawToken = (authorizationHeader: string | null): string | null => {
  if (!authorizationHeader) return null;
  return authorizationHeader.replace(/^Bearer\s+/i, "").trim() || null;
};

const extractErrorMessage = (payload: unknown, fallback: string): string => {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return fallback;

  const data = payload as {
    message?: string | string[];
    error?: string;
  };

  if (Array.isArray(data.message)) return data.message.join(" ");
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  if (typeof data.error === "string" && data.error.trim()) return data.error;

  return fallback;
};

class AuthClient {
  private readonly baseUrl = config.api.baseUrl;

  async getAuthorizationHeader(): Promise<string | null> {
    return authService.getToken();
  }

  async getRawToken(): Promise<string | null> {
    const authorizationHeader = await this.getAuthorizationHeader();
    return parseRawToken(authorizationHeader);
  }

  async request<T>(
    endpoint: string,
    method: HttpMethod,
    body?: unknown,
  ): Promise<T> {
    const authorizationHeader = await this.getAuthorizationHeader();

    if (!authorizationHeader) {
      throw new AuthClientError(401, "Authentication token is missing");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: authorizationHeader,
              "ngrok-skip-browser-warning": "true",
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
    });

    const text = await response.text();
    const payload = text
      ? (JSON.parse(text) as unknown)
      : ({ message: "No response body" } as unknown);

    if (!response.ok) {
      throw new AuthClientError(
        response.status,
        extractErrorMessage(payload, `HTTP ${response.status}`),
      );
    }

    return payload as T;
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "GET");
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, "POST", body);
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "DELETE");
  }
}

export const authClient = new AuthClient();
