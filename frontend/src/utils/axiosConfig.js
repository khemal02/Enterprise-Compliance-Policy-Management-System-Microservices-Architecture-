import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8088"
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let sessionExpiredNotified = false;

api.interceptors.response.use(
    (response) => response,
    (error) => {

        const status = error?.response?.status;
        const isOnLoginPage = window.location.pathname === "/";

        if ((status === 401 || status === 403) && !isOnLoginPage) {

            if (!sessionExpiredNotified) {
                sessionExpiredNotified = true;
                toast.error("Your session has expired. Please log in again.");
            }

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;
