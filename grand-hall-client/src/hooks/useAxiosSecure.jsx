import axios from 'axios';
import { useEffect } from 'react';

const axiosSecure = axios.create({
  // baseURL: 'http://localhost:5000'
  baseURL: 'http://localhost:5000'
});

const useAxiosSecure = () => {

  useEffect(() => {

    // 🔥 Request interceptor
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {

        const token = localStorage.getItem('token');

        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 🔥 Cleanup interceptor
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };

  }, []);

  return axiosSecure;
};

export default useAxiosSecure;
