// app/providers/AuthProvider.tsx
'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { authService } from '@/app/utils/auth';

interface Employer {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  employer: Employer | null;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    authService.logout();
    setEmployer(null);
    window.location.href = '/login';
  };

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
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadMe();
  }, []);

  return (
    <AuthContext.Provider value={{ employer, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** 🔥 이거 하나로 끝 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
