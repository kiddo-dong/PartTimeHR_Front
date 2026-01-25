'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  useEffect(() => {
    const fetchStores = async () => {
      const token = authService.getToken();
      if (!token) return router.push('/login');

      const res = await fetch('http://localhost:8080/api/stores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setStores(data);
    };

    fetchStores();
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">매장을 선택하세요</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map((store) => (
          <Card
            key={store.id}
            onClick={() => {
              authService.setCurrentStore(store.id);
              router.push('/dashboard');
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
    </div>
  );
}
