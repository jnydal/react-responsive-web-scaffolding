import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { apiClient, ApiError } from '../api-client';

interface BaseQueryArgs {
  url: string;
  method?: string;
  body?: unknown;
}

interface SerializedError {
  status: number;
  data?: unknown;
}

// Custom baseQuery using our apiClient
const baseQuery: BaseQueryFn<BaseQueryArgs, unknown, SerializedError> = async (args) => {
  try {
    const { url, method = 'GET', body } = args;
    const result = await apiClient(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data: result };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        error: {
          status: error.status,
          data: error.data,
        },
      };
    }

    // Fallback for unknown errors
    return {
      error: {
        status: 500,
        data: { message: 'Unknown error' },
      },
    };
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
});

