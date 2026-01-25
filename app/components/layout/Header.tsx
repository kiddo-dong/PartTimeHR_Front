'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full h-16 bg-[#F7F0E0] border-b flex items-center px-6">
      <div className="flex items-center gap-2">
        <img
          src="/al-bam_logo.png"
          alt="al-bam logo"
          className="w-8 h-8 object-contain"
        />
        <div className="font-bold text-lg">al-bam</div>
      </div>

      <nav className="ml-auto flex gap-4 text-sm">
        <Link href="/store">매장</Link>
        <Link href="/logout">로그아웃</Link>
      </nav>
    </header>

  );
}
