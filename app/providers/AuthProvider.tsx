// app/providers/AuthProvider.tsx
'use client';

import { useEffect, useState, createContext } from 'react';
import { authService } from '@/app/utils/auth';

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMe() {
      try {
        const token = authService.getToken();
        if (!token) throw new Error();

        const res = await fetch('http://localhost:8080/api/employers/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setEmployer(data);
      } catch {
        authService.logout();
      } finally {
        setLoading(false);
      }
    }

    loadMe();
  }, []);

  if (loading) return null; // or splash

  return (
    <AuthContext.Provider value={{ employer }}>
      {children}
    </AuthContext.Provider>
  );
}
