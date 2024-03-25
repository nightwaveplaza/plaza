import axios from 'axios'
import { useUserAuthStore } from '@common/js/stores/userAuthStore'

const baseURL: string = import.meta.env.VITE_API_URL
const instance = axios.create({ baseURL })

instance.interceptors.request.use(function (config) {
  const userAuthStore = useUserAuthStore()
  config.headers['Authorization'] = 'Bearer ' + userAuthStore.savedToken
  config.headers['NP-User-Agent'] = userAuthStore.agent
  return config
})

export default instance
