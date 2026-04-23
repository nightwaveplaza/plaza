import axios, { AxiosError } from 'axios';
import { isMobile } from '@app/utils/helpers.ts';
import { Native } from '@mobile/bridge/native.ts';

const baseURL: string = import.meta.env.VITE_API_URL;
let isTokenRefreshing = false;

// Bearer token for mobile
let bearerToken: string | null = null;
export const setApiToken = (token: string | null) => {
  if (isMobile()) {
    bearerToken = token;
    Native.setAuthToken(token);
  }
};

const instance = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
});

// Intercept errors
instance.interceptors.response.use(
  response => response,
  err => interceptError(err),
);

// Unpack data
instance.interceptors.response.use(
  response => response.data,
  err => interceptError(err),
);

// Append bearer token for mobile
instance.interceptors.request.use(config => {
  if (isMobile() && bearerToken) {
    config.headers['Authorization'] = `Bearer ${bearerToken}`;
  }
  return config;
});

async function interceptError(err: AxiosError): Promise<void> {
  if (!err.response || !err.config) {
    return Promise.reject(err);
  }

  const status = err.response.status;

  if (status === 419 && err.config.url !== '/auth/csrf-cookie') {
    if (!isTokenRefreshing) {
      isTokenRefreshing = true;
      try {
        await instance.request({ url: '/auth/csrf-cookie' });
      } finally {
        isTokenRefreshing = false;
      }
    }
    // Token refreshed, repeat request
    return instance(err.config);
  }

  return Promise.reject(err);
}

export default {
  get: <T>(url: string, params?: Record<string, unknown>): Promise<T> =>
    instance.get<unknown, T>(url, { params }),
  post: <T, D = unknown>(url: string, data?: D): Promise<T> => instance.post<unknown, T>(url, data),
  put: <T, D = unknown>(url: string, data?: D): Promise<T> => instance.put<unknown, T>(url, data),
  delete: <T, D = unknown>(url: string, data?: D): Promise<T> =>
    instance.delete<unknown, T>(url, { data }),
};
