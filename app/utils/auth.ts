// app/utils/auth.ts
const TOKEN_KEY = 'accessToken';
const STORE_KEY = 'currentStoreId';

export const authService = {
  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORE_KEY);
  },

  setCurrentStore(storeId: number) {
    localStorage.setItem(STORE_KEY, String(storeId));
  },

  getCurrentStore() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORE_KEY);
  }
};
