'use client';

import { ReactNode } from 'react';
import StoreSidebar from '@/app/components/layout/StoreSidebar';

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <StoreSidebar />

      {/* 메인 영역 */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}
