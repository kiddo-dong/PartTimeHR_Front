'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/app/providers/StoreProvider';

interface Menu {
  title: string;
  basePath: string;
  icon: string;
  subs: { title: string; path: string }[];
}

interface StoreSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function StoreSidebar({ collapsed, setCollapsed }: StoreSidebarProps) {
  const { currentStoreId } = useStore();
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  const menus: Menu[] = [
    {
      title: '대시보드',
      basePath: 'dashboard',
      icon: '📊',
      subs: [
        { title: '메인', path: '' },
        { title: '오늘 현황', path: 'today' },
        { title: '이번 주 현황', path: 'week' },
        { title: '알림', path: 'alerts' },
      ],
    },
    {
      title: '스케줄 관리',
      basePath: 'schedules',
      icon: '🗓️',
      subs: [
        { title: '일간 스케줄', path: 'daily' },
        { title: '주간 스케줄', path: 'weekly' },
        { title: '월간 스케줄', path: 'monthly' },
        { title: '출퇴근 기록', path: 'attendance' },
        { title: '결근 / 연장', path: 'exceptions' },
      ],
    },
    {
      title: '근태 관리',
      basePath: 'attendance',
      icon: '📋',
      subs: [
        { title: '출퇴근 기록', path: 'attendance' },
        { title: '결근 / 연장', path: 'exceptions' },
      ],
    },
    {
      title: '직원 관리',
      basePath: 'employees',
      icon: '👥',
      subs: [
        { title: '직원 목록', path: '' },
        { title: '직원 추가', path: 'new' },
      ],
    },
    {
      title: '매장 설정',
      basePath: 'settings',
      icon: '⚙️',
      subs: [
        { title: '매장 정보', path: 'store' },
        { title: '급여 정책', path: 'paypolicy' },
      ],
    },
  ];

  /** URL 접근 시 해당 메뉴 자동 오픈 */
  useEffect(() => {
    if (!currentStoreId) return;
    menus.forEach((menu) => {
      const menuId = `${menu.basePath}-${menu.title}`;
      if (pathname.includes(`/${menu.basePath}`)) {
        setOpenMenus((prev) => new Set(prev).add(menuId));
      }
    });
  }, [pathname, currentStoreId]);

  if (!currentStoreId) return null;

  return (
    <motion.div
      initial={false}
      animate={{ x: collapsed ? -240 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] flex"
    >
      {/* ================= 사이드바 ================= */}
      <aside className="w-[240px] bg-[#F7F0E0] p-4">
        <h2 className="mb-6 text-lg font-bold">메뉴</h2>

        <nav className="flex flex-col gap-4 text-sm">
          {menus.map((menu) => {
            const menuId = `${menu.basePath}-${menu.title}`;
            const opened = openMenus.has(menuId);
            const baseUrl = `/store/${currentStoreId}/${menu.basePath}`;

            return (
              <div key={menuId}>
                {/* 상위 메뉴 */}
                <button
                  onClick={() =>
                    setOpenMenus((prev) => {
                      const next = new Set(prev);
                      opened ? next.delete(menuId) : next.add(menuId);
                      return next;
                    })
                  }
                  className="w-full flex items-center justify-between font-medium text-gray-700 hover:text-black"
                >
                  <span className="flex items-center gap-2">
                    <span>{menu.icon}</span>
                    {menu.title}
                  </span>

                  <motion.span
                    animate={{ rotate: opened ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▶
                  </motion.span>
                </button>

                {/* 서브 메뉴 */}
                <AnimatePresence initial={false}>
                  {opened && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="ml-6 mt-2 flex flex-col gap-1"
                    >
                      {menu.subs.map((sub, subIdx) => {
                        const fullPath = `${baseUrl}/${sub.path}`;
                        const active = pathname === fullPath;

                        return (
                          <Link
                            key={`${menuId}-${sub.path}-${subIdx}`}
                            href={fullPath}
                            className={`block rounded px-3 py-1 transition-all ${
                              active
                                ? 'bg-white font-semibold text-black'
                                : 'text-gray-500 hover:bg-white/60 hover:text-black'
                            }`}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ================= 접기 핸들 버튼 ================= */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-3 h-20 bg-[#F7F0E0] backdrop-blur border border-gray-200 rounded-r-full shadow-sm flex items-center justify-center text-gray-400 hover:w-4 hover:text-gray-700 hover:shadow-md transition-all absolute left-full top-1/2 -translate-y-1/2"
      >
        <span className="text-xs">{collapsed ? '›' : '‹'}</span>
      </button>
    </motion.div>
  );
}