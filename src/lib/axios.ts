import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

API.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh = Cookies.get("refresh");
                if (!refresh) throw new Error("No refresh token");

                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh/`, // Check your URL path
                    { refresh: refresh }
                );

                const newAccess = res.data.access;
                
                Cookies.set("access", newAccess, { expires: 1, secure: true, sameSite: 'strict' });

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                
                return API(originalRequest);

            } catch (refreshError) {
                Cookies.remove("access");
                Cookies.remove("refresh");
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default API;