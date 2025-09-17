import Cookies from 'js-cookie';

// If js-cookie is not installed, run: npm install js-cookie
// Also install types: npm install -D @types/js-cookie

const AUTHORIZATION_KEY = "authorization";

export const setToken = (token: string): void => {
  Cookies.set(AUTHORIZATION_KEY, token, {
    path: "/",
    expires: 30, // 30 days
    sameSite: "strict",
    // Only use secure: true in production with HTTPS
    secure: window.location.protocol === 'https:'
  });
};

export const getToken = (): string | null => {
  return Cookies.get(AUTHORIZATION_KEY) || null;
};

export const removeToken = (): void => {
  Cookies.remove(AUTHORIZATION_KEY, { path: "/" });
};
