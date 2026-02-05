'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authService } from '@/app/utils/auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function EmployeeEditPage() {
  const params = useParams();
  const router = useRouter();

  // useParams에서 가져온 값이 배열일 수 있으므로 문자열로 변환
  const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;
  const employeeId = Array.isArray(params.employeeId) ? params.employeeId[0] : params.employeeId;

  // ✅ input state는 무조건 문자열
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [payPolicyId, setPayPolicyId] = useState<number>(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔹 직원 정보 조회
  useEffect(() => {
    // employeeId가 없으면 API 호출하지 않음
    if (!storeId || !employeeId) {
      setError('직원 ID를 찾을 수 없습니다.');
      setLoading(false);
      return;
    }

    async function fetchEmployee() {
      try {
        const token = authService.getToken();

        const res = await fetch(
          `http://13.125.140.255/api/stores/${storeId}/employees/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('직원 정보를 불러오지 못했습니다.');
        }

        const data = await res.json();

        // ✅ undefined / null 방어
        setName(data.name ?? '');
        setPhone(data.phone ?? '');
        setPayPolicyId(data.payPolicyId ?? 1);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [storeId, employeeId]);

  // 🔹 수정 요청
  async function handleSubmit() {
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const token = authService.getToken();

      const body: any = {
        name,
        phone,
        payPolicyId,
      };

      // 비밀번호 입력한 경우에만 전송
      if (password) {
        body.password = password;
        body.passwordConfirm = passwordConfirm;
      }

      if (!storeId || !employeeId) {
        alert('매장 ID 또는 직원 ID를 찾을 수 없습니다.');
        return;
      }

      const res = await fetch(
        `http://13.125.140.255/api/stores/${storeId}/employees/${employeeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        throw new Error('직원 정보 수정에 실패했습니다.');
      }

      router.push(`/store/${storeId}/employees/${employeeId}`);
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return <p className="p-6">로딩 중...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>직원 정보 수정</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="전화번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            type="password"
            placeholder="비밀번호 (변경 시에만 입력)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit}>
              저장
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
