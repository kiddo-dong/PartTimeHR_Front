'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService } from '@/app/utils/auth';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import ScheduleCreateModal from '@/app/components/schedule/ScheduleCreateModal';

interface ScheduleResponse {
  scheduleId: number;
  employeeId: number;
  employeeName: string;
  workDate: string; // YYYY-MM-DD
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  confirmed: boolean;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function SchedulesMonthlyPage() {
  const params = useParams();
  const storeId = typeof params?.storeId === 'string' ? params.storeId : Array.isArray(params?.storeId) ? params.storeId[0] : '';

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 월의 첫 날과 마지막 날
  const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getMonthEnd = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // 달력에 표시할 모든 날짜 (이전/다음 달 포함)
  const getCalendarDates = (date: Date) => {
    const start = getMonthStart(date);
    const end = getMonthEnd(date);
    const startDay = start.getDay();
    const daysInMonth = end.getDate();

    const dates: Date[] = [];

    // 이전 달의 마지막 날들
    const prevMonthEnd = new Date(start.getFullYear(), start.getMonth(), 0);
    for (let i = startDay - 1; i >= 0; i--) {
      dates.push(new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), prevMonthEnd.getDate() - i));
    }

    // 현재 달의 날들
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(start.getFullYear(), start.getMonth(), i));
    }

    // 다음 달의 첫 날들 (42개 셀을 채우기 위해)
    const remaining = 42 - dates.length;
    for (let i = 1; i <= remaining; i++) {
      dates.push(new Date(end.getFullYear(), end.getMonth() + 1, i));
    }

    return dates;
  };

  const calendarDates = getCalendarDates(currentMonth);

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  const [monthOffset, setMonthOffset] = useState(0); // 0: 이번 달, -1: 지난 달, 1: 다음 달

  // 월 변경
  const changeMonth = (months: number) => {
    setMonthOffset((prev) => prev + months);
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + months);
    setCurrentMonth(newDate);
  };

  // 스케줄 조회 (월간)
  useEffect(() => {
    if (!storeId) return;
    fetchMonthlySchedules();
  }, [storeId, monthOffset]);

  const fetchMonthlySchedules = async () => {
    if (!storeId) return;
    try {
      setLoading(true);
      const token = authService.getToken();
      
      // 월간 스케줄 조회 API 사용
      const res = await fetch(
        `http://3.37.87.159/api/stores/${storeId}/schedules/month?offset=${monthOffset}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('월간 스케줄을 가져오는 데 실패했습니다.');
      const data = await res.json();
      setSchedules(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 특정 날짜의 스케줄 개수 가져오기
  const getScheduleCountForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return schedules.filter((s) => s.workDate === dateStr).length;
  };

  // 특정 날짜가 현재 월인지 확인
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  // 오늘인지 확인
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (!storeId) return <p className="p-6 text-red-600">매장 정보를 찾을 수 없습니다.</p>;
  if (loading) return <p className="p-6">로딩 중...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
      <h1 className="text-2xl font-bold">월간 스케줄</h1>
          <p className="text-gray-600 mt-1">
            한 달 단위로 직원 근무 스케줄을 관리하는 화면입니다.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          스케줄 추가
        </Button>
      </div>

      {/* 월 선택 */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <div className="text-lg font-semibold">
            {currentMonth.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentMonth(new Date());
              setMonthOffset(0);
            }}
            className="mt-1"
          >
            이번 달로 이동
          </Button>
        </div>
        <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 달력 뷰 */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="p-3 text-center font-semibold text-gray-700 bg-gray-50 border-r last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDates.map((date, idx) => {
              const scheduleCount = getScheduleCountForDate(date);
              const isCurrent = isCurrentMonth(date);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={idx}
                  className={`min-h-[100px] p-2 border-b border-r last:border-r-0 ${
                    !isCurrent ? 'bg-gray-50' : 'bg-white'
                  } ${isTodayDate ? 'ring-2 ring-blue-500' : ''} hover:bg-gray-100 transition cursor-pointer`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      !isCurrent ? 'text-gray-400' : isTodayDate ? 'text-blue-600 font-bold' : 'text-gray-700'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  {scheduleCount > 0 && (
                    <div className="space-y-1">
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          isCurrent
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {scheduleCount}개 스케줄
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 범례 */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500"></div>
          <span>오늘</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded"></div>
          <span>스케줄 있음</span>
        </div>
      </div>

      {/* 스케줄이 없을 때 */}
      {schedules.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>이번 달에 등록된 스케줄이 없습니다.</p>
            <p className="text-sm mt-2">새 스케줄을 추가해주세요.</p>
          </CardContent>
        </Card>
      )}

      {/* 스케줄 생성 모달 */}
      {showCreateModal && (
        <ScheduleCreateModal
          storeId={storeId}
          defaultDate={getMonthStart(currentMonth)}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchMonthlySchedules();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
