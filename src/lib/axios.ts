
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

        // No response or request configuration
        if (!originalRequest) {
            return Promise.reject(error);
        }

        const requestURL = originalRequest.url || "";
        const isLoginRequest = requestURL.includes("/api/auth/login/");
        const isRefreshRequest = requestURL.includes("/api/auth/token/refresh/");

        if (isLoginRequest || isRefreshRequest) {
            return Promise.reject(error);
        }

        // Handle expired access token
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refresh = Cookies.get("refresh");

                if (!refresh) {
                    throw new Error("No refresh token available");
                }

                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh/`,
                    { refresh }
                );

                const newAccess = res.data.access;

                if (!newAccess) {
                    throw new Error("New access token not received");
                }

                Cookies.set("access", newAccess, {
                    expires: 1,
                    path: "/",
                    secure: window.location.protocol === "https:",
                    sameSite: "strict",
                });

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;

                return API(originalRequest);

            } catch (refreshError) {
                Cookies.remove("access", { path: "/" });
                Cookies.remove("refresh", { path: "/" });

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
