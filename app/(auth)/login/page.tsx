'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/utils/auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Briefcase } from 'lucide-react';
import Footer from '@/app/components/layout/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '로그인 실패');

      authService.saveToken(data.accessToken);
      router.push('/store');
    } catch (err: any) {
      setError(err.message || '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
                <div className="flex flex-col items-center mb-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl shadow-lg mb-6 overflow-hidden">
                <img
                  src="/al-bam.png"          // 이미지 경로
                  alt="Logo"
                  className="object-contain"
                />
            </div>
          </div>
          <h1 className="text-3xl font-bold">al-bam</h1>
          <p className="text-sm text-muted-foreground mt-1">
            매장 및 직원을 한 번에 관리하세요.
          </p>
        </div>

        {/* 로그인 카드 */}
        <Card className="border-0 shadow-xl rounded-3xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">로그인</CardTitle>
            <CardDescription className="text-center">
              사장님용 로그인
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">이메일을 입력해주세요</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="albam@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호를 입력해주세요.</Label>
                <Input
                id="password"
                type="password"
                placeholder="8자 이상 ~ 20자 이하, 영문, 숫자, 특수문자 포함"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black h-12"
              />

              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-base shadow-lg hover:shadow-xl transition"
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            {/* 회원가입 링크 */}
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                아직 계정이 없나요?{' '}
                <button
                  onClick={() => router.push('/signup')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  회원가입
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <Footer />
      
      </div>
    </div>
  );
}