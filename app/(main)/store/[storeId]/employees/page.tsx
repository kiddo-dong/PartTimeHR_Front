'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authService } from '@/app/utils/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

interface EmployeeInfoResponse {
  id: number;
  email: string;
  name: string;
  phone: string;
  storeId: number;
  storeName: string;
  jobTitle: string;
  hourlyWage: number;
}

export default function EmployeeManagePage() {
  const { storeId } = useParams();
  const [employees, setEmployees] = useState<EmployeeInfoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = authService.getToken();
        const res = await fetch(`http://13.125.140.255/api/stores/${storeId}/employees/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('직원 목록을 불러오지 못했습니다.');
        const data = await res.json();
        setEmployees(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [storeId]);

  if (loading) return <p></p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">직원 관리</h1>
          <p className="text-sm text-gray-500">{employees[0]?.storeName}</p>
        </div>
        <Button onClick={() => router.push(`/store/${storeId}/employees/new`)}>+ 직원 추가</Button>
      </div>

      {/* 한 줄에 3개, 카드 높이 동일, 내용 스크롤 가능 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {employees.map((emp) => (
          <Card key={emp.id} className="flex flex-col h-full">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>{emp.name}</CardTitle>
                <p className="text-sm text-gray-500">{emp.jobTitle}</p>
              </div>
              <div className="text-sm font-medium">시급 {emp.hourlyWage.toLocaleString()}원</div>
            </CardHeader>

            {/* 내용 영역 스크롤 처리 */}
            <CardContent className="flex flex-col justify-between mt-2 flex-1 overflow-auto">
              <div className="space-y-1 text-sm text-gray-600">
                <div>e-mail: {emp.email}</div>
                <div>전화번호: {emp.phone}</div>
                {/* 필요시 추가 정보 길게 들어가도 스크롤됨 */}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/store/${storeId}/employees/${emp.id}`)}
                >
                  상세
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/store/${storeId}/employees/${emp.id}/edit`)}
                >
                  수정
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
