'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full h-16 bg-white border-b flex items-center px-6">
      <div className="font-bold text-lg">al-bam</div>

      <nav className="ml-auto flex gap-4 text-sm">
        <Link href="/store">매장</Link>
        <Link href="/logout">로그아웃</Link>
      </nav>
    </header>
  );
}
