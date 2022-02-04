import axios from 'axios';
import userStore from '@base/store/user';

const baseURL = process.env.API_URL;
const instance = axios.create({baseURL});

instance.interceptors.request.use(function(config) {
  config.headers['X-Access-Token'] = userStore.state.token;
  config.headers['NP-User-Agent'] = userStore.state.agent;
  return config;
});

export default instance;
