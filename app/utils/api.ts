// app/utils/api.ts
import { authService } from './auth';

const BASE_URL = 'http://localhost:8080';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = authService.getToken();

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API 요청 실패');
  }

  return res.json();
}

export const storeApi = {
  getAll() {
    return fetchWithAuth('/api/stores');
  }
};
