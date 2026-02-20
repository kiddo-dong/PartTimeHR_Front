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
import { Plus, Edit2, DollarSign } from 'lucide-react';

interface PayPolicy {
  id: number;
  jobTitle: string;
  hourlyWage: number;
}

export default function PayPolicySettingsPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;

  const [payPolicies, setPayPolicies] = useState<PayPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayPolicies();
  }, [storeId]);

  const fetchPayPolicies = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const res = await fetch(
        `http://3.37.87.159/api/stores/${storeId}/paypolicies`,
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
      setError(err.message || '급여 정책 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p></p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">급여 정책 설정</h1>
          <p className="text-gray-600 mt-1">
            직책, 시급, 수당 등 급여 정책을 설정하는 화면입니다.
          </p>
        </div>
        <Button onClick={() => router.push(`/store/${storeId}/settings/paypolicy/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          급여 정책 추가
        </Button>
      </div>

      {/* 급여 정책 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payPolicies.map((policy) => (
          <Card key={policy.id} className="hover:shadow-lg transition">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
                    <DollarSign className="text-white w-6 h-6" />
                  </div>
                  <CardTitle>{policy.jobTitle}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/store/${storeId}/settings/paypolicy/${policy.id}/edit`)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">시급:</span>
                <span className="text-lg font-semibold text-green-700">
                  {policy.hourlyWage.toLocaleString()}원
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {payPolicies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>등록된 급여 정책이 없습니다.</p>
            <p className="text-sm mt-2">새 급여 정책을 추가해주세요.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


