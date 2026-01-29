'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import StoreSidebar from '@/app/components/layout/StoreSidebar';

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* 사이드바에 collapsed 상태와 setCollapsed 전달 */}
      <StoreSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* 메인 영역 */}
      <motion.div
        className="flex-1 flex flex-col min-h-screen"
        animate={{ marginLeft: collapsed ? 0 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <main className="flex-1 p-6 pt-20">{children}</main>
      </motion.div>
    </div>
  );
}
