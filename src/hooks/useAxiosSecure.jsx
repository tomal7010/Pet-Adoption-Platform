import axios from 'axios';

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: 'https://server12-sage.vercel.app', // backend URL
  });

  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access-token'); // localStorage  token 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
