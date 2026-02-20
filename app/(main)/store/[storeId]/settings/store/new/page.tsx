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

const WEEKDAYS = [
  { value: 1, label: '월요일' },
  { value: 2, label: '화요일' },
  { value: 3, label: '수요일' },
  { value: 4, label: '목요일' },
  { value: 5, label: '금요일' },
  { value: 6, label: '토요일' },
  { value: 7, label: '일요일' },
];

export default function StoreCreatePage() {
  const params = useParams();
  const router = useRouter();
  const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;

  const [form, setForm] = useState({
    storeName: '',
    storePhone: '',
    storeAddress: '',
    weekStartDay: '1',
    weeklyPayApplicable: false,
  });

  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = authService.getToken();
      const payload = {
        storeName: form.storeName,
        storePhone: form.storePhone,
        storeAddress: form.storeAddress,
        weekStartDay: Number(form.weekStartDay),
        weeklyPayApplicable: form.weeklyPayApplicable,
      };

      const res = await fetch('http://3.37.87.159/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || '매장 생성에 실패했습니다.');
      }

      router.push(`/store/${storeId}/settings/store`);
    } catch (err: any) {
      setError(err.message || '매장 생성에 실패했습니다.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>새 매장 추가</CardTitle>
          <CardDescription>
            매장의 기본 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <Label>매장명 *</Label>
            <Input
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              placeholder="예: 송파구청점"
            />
          </div>

          <div>
            <Label>전화번호 *</Label>
            <Input
              name="storePhone"
              value={form.storePhone}
              onChange={handleChange}
              placeholder="예: 01012345678"
            />
          </div>

          <div>
            <Label>주소 *</Label>
            <Input
              name="storeAddress"
              value={form.storeAddress}
              onChange={handleChange}
              placeholder="예: 서울 송파구"
            />
          </div>

          <div>
            <Label>주 시작일 *</Label>
            <select
              name="weekStartDay"
              value={form.weekStartDay}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 h-9"
            >
              {WEEKDAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="weeklyPayApplicable"
              name="weeklyPayApplicable"
              checked={form.weeklyPayApplicable}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <Label htmlFor="weeklyPayApplicable" className="cursor-pointer">
              주급 적용 여부
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/store/${storeId}/settings/store`)}
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

