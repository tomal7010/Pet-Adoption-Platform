/*import React from 'react';
import useAuth from './useAuth';
import axios from 'axios';


const axiosSecure = axios.create({
    baseURL: `http://localhost:3000`
})

const useAxiosSecure = () => {
    const {user } = useAuth();

    axiosSecure.interceptors.request.use(config =>{
        config.headers.Authorization = `Bearer ${user.accessToken}`
        return config;
    }, error =>{
        return Promise.reject(error);
    })


    return axiosSecure;
};

export default useAxiosSecure;
*/

// useAxiosSecure.js
import axios from 'axios';

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000', // backend URL
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
