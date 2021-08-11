import axios from 'axios'
import { getToken } from '../utils/handleToken';

const api = axios.create({
  baseURL : process.env.REACT_APP_API_URL
})
console.log(process.env.REACT_APP_API_URL)

const token = getToken();
api.interceptors.request.use(async config => {
  if (token) {
    if(!config.headers.Authorization){
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
  

export default api