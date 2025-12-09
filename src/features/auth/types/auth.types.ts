// Temporary types - to be updated when backend confirms shape
export interface User {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user?: User;
  [key: string]: unknown;
}

