
import axios, {
    InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Separate Axios instance for refreshing tokens.
// This prevents the refresh request from triggering API interceptors.
const refreshAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Prevent multiple simultaneous refresh requests.
let refreshPromise: Promise<string> | null = null;

// Request interceptor
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

// Response interceptor
API.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config as RetryRequestConfig | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const requestURL = originalRequest.url || "";

        const isLoginRequest = requestURL.includes("/api/auth/login/");
        const isRefreshRequest = requestURL.includes("/api/auth/refresh/");

        // Don't refresh login or refresh requests.
        if (isLoginRequest || isRefreshRequest) {
            return Promise.reject(error);
        }

        // Only handle 401 errors.
        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            // Reuse an ongoing refresh request if one exists.
            if (!refreshPromise) {
                const refreshToken = Cookies.get("refresh");

                if (!refreshToken) {
                    throw new Error("Refresh token not available");
                }

                refreshPromise = refreshAPI
                    .post("/api/auth/refresh/", {
                        refresh: refreshToken,
                    })
                    .then((response) => {
                        const newAccess = response.data.access;

                        if (!newAccess) {
                            throw new Error("Access token not received");
                        }

                        Cookies.set("access", newAccess, {
                            expires: 1,
                            path: "/",
                            secure: window.location.protocol === "https:",
                            sameSite: "strict",
                        });

                        // Handle refresh token rotation if enabled.
                        if (response.data.refresh) {
                            Cookies.set("refresh", response.data.refresh, {
                                expires: 7,
                                path: "/",
                                secure: window.location.protocol === "https:",
                                sameSite: "strict",
                            });
                        }

                        return newAccess;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newAccess = await refreshPromise;

            // Retry the original request with the new access token.
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;

            return API(originalRequest);

        } catch (refreshError) {
            refreshPromise = null;

            Cookies.remove("access", { path: "/" });
            Cookies.remove("refresh", { path: "/" });

            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }

            return Promise.reject(refreshError);
        }
    }
);

export default API;
