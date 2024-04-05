import axios, { AxiosError } from 'axios'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'

const baseURL: string = import.meta.env.VITE_API_URL
const instance = axios.create({ baseURL })

instance.interceptors.request.use((config) => {
  const userAuthStore = useUserAuthStore()
  config.headers['Authorization'] = 'Bearer ' + userAuthStore.token
  config.headers['NP-User-Agent'] = userAuthStore.agent
  return config
})

instance.interceptors.response.use(
  resp => resp,
  rej => {
    if (rej.isAxiosError) {
      if (rej.response && rej.response.data.error) {
        rej.message = rej.response.data.error
      }
    }
    return Promise.reject(rej);
  })

export default instance
