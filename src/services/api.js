import axios from 'axios'
import { getToken } from '../utils/handleToken';

const api = axios.create({
    // baseURL : "https://chat-api-sobral.herokuapp.com/"
    baseURL : "http://localhost:3333"
})

const token = getToken();
api.interceptors.request.use(async config => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
  

export default api