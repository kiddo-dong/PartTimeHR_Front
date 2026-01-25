'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">al-bam</h1>
        <p className="text-lg text-muted-foreground mb-8">
          매장 및 직원을 한 번에 관리하세요.
        </p>
        <Button onClick={() => router.push('/login')} className="w-40 h-12 text-base">
          로그인 하러 가기
        </Button>
      </div>
    </div>
  );
}
