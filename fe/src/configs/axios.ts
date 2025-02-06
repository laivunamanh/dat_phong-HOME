import axios from 'axios'

const instance = axios.create({
    // baseURL: import.meta.env.VITE_BASE_URL
    baseURL: "http://localhost:8080/"
})
export default instance
