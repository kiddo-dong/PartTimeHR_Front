'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService } from '@/app/utils/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';

interface ScheduleResponse {
  scheduleId: number;
  employeeId: number;
  employeeName: string;
  startTime: string;
  endTime: string;
  confirmed: boolean;
}


export default function StoreSchedulePage() {
  const params = useParams();
  const storeId = params.storeId; // 선택한 매장 ID
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const storeName = params.storeName;

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const token = authService.getToken();
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const res = await fetch(
          `http://13.125.140.255/api/stores/${storeId}/schedules/date?workDate=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('스케줄을 가져오는 데 실패했습니다.');

        const data = await res.json();
        setSchedules(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedules();
  }, [storeId]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6"> 오늘 스케줄</h1>

      {schedules.length === 0 ? (
        <p>오늘 등록된 스케줄이 없습니다.</p>
      ) : (
        <div className="grid gap-4">
          {schedules.map((s) => (
            <Card key={s.employeeId}>
              <CardHeader>
                <CardTitle>{s.employeeName}</CardTitle>
              </CardHeader>
              <CardContent>
                {s.startTime} ~ {s.endTime}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}