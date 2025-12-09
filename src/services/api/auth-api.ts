import type { LoginRequest, LoginResponse } from '../../features/auth/types/auth.types';
import { baseApi } from './base-api';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        // Backend currently expects username/email; map the local identifier
        body: {
          username: credentials.identifier,
          password: credentials.password,
        },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;

