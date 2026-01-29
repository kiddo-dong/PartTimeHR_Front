'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/app/providers/StoreProvider';
import { useAuth } from '@/app/providers/AuthProvider';

export default function Header() {
  const { currentStoreId } = useStore();
  const { employer, logout, loading } = useAuth();
  const pathname = usePathname();

  // 매장 선택 페이지인지 확인
  const isStoreSelectPage = pathname === '/store';

  if (loading) return null;

  return (
    <header className="fixed top-0 z-50 w-full h-20 bg-[#F7F0E0] border-b flex items-center px-6">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <img
          src="/al-bam_logo.png"
          alt="al-bam logo"
          className="w-8 h-8 object-contain"
        />
        <div className="font-bold text-lg">al-bam</div>
      </div>

      {/* 메뉴 */}
      <nav className="ml-auto flex gap-6 text-sm items-center">
        {/* 사장님 정보 */}
        {employer && (
          <span className="font-medium text-gray-700">
            {employer.name} 사장님
          </span>
        )}

        {/* 매장 관련 */}
        {isStoreSelectPage ? (
          <Link href="/store">매장</Link>
        ) : (
          <Link href="/store">매장 변경</Link>
        )}

        {/* 로그아웃 */}
        <button
          onClick={logout}
          className="text-red-500 hover:underline"
        >
          로그아웃
        </button>
      </nav>
    </header>
  );
}
