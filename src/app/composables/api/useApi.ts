import { onUnmounted, type Ref, ref, type UnwrapRef } from 'vue'
import { i18n } from '@locales/_i18n.ts'
import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import api from '@app/api/index.ts'
import { useAuthToken } from '@mobile/composables/useAuthToken.ts'
import { isMobile } from '@app/utils/helpers.ts'

// Error structure for API responses
export interface ApiError {
  message: string,
  code: number
}

// Response wrapper for API calls with loading state
export interface CallResponse<T> {
  data: Ref<UnwrapRef<T> | null>
  error: Ref<UnwrapRef<ApiError | null>>
  isLoading: Ref<UnwrapRef<boolean>>
  call: (config: AxiosRequestConfig) => Promise<T>
}

/**
 * API request handler with state management
 *
 * Handles API calls and tracks loading state, data and errors.
 */
export function useApi<T> (): CallResponse<T> {
  const data = ref<T | null>(null)
  const error = ref<ApiError | null>(null)
  const isLoading = ref(false)
  let controller: AbortController | null = null
  const { token } = useAuthToken()

  // Make API request
  const call = async (config: AxiosRequestConfig): Promise<T> => {
    isLoading.value = true
    error.value = null
    controller?.abort()

    if (typeof AbortController !== 'undefined') {
      controller = new AbortController()
    }

    try {
      const authHeader = isMobile()
        ? {'Authorization': `Bearer ${token.value}`}
        : {}

      const response = await api.request({
        ...config,
        headers: {
          // 'NP-User-Agent': userAuthStore.agent
          ...authHeader
        },
        signal: controller?.signal
      })
      data.value = response.data as UnwrapRef<T>
      return response.data as T // For direct request usage
    } catch (err) {
      error.value = handleError(err)
      throw error.value
    } finally {
      isLoading.value = false
      controller = null
    }
  }

  // Clean up pending requests on component unmount
  onUnmounted(() => controller?.abort())

  return {
    data: data,
    error: error,
    isLoading: isLoading,
    call
  }
}

// Converts various error types into a consistent format
function handleError (e: Error | AxiosError | unknown): ApiError {
  const { t } = i18n.global
  const defaultResponse = { message: 'Unknown error', code: 0 }

  if (axios.isCancel(e)) {
    return { message: 'Request has been canceled', code: 0 }
  }

  if (!(e instanceof AxiosError)) {
    return e instanceof Error
      ? { message: e.message, code: 0 }
      : defaultResponse
  }

  const code = e.response?.status ?? 0
  const messageKey = e.response?.data?.key
  const serverError = e.response?.data?.error

  if (code === 500) {
    return { message: t('errors.server'), code }
  }

  if (messageKey) {
    return { message: t(messageKey), code }
  }

  if (serverError) {
    return { message: serverError, code }
  }

  return {
    code,
    message: `${t('errors.network_fail')} ${e.message}`,
  }
}
