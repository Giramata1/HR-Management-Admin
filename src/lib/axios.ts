import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://hr-management-system-pmfp.onrender.com/api/auth',
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

export default axiosInstance;