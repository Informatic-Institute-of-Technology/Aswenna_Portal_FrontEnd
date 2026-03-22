import { getAuthHeader, getCsrfToken } from "./tokenStore";

const API_BASE_URL =
  "https://4529-2402-4000-2272-c590-8035-d116-2be6-25c4.ngrok-free.app/api";
// "http://localhost:3000/api";

export class HttpClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(includeCsrf = false): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Cache-Control": "no-store",
      "ngrok-skip-browser-warning": "true",
    };

    const authHeader = getAuthHeader();
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    if (includeCsrf) {
      const csrf = getCsrfToken();
      if (csrf) {
        headers["X-CSRF-Token"] = csrf;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      if (data.message && (Array.isArray(data.message) || data.error)) {
        throw new Error(JSON.stringify(data));
      }
      throw new Error(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return data;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
      credentials: "same-origin",
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getAuthHeaders(true),
      body: JSON.stringify(data),
      credentials: "same-origin",
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getAuthHeaders(true),
      body: JSON.stringify(data),
      credentials: "same-origin",
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(true),
      body: JSON.stringify(data),
      credentials: "same-origin",
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(true),
      credentials: "same-origin",
    });

    return this.handleResponse<T>(response);
  }

  async postMultipart<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers: Record<string, string> = {
      "X-Requested-With": "XMLHttpRequest",
      "Cache-Control": "no-store",
    };

    const authHeader = getAuthHeader();
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const csrf = getCsrfToken();
    if (csrf) {
      headers["X-CSRF-Token"] = csrf;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "same-origin",
    });

    return this.handleResponse<T>(response);
  }
}

export const httpClient = new HttpClient();
