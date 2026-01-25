'use client';

import { useRouter } from 'next/navigation';
import { Briefcase, Store, Users, Calendar } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';

export default function Home() {
  const router = useRouter();

  const features = [
    { icon: <Store className="w-6 h-6 text-[#825511]" />, title: '매장 관리', description: '매장 정보를 한눈에 관리하고 쉽게 조회할 수 있어요.' },
    { icon: <Users className="w-6 h-6 text-[#825511]" />, title: '직원 관리', description: '직원 출퇴근, 근무 스케줄을 쉽게 관리할 수 있어요.' },
    { icon: <Calendar className="w-6 h-6 text-[#825511]" />, title: '스케줄 관리', description: '주간/월간 근무 스케줄을 계획하고 자동 알림을 받을 수 있어요.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4 py-12">
      {/* 로고 + 소개 */}
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl shadow-lg mb-6 animate-bounce overflow-hidden">
          <img
            src="/al-bam.png"          // 이미지 경로
            alt="Logo"
            className="object-contain"
          />
      </div>

        <h1 className="text-4xl font-bold mb-2 text-center">al-bam</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          매장과 직원을 한 번에 관리하세요. <br />
          쉽고 빠른 업무 관리를 경험해보세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="w-40 h-12 text-base hover:bg-[#F7F0E0]" onClick={() => router.push('/login')}>로그인</Button>
          <Button className="w-40 h-12 text-base hover:bg-[#F7F0E0]" variant="outline" onClick={() => router.push('/signup')}>회원가입</Button>
        </div>
      </div>

      {/* 기능 카드 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => (
          <Card key={feature.title} className="rounded-2xl shadow-md hover:shadow-lg transition cursor-default hover:bg-[#F7F0E0]">
            <CardHeader className="flex items-center gap-3">{feature.icon}<CardTitle className="text-lg font-semibold">{feature.title}</CardTitle></CardHeader>
            <CardContent><CardDescription className="text-sm text-muted-foreground">{feature.description}</CardDescription></CardContent>
          </Card>
        ))}
      </div>

      {/* CTA 섹션 */}
      <div className="relative overflow-hidden bg-[#F7F0E0] rounded-3xl py-12 px-6 text-center text-white max-w-5xl mx-auto shadow-lg">
        {/* 10개 이상 랜덤 배경 아이콘 */}
        <div className="absolute opacity-10 animate-floating" style={{ top: '5%', left: '10%' }}><Briefcase className="w-20 h-20 text-gray-600" /></div>
        <div className="absolute opacity-10 animate-floating-delay1" style={{ top: '15%', right: '15%' }}><Store className="w-24 h-24 text-gray-600" /></div>
        <div className="absolute opacity-5 animate-floating-delay2" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}><Users className="w-28 h-28 text-gray-600" /></div>
        <div className="absolute opacity-10 animate-floating-delay3" style={{ bottom: '10%', left: '20%' }}><Calendar className="w-20 h-20 text-gray-600" /></div>
        <div className="absolute opacity-5 animate-floating-delay4" style={{ top: '60%', right: '25%' }}><Briefcase className="w-32 h-32 text-gray-600" /></div>
        <div className="absolute opacity-10 animate-floating-delay5" style={{ bottom: '5%', right: '10%' }}><Store className="w-24 h-24 text-gray-600" /></div>
        <div className="absolute opacity-5 animate-floating" style={{ top: '25%', left: '70%' }}><Users className="w-28 h-28 text-gray-600" /></div>
        <div className="absolute opacity-5 animate-floating-delay1" style={{ top: '40%', left: '15%' }}><Calendar className="w-20 h-20 text-gray-600" /></div>
        <div className="absolute opacity-5 animate-floating-delay2" style={{ bottom: '20%', right: '40%' }}><Briefcase className="w-24 h-24 text-gray-600" /></div>
        <div className="absolute opacity-5 animate-floating-delay3" style={{ top: '70%', left: '50%', transform: 'translateX(-50%)' }}><Store className="w-32 h-32 text-gray-600" /></div>
        {/* CTA 텍스트 */}
        <h2 className="text-3xl font-bold mb-4 relative z-10 text-black">지금 바로 al-bam을 시작하세요!</h2>
        <p className="text-lg mb-6 relative z-10 text-black">매장과 직원을 효율적으로 관리하고 업무 시간을 단축하세요.</p>
        <Button className="w-44 h-12 text-base bg-white text-black hover:bg-gray-100 relative z-10" onClick={() => router.push('/signup')}>
          무료 회원가입
        </Button>
      </div>
    </div>
  );
}
