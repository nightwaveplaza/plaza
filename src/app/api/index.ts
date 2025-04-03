import axios, { AxiosError } from 'axios'

const baseURL: string = import.meta.env.VITE_API_URL
let isTokenRefreshing = false

const instance = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
})

instance.interceptors.response.use(response => response, err => interceptError(err))

async function interceptError (err: AxiosError) {
  if (!err.response || !err.config) {
    return Promise.reject(err)
  }

  const status = err.response.status

  if (status === 419 && err.config.url !== '/auth/csrf-cookie') {
    if (!isTokenRefreshing) {
      isTokenRefreshing = true
      try {
        await instance.request({ url: '/auth/csrf-cookie' })
      } finally {
        isTokenRefreshing = false
      }
    }
    // Token refreshed, repeat request
    return instance(err.config)
  }

  return Promise.reject(err)
}

export default instance
