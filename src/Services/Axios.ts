import axios from 'axios';

const createAxios = () => {
  const axiosInstance = axios.create({
    baseURL: 'https://calendar-nodejs.onrender.com/',  
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default createAxios;
