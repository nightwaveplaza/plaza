import axios from 'axios'
import { userStore } from '@common/js/store/user'

const baseURL = import.meta.env.VITE_API_URL
const instance = axios.create({ baseURL })

instance.interceptors.request.use(function (config) {
  config.headers['Authorization'] = 'Bearer ' + userStore.state.token
  config.headers['NP-User-Agent'] = userStore.state.agent
  return config
})

export default instance
