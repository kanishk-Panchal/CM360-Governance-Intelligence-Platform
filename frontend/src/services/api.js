import axios from 'axios';


const isProduction = import.meta.env.PROD;
const API = axios.create({
baseURL: isProduction 
    ? 'https://cm360.up.railway.app/api' 
    : 'http://localhost:5000/api',});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cm360_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;