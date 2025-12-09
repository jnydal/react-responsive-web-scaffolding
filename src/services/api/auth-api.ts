import type {
  LoginPayload,
  LoginRequest,
  LoginResponse,
} from '../../features/auth/types/auth.types';
import { baseApi } from './base-api';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        // Backend currently expects username OR email; map the identifier accordingly.
        // Keep payload flexible so it can be replaced when backend confirms the contract.
        body: mapIdentifierToPayload(credentials),
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;

function mapIdentifierToPayload(credentials: LoginRequest): LoginPayload {
  const { identifier, password } = credentials;

  const isEmail = identifier.includes('@');
  return isEmail
    ? { email: identifier, password }
    : { username: identifier, password };
}

