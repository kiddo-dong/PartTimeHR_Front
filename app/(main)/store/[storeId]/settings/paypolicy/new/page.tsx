'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authService } from '@/app/utils/auth';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export default function PayPolicyCreatePage() {
  const params = useParams();
  const router = useRouter();
  const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;

  const [form, setForm] = useState({
    jobTitle: '',
    hourlyWage: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = authService.getToken();
      const payload = {
        jobTitle: form.jobTitle,
        hourlyWage: Number(form.hourlyWage),
      };

      const res = await fetch(
        `http://3.37.87.159/api/stores/${storeId}/paypolicies`,
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
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || '급여 정책 생성에 실패했습니다.');
      }

      router.push(`/store/${storeId}/settings/paypolicy`);
    } catch (err: any) {
      setError(err.message || '급여 정책 생성에 실패했습니다.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>새 급여 정책 추가</CardTitle>
          <CardDescription>
            직급과 시급을 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <Label>직급 *</Label>
            <Input
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              placeholder="예: 매니저, 알바생, 주방장"
            />
          </div>

          <div>
            <Label>시급 (원) *</Label>
            <Input
              name="hourlyWage"
              type="number"
              value={form.hourlyWage}
              onChange={handleChange}
              placeholder="예: 10000"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/store/${storeId}/settings/paypolicy`)}
            >
              취소
            </Button>
            <Button onClick={handleSubmit}>생성</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

