
import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";

const cookieOptions = {
    path: "/",
    secure:
        typeof window !== "undefined" &&
        window.location.protocol === "https:",
    sameSite: "strict" as const,
};

export const setTokens = (access: string, refresh: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, access, {
        ...cookieOptions,
        expires: 1,
    });

    Cookies.set(REFRESH_TOKEN_KEY, refresh, {
        ...cookieOptions,
        expires: 7,
    });
};

export const getAccessToken = () =>
    Cookies.get(ACCESS_TOKEN_KEY);

export const logout = () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });

    window.location.href = "/login";
};
