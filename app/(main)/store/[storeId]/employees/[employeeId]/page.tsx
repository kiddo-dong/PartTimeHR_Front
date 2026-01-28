'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EmployeeDetailPage() {
  const { storeId, employeeId } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState<EmployeeInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const token = authService.getToken();
        const res = await fetch(
          `http://localhost:8080/api/employees/${storeId}?employeeId=${employeeId}`,
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
        setEmployee(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [storeId, employeeId]);

  if (loading) return <p></p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!employee) return null;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{employee.name}</CardTitle>
          <p className="text-sm text-gray-500">{employee.jobTitle}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 기본 정보 */}
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">매장</span>
              <div className="font-medium">{employee.storeName}</div>
            </div>

            <div>
              <span className="text-gray-500">시급</span>
              <div className="font-medium">
                {employee.hourlyWage.toLocaleString()}원
              </div>
            </div>

            <div>
              <span className="text-gray-500">연락처</span>
              <div className="font-medium">{employee.phone}</div>
            </div>

            <div>
              <span className="text-gray-500">이메일</span>
              <div className="font-medium">{employee.email}</div>
            </div>
          </div>

          {/* 액션 */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/store/${storeId}/employees`)
              }
            >
              목록
            </Button>

            <Button variant="outline">
              정보 수정
            </Button>

            <Button variant="destructive">
              퇴사 처리
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 확장 영역 */}
      <div className="mt-6 text-sm text-gray-400">
        근무 정보 / 급여 정산 기능은 추후 제공 예정입니다.
      </div>
    </div>
  );
}
