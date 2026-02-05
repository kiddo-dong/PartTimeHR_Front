'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService } from '@/app/utils/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Users, Calendar, Store as StoreIcon } from 'lucide-react';

interface EmployeeSummary {
  totalEmployees: number;
}

interface ScheduleSummary {
  todayShifts: number;
}

interface StoreInfo {
  id: number;
  storeName: string;
  storeAddress: string;
  storePhone: string;
}

export default function DashboardPage() {
  const { storeId } = useParams();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [employeeSummary, setEmployeeSummary] = useState<EmployeeSummary | null>(null);
  const [scheduleSummary, setScheduleSummary] = useState<ScheduleSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = authService.getToken();
      if (!token) return;

      try {
        // 매장 정보
        const storeRes = await fetch(`http://13.125.140.255/api/stores/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const storeData = await storeRes.json();
        setStore(storeData);

        // 직원 요약
        const empRes = await fetch(`http://13.125.140.255/api/stores/${storeId}/employees/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const empData = await empRes.json();
        setEmployeeSummary({ totalEmployees: empData.length });

        // 오늘 스케줄 요약
        const today = new Date().toISOString().slice(0, 10);
        const schedRes = await fetch(`http://13.125.140.255/api/stores/${storeId}/schedules/date?workDate=${today}`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        const schedData = await schedRes.json();
        setScheduleSummary({ todayShifts: schedData.length });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [storeId]);

  if (loading) return <p></p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">메인</h1>
      <p className="text-gray-600">매장 기본 정보, 연락처, 운영 시간 등을 설정하는 화면입니다.</p>
      {/* 매장 정보 */}
      {store && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">{store.storeName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-gray-600">
            <div>주소: {store.storeAddress}</div>
            <div>전화: {store.storePhone}</div>
          </CardContent>
        </Card>
      )}

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-md flex flex-col items-center justify-center p-4">
          <Users className="w-8 h-8 text-blue-600 mb-2" />
          <div className="text-lg font-semibold">{employeeSummary?.totalEmployees ?? 0}</div>
          <div className="text-sm text-gray-500">직원 수</div>
        </Card>

        <Card className="rounded-2xl shadow-md flex flex-col items-center justify-center p-4">
          <Calendar className="w-8 h-8 text-green-600 mb-2" />
          <div className="text-lg font-semibold">{scheduleSummary?.todayShifts ?? 0}</div>
          <div className="text-sm text-gray-500">오늘 스케줄</div>
        </Card>

        <Card className="rounded-2xl shadow-md flex flex-col items-center justify-center p-4">
          <StoreIcon className="w-8 h-8 text-orange-600 mb-2" />
          <div className="text-lg font-semibold">{store?.storeName}</div>
          <div className="text-sm text-gray-500">선택 매장</div>
        </Card>
      </div>
    </div>
  );
}
