'use client';

import { ReactNode } from 'react';
import Header from '@/app/components/layout/Header';
import Link from 'next/link';
import { useStore } from '@/app/providers/StoreProvider';

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const { currentStoreId } = useStore();

  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <aside className="w-60 bg-[#F7F0E0] p-6 flex flex-col gap-4 fixed h-full">
        <h2 className="text-xl font-bold mb-6">메뉴</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href={`/store/${currentStoreId}`}>대시보드</Link>
          <Link href={`/store/${currentStoreId}/employees`}>직원 관리</Link>
          <Link href={`/store/${currentStoreId}/schedules`}>스케줄 관리</Link>
          <Link href={`/store/${currentStoreId}/settings`}>매장 설정</Link>
        </nav>
      </aside>

      {/* 메인 영역 */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 pt-20">{children}</main>
      </div>
    </div>
  );
}
