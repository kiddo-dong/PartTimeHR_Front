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
import { Store, MapPin, Phone, Calendar, Plus, Edit2 } from 'lucide-react';

interface StoreDto {
  id: number;
  storeName: string;
  storePhone: string;
  storeAddress: string;
  weekStartDay: number;
  weeklyPayApplicable: boolean;
  createdAt: string;
}

const WEEKDAYS = [
  { value: 1, label: '월요일' },
  { value: 2, label: '화요일' },
  { value: 3, label: '수요일' },
  { value: 4, label: '목요일' },
  { value: 5, label: '금요일' },
  { value: 6, label: '토요일' },
  { value: 7, label: '일요일' },
];

export default function StoreSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;
  
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 매장 목록 조회
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const res = await fetch('http://3.37.87.159/api/stores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('매장 조회 실패');

      const data: StoreDto[] = await res.json();
      setStores(data);
    } catch (err: any) {
      setError(err.message || '매장 목록을 불러오는데 실패했습니다.');
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
          <h1 className="text-2xl font-bold">매장 정보</h1>
          <p className="text-gray-600 mt-1">
            매장 목록을 조회하고 새로운 매장을 생성하거나 기존 매장 정보를 수정할 수 있습니다.
          </p>
        </div>
        <Button onClick={() => router.push(`/store/${storeId}/settings/store/new`)}>
            <Plus className="w-4 h-4 mr-2" />
            매장 추가
          </Button>
      </div>

      {/* 매장 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <Store className="text-white w-6 h-6" />
                  </div>
                  <CardTitle>{store.storeName}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/store/${storeId}/settings/store/${store.id}/edit`)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {store.storeAddress}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {store.storePhone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                주 시작일: {WEEKDAYS.find((d) => d.value === store.weekStartDay)?.label || '미설정'}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">주급 적용:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    store.weeklyPayApplicable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {store.weeklyPayApplicable ? '적용' : '미적용'}
                </span>
              </div>
              <div className="text-xs text-gray-400 pt-2 border-t">
                생성일: {new Date(store.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stores.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>등록된 매장이 없습니다.</p>
            <p className="text-sm mt-2">새 매장을 추가해주세요.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
