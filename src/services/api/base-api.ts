import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { apiClient, ApiError } from '../api-client';

interface BaseQueryArgs {
  url: string;
  method?: string;
  body?: unknown;
}

// Custom baseQuery using our apiClient
const baseQuery: BaseQueryFn<BaseQueryArgs, unknown, ApiError> = async (args) => {
  try {
    const { url, method = 'GET', body } = args;
    const result = await apiClient(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data: result };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      error: {
        status: apiError.status,
        data: apiError.data,
      },
    };
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
});

