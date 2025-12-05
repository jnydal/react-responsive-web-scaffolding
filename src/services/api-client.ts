const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.sukker.no';

export interface ApiError {
  status: number;
  data?: unknown;
  message?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json().catch(() => ({}));
      } catch {
        errorData = {};
      }

      const error: ApiError = {
        status: response.status,
        data: errorData,
        message: `Request failed with status ${response.status}`,
      };

      throw error;
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return {} as T;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }

    // Network or other errors
    throw {
      status: 0,
      message: 'Network error or request failed',
    } as ApiError;
  }
}

