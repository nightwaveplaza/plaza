import { onUnmounted, ref } from 'vue'
import Repository from '@app/api/axios.ts'
import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { i18n } from '@locales/_i18n.ts'

interface ApiErrorResponse {
  message: string
  key: string
}

interface ApiError {
  message: string,
  code: number
}

function handleError (e: Error | AxiosError | unknown): ApiError {
  const { t } = i18n.global

  if (axios.isCancel(e)) {
    return { message: 'Request has been canceled', code: 0 }
  }

  if (e instanceof AxiosError) {
    const code: number = e.response?.status ?? 0

    if (e.response?.status === 500) {
      return { message: t('errors.server'), code }
    }

    if (e.response?.data?.key) {
      return { message: t((<ApiErrorResponse>e.response.data).key), code }
    }

    return { message: t('errors.network_fail') + ' ' + e.message, code }
  }

  if (e instanceof Error) {
    return { message: e.message, code: 0 }
  } else {
    return { message: 'Unknown error', code: 0}
  }
}

export function useAxios<T> () {
  const data = ref<T | null>(null)
  const error = ref<ApiError | null>(null)
  const isLoading = ref(false)
  const controller = new AbortController()

  const call = async (config: AxiosRequestConfig) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await Repository.request({
        ...config,
        signal: controller.signal
      })
      data.value = response.data
      return response.data as T // For direct request usage
    } catch (err) {
      error.value = handleError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  onUnmounted(() => controller.abort())

  return {
    data,
    error,
    isLoading,
    call
  }
}
