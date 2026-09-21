import axios from 'axios';

const api = axios.create({
    baseURL : import.meta.env.JOB_API_URL,
    withCredentials : true
})

export default api;