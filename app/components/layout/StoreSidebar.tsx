'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/app/providers/StoreProvider';

interface Menu {
  title: string;
  basePath: string;
  subs: { title: string; path: string }[];
}

export default function StoreSidebar() {
  const { currentStoreId } = useStore();
  const pathname = usePathname();

  /** ✅ 여러 메뉴 열림 상태 관리 */
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  const menus: Menu[] = [
    {
      title: '대시보드',
      basePath: 'dashboard',
      subs: [
        { title: '오늘 현황', path: 'today' },
        { title: '이번 주 현황', path: 'week' },
        { title: '알림', path: 'alerts' },
      ],
    },
    {
      title: '직원 관리',
      basePath: 'employees',
      subs: [
        { title: '직원 목록', path: 'list' },
        { title: '직원 추가', path: 'new' },
      ],
    },
    {
      title: '스케줄 관리',
      basePath: 'schedules',
      subs: [
        { title: '일간 스케줄', path: 'daily' },
        { title: '주간 스케줄', path: 'weekly' },
        { title: '출퇴근 기록', path: 'attendance' },
        { title: '결근 / 연장', path: 'exceptions' },
      ],
    },
    {
      title: '매장 설정',
      basePath: 'settings',
      subs: [
        { title: '매장 정보', path: 'store' },
        { title: '근무 정책', path: 'policy' },
        { title: '급여 설정', path: 'pay' },
      ],
    },
  ];

  /**
   * ✅ URL 직접 접근 / 새로고침 시
   * 해당 메뉴는 "자동으로 열어주기만"
   * (기존에 열려있던 건 절대 닫지 않음)
   */
  useEffect(() => {
    if (!currentStoreId) return;

    const found = menus.find((menu) =>
      pathname.includes(`/${menu.basePath}`)
    );

    if (found) {
      setOpenMenus((prev) => {
        const next = new Set(prev);
        next.add(found.basePath);
        return next;
      });
    }
  }, [pathname, currentStoreId]);

  if (!currentStoreId) return null;

  return (
    <aside className="w-60 bg-[#F7F0E0] p-6 fixed h-full">
      <h2 className="text-xl font-bold mb-6">메뉴</h2>

      <nav className="flex flex-col gap-4 text-sm">
        {menus.map((menu) => {
          const opened = openMenus.has(menu.basePath);
          const baseUrl = `/store/${currentStoreId}/${menu.basePath}`;

          return (
            <div key={menu.basePath}>
              {/* 상위 메뉴 */}
              <button
                onClick={() =>
                  setOpenMenus((prev) => {
                    const next = new Set(prev);
                    opened
                      ? next.delete(menu.basePath)
                      : next.add(menu.basePath);
                    return next;
                  })
                }
                className={`w-full flex items-center justify-between font-medium transition-colors
                  ${
                    opened
                      ? 'text-black'
                      : 'text-gray-600 hover:text-black'
                  }
                `}
              >
                {menu.title}
                <motion.span
                  animate={{ rotate: opened ? 90 : 0 }}
                  transition={{ duration: 0.25 }}
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
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="ml-4 mt-2 overflow-hidden flex flex-col gap-1"
                  >
                    {menu.subs.map((sub) => {
                      const fullPath = `${baseUrl}/${sub.path}`;
                      const active = pathname === fullPath;

                      return (
                        <Link
                          key={sub.path}
                          href={fullPath}
                          className={`relative pl-3 py-1 rounded transition-all
                            ${
                              active
                                ? 'bg-white text-black font-semibold'
                                : 'text-gray-500 hover:text-black hover:bg-white/60 hover:translate-x-1'
                            }
                          `}
                        >
                          {active && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-black rounded-r" />
                          )}
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
  );
}
