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




// import axios from 'axios';
// import { useEffect } from 'react';

// const axiosSecure = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// const useAxiosSecure = () => {

//   useEffect(() => {

//     const requestInterceptor =
//       axiosSecure.interceptors.request.use(config => {

//   const token = localStorage.getItem('access-token');

//   if(token){
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

//     const responseInterceptor =
//       axiosSecure.interceptors.response.use(
//         (response) => response,
//         (error) => {

//           if (
//             error.response?.status === 401 ||
//             error.response?.status === 403
//           ) {
//             localStorage.removeItem('access-token');
//           }

//           return Promise.reject(error);
//         }
//       );

//     return () => {
//       axiosSecure.interceptors.request.eject(requestInterceptor);
//       axiosSecure.interceptors.response.eject(responseInterceptor);
//     };

//   }, []);

//   return axiosSecure;
// };

// export default useAxiosSecure;



// const axiosSecure = axios.create({
//   baseURL: "http://localhost:5000"
// })

// const useAxiosSecure = () => {

//   const { user } = useAuth();

// useEffect( () => {
//   axiosSecure.interceptors.request.use(config => {
//     config.headers.Authorization= `Bearer ${user?.accessToken}`
//     console.log("useaxiossecure", config.headers.Authorization)
//     return config;
//   })
// }, [user])

//   useEffect(() => {
//   const interceptor = axiosSecure.interceptors.request.use(
//     config => {

//       if (user?.accessToken) {
//         config.headers.Authorization = `Bearer ${user.accessToken}`;
//       }

//       return config;
//     }
//   );

//   return () => {
//     axiosSecure.interceptors.request.eject(interceptor);
//   };
// }, [user]);

//   useEffect(() => {
//     const interceptor =
//       axiosSecure.interceptors.request.use(config => {

//         if (user?.accessToken) {
//           config.headers.Authorization =
//             `Bearer ${user.accessToken}`;
//         }

//         return config;
//       });

//     return () => {
//       axiosSecure.interceptors.request.eject(interceptor);
//     };
//   }, [user]);

//   return axiosSecure
// }

// export default useAxiosSecure;