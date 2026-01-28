'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/app/providers/StoreProvider';
import { authService } from '@/app/utils/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Store, MapPin, Phone } from 'lucide-react';

interface StoreDto {
  id: number;
  storeName: string;
  storePhone: string;
  storeAddress: string;
}

export default function StoreSelectPage() {
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { currentStoreId } = useStore();

  useEffect(() => {
    const fetchStores = async () => {
      const token = authService.getToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/stores', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('매장 조회 실패');

        const data: StoreDto[] = await res.json();
        setStores(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [router]);

  if (loading) {
    return <p></p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">매장을 선택하세요</h1>

      {stores.length === 0 ? (
        <p>등록된 매장이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <Card
              key={store.id}
              onClick={() => {
                authService.setCurrentStore(store.id); // 선택 매장 저장
                router.push(`/store/${store.id}/dashboard`); // 변경: 대시보드로 이동
              }}
              className="cursor-pointer hover:shadow-xl transition rounded-3xl"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Store className="text-white" />
                </div>
                <CardTitle>{store.storeName}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {store.storeAddress}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {store.storePhone}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
