const TOKEN_KEY = 'accessToken';
const STORE_KEY = 'currentStoreId';

export const authService = {
  saveToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setCurrentStore(storeId: number) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORE_KEY, String(storeId));
  },

  getCurrentStore(): number | null {
    if (typeof window === 'undefined') return null;
    const val = localStorage.getItem(STORE_KEY);
    return val ? Number(val) : null;
  },

  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORE_KEY);
  },

  logout() {
    if (typeof window === 'undefined') return;
    this.clear();
    window.location.href = '/login';
  },

  setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
};
