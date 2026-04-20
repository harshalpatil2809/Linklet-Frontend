import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access';
const REFRESH_TOKEN_KEY = 'refresh';

export const setTokens = (access: string, refresh: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, access, { expires: 1, secure: true, sameSite: 'strict' });
  Cookies.set(REFRESH_TOKEN_KEY, refresh, { expires: 7, secure: true, sameSite: 'strict' });
};

export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY);

export const logout = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  window.location.href = '/login';
};