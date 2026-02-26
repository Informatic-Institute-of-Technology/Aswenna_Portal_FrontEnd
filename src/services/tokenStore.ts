let _authHeader: string | null = null;
let _csrfToken: string | null = null;

export function setAuthHeader(header: string | null): void {
  _authHeader = header;
}

export function getAuthHeader(): string | null {
  return _authHeader;
}

export function setCsrfToken(token: string | null): void {
  _csrfToken = token;
}

export function getCsrfToken(): string | null {
  return _csrfToken;
}
