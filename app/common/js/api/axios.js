import axios from 'axios'
import { userStore } from '@common/js/stores/user-store'

const baseURL = process.env.API_URL
const instance = axios.create({ baseURL })

instance.interceptors.request.use(function (config) {
  config.headers['X-Access-Token'] = userStore.state.token
  // TODO config.headers['NP-User-Agent'] = store.getters.userAgent;
  return config
})

export default instance
