import axios from 'axios';
import { useEffect } from 'react';
// import useAuth from './useAuth';

const axiosSecure = axios.create({
  // baseURL: 'http://localhost:5000'
  baseURL: import.meta.env.VITE_API_URL
});

const useAxiosSecure = () => {

  useEffect(() => {

    // const interceptor = 
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem('access-token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }


      return config;
    });

    // return () => {
    //   axiosSecure.interceptors.request.eject(
    //     interceptor
    //   );
    // };

  }, []);

  return axiosSecure;
};

export default useAxiosSecure;




