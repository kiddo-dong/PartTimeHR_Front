'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/app/utils/auth';

interface StoreContextType {
  currentStoreId: number | null;
  setCurrentStoreId: (id: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [currentStoreId, setCurrentStoreIdState] = useState<number | null>(null);

  useEffect(() => {
    const saved = authService.getCurrentStore();
    if (saved) setCurrentStoreIdState(Number(saved));
  }, []);

  const setCurrentStoreId = (id: number) => {
    authService.setCurrentStore(id);
    setCurrentStoreIdState(id);
  };

  return (
    <StoreContext.Provider value={{ currentStoreId, setCurrentStoreId }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
