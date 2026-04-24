import axios, { AxiosError } from 'axios';
import { i18n } from '@locales/_i18n.ts';

// Error structure for API responses
export interface ApiError {
  message: string;
  code: number;
}

export function handleError(e: Error | AxiosError | unknown): ApiError {
  const { t } = i18n.global;
  const defaultResponse = { message: 'Unknown error', code: 0 };

  if (axios.isCancel(e)) {
    return { message: 'Request has been canceled', code: 0 };
  }

  if (!(e instanceof AxiosError)) {
    return e instanceof Error ? { message: e.message, code: 0 } : defaultResponse;
  }

  const code = e.response?.status ?? 0;
  const messageKey = e.response?.data?.key;
  const serverError = e.response?.data?.error;

  if (code === 500) {
    return { message: t('errors.server'), code };
  }

  if (messageKey) {
    return { message: t(messageKey), code };
  }

  if (serverError) {
    return { message: serverError, code };
  }

  return {
    code,
    message: `${t('errors.network_fail')} ${e.message}`,
  };
}
