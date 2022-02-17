export const TOKEN_KEY = "@wpp-Token";

export const isAuthenticated = () => sessionStorage.getItem(TOKEN_KEY) !== null;

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};
export const removeToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};