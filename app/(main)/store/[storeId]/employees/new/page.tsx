'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authService } from '@/app/utils/auth';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface PayPolicy {
  id: number;
  jobTitle: string;
  hourlyWage: number;
}

export default function EmployeeCreatePage() {
  const { storeId } = useParams();
  const router = useRouter();

  const [payPolicies, setPayPolicies] = useState<PayPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /** ✅ input용 state는 전부 string */
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    payPolicyId: '' as string, // select도 string으로
  });

  /* 급여 정책 조회 */
  useEffect(() => {
    async function fetchPayPolicies() {
      try {
        const token = authService.getToken();
        const res = await fetch(
          `http://13.125.140.255/api/stores/${storeId}/paypolicies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('급여 정책을 불러오지 못했습니다.');
        }

        const data = await res.json();
        setPayPolicies(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPayPolicies();
  }, [storeId]);

  /** ✅ null 처리 절대 안 함 */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = authService.getToken();

      /** ✅ 서버 전송용 payload에서만 null 변환 */
      const payload = {
        email: form.email,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        name: form.name,
        phone: form.phone, // ❗ null 변환 제거
        payPolicyId:
          form.payPolicyId === '' ? null : Number(form.payPolicyId),
      };


      const res = await fetch(
        `http://13.125.140.255/api/stores/${storeId}/employees`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error('직원 생성에 실패했습니다.');
      }

      router.push(`/store/${storeId}/employees`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p></p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>직원 추가</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>이메일</Label>
            <Input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div>
            <Label>비밀번호</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>이름</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <Label>전화번호</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div>
            <Label>직급 및 급여</Label>
            <select
              name="payPolicyId"
              value={form.payPolicyId}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">기본 급여 정책</option>
              {payPolicies.map((policy) => (
                <option key={policy.id} value={policy.id}>
                  [직급 {policy.jobTitle}] · 시급{' '}
                  {policy.hourlyWage.toLocaleString()}원
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/store/${storeId}/employees`)
              }
            >
              취소
            </Button>
            <Button onClick={handleSubmit}>직원 추가</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
