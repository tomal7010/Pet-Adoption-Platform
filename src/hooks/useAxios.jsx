import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://server12-sage.vercel.app`
})

const useAxios = () => {
    return axiosInstance;
};


export default useAxios;