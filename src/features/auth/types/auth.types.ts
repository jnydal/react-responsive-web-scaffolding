// Temporary types - to be updated when backend confirms shape
export interface AuthUser {
  id?: string;
  email?: string;
  username?: string;
  displayName?: string;
  [key: string]: unknown;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export type LoginPayload =
  | { username: string; password: string }
  | { email: string; password: string };

export interface LoginResponse {
  user?: AuthUser;
  [key: string]: unknown;
}

