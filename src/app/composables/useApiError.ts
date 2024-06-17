import { AxiosError } from 'axios'
import { i18n } from '@locales/_i18n'

interface ApiError {
  message: string
  key: string
}

export function useApiError(e: Error | AxiosError): string {
  const { t } = i18n.global

  if (e instanceof AxiosError) {
    if (e.code === 'ERR_NETWORK') {
      return t('errors.network_fail')
    }

    if (e.response?.status === 500) {
      return t('errors.server')
    }

    if (e.response?.data) {
      return t((<ApiError>e.response.data).key)
    }
  }

  return e.message
}