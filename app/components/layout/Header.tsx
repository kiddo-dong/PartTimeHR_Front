'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/app/providers/StoreProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentStoreId } = useStore();
  const { employer, logout, loading } = useAuth();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isStoreSelectPage = pathname === '/store';

  if (loading) return null;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 z-50 w-full border-b flex items-center px-6
        ${scrolled ? 'h-16 shadow-sm' : 'h-20'}
        bg-[#F7F0E0] transition-all duration-300`}
    >
      {/* 로고 */}
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src="/al-bam_logo.png"
          alt="al-bam logo"
          className="w-8 h-8 object-contain"
        />
        <div className="font-bold text-lg">al-bam</div>
      </motion.div>

      {/* 메뉴 */}
      <nav className="ml-auto flex gap-6 text-sm items-center">
        {/* 사장님 정보 */}
        {employer && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-medium text-gray-700"
          >
            {employer.name} 사장님
          </motion.span>
        )}

        {/* 매장 */}
        <AnimatedLink href="/store">
          {isStoreSelectPage ? '매장' : '매장 변경'}
        </AnimatedLink>

        {/* 로그아웃 */}
        <motion.button
          onClick={logout}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.95 }}
          className="text-red-500 hover:underline"
        >
          로그아웃
        </motion.button>
      </nav>
    </motion.header>
  );
}

/* -------------------------------
   애니메이션 Link 컴포넌트
-------------------------------- */
function AnimatedLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div whileHover={{ y: -2 }}>
      <Link
        href={href}
        className="relative font-medium text-gray-800 after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:w-0 after:bg-gray-800 after:transition-all after:duration-300
        hover:after:w-full"
      >
        {children}
      </Link>
    </motion.div>
  );
}
