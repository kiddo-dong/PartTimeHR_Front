'use client';

import Link from 'next/link';
import { useStore } from '@/app/providers/StoreProvider';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { currentStoreId } = useStore();
  const pathname = usePathname();

  // 매장 선택 페이지인지 확인
  const isStoreSelectPage = pathname === '/store';

  return (
    <header className="fixed top-0 z-50 w-full h-20 bg-[#F7F0E0] border-b flex items-center px-6">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <img src="/al-bam_logo.png" alt="al-bam logo" className="w-8 h-8 object-contain" />
        <div className="font-bold text-lg">al-bam</div>
      </div>

      {/* 메뉴 */}
      <nav className="ml-auto flex gap-4 text-sm items-center">
        {/* 매장 선택 페이지면 매장 + 로그아웃만 */}
        {isStoreSelectPage ? (
          <>
            <Link href="/store">매장</Link>
            <Link href="/logout">로그아웃</Link>
          </>
        ) : (
          <>
            <Link href="/store">매장 변경</Link>
            <Link href="/logout">로그아웃</Link>
          </>
        )}
      </nav>
    </header>
  );
}
