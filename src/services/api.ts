import axios from 'axios'
import { getToken } from '../utils/handleToken';

const api = axios.create({
  baseURL : import.meta.env.VITE_API_URL?.toString() || ""
})

const token = getToken();
api.interceptors.request.use(async config => {
  if (token) {
    if(config.headers && !config.headers?.Authorization){
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
  

export default api