import { onUnmounted, readonly, ref } from 'vue'
import { i18n } from '@locales/_i18n.ts'
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'

interface ApiErrorResponse {
  message: string
  key: string
}

export interface ApiError {
  message: string,
  code: number
}

const instance = ref<null | AxiosInstance>(null)
let isTokenRefreshing = false

function createAxios () {
  const baseURL: string = import.meta.env.VITE_API_URL
  if (!instance.value) {
    instance.value = axios.create({
      baseURL,
      withCredentials: true,
      withXSRFToken: true,
    })

    instance.value.interceptors.response.use(response => response, err => interceptError(err))
  }
}

async function interceptError(err: AxiosError) {
  if (!err.response || !err.config) {
    return Promise.reject(err)
  }

  const status = err.response.status

  if (err.config.url === '/auth/csrf-cookie') {
    return Promise.reject(err)
  }

  if (status === 419) {
    if (!isTokenRefreshing) {
      isTokenRefreshing = true
      try {
        await instance.value!.request({ url: '/auth/csrf-cookie' })
      } finally {
        isTokenRefreshing = false
      }
    }
    // Token refreshed, repeat request
    return instance.value!(err.config)
  }

  return Promise.reject(err)
}

export function useApi<T> () {
  const data = ref<T | null>(null)
  const error = ref<ApiError | null>(null)
  const isLoading = ref(false)
  let controller: AbortController | null = null

  createAxios()

  const call = async (config: AxiosRequestConfig) => {
    isLoading.value = true
    error.value = null
    controller?.abort()

    controller = new AbortController()

    try {
      const response = await instance.value!.request({
        ...config,
        // headers: {
        //   //'NP-User-Agent': userAuthStore.agent
        // },
        signal: controller.signal
      })
      data.value = response.data
      return response.data as T // For direct request usage
    } catch (err) {
      error.value = handleError(err)
      throw error.value
    } finally {
      isLoading.value = false
      controller = null
    }
  }

  onUnmounted(() => controller?.abort())

  return {
    data: readonly(data),
    error: readonly(error),
    isLoading: readonly(isLoading),
    call
  }
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
    return { message: 'Unknown error', code: 0 }
  }
}
