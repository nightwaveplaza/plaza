import axios, {
  type InternalAxiosRequestConfig,
  type AxiosInstance,
} from 'axios'
import { useUserAuthStore } from '@app/stores/userAuthStore'

const baseURL: string = import.meta.env.VITE_API_URL
const instance: AxiosInstance = axios.create({ baseURL })

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userAuthStore = useUserAuthStore()
  config.headers.Authorization = 'Bearer ' + userAuthStore.token
  config.headers['NP-User-Agent'] = userAuthStore.agent
  return config
})

instance.interceptors.response.use(
  resp => resp,
  rej => {
    if (rej.isAxiosError) {
      if (rej.response?.data.error) {
        rej.message = rej.response.data.error
      }
    }
    return Promise.reject(rej)
  })

export default instance
