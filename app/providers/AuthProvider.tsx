// app/providers/AuthProvider.tsx
'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    authService.clear();        // ✅ 토큰 삭제
    setEmployer(null);
    router.replace('/login');   // ✅ App Router 방식
  };

  useEffect(() => {
    async function loadMe() {
      try {
        const token = authService.getToken();
        if (!token) throw new Error('no token');

        const res = await fetch(`http://13.125.140.255/api/employers/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('unauthorized');

        const data = await res.json();
        setEmployer(data);
      } catch {
        logout(); // ✅ 여기서도 동일한 logout 사용
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
