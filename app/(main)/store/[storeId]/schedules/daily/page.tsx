'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService } from '@/app/utils/auth';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import ScheduleCreateModal from '@/app/components/schedule/ScheduleCreateModal';
import ScheduleEditModal from '@/app/components/schedule/ScheduleEditModal';

interface ScheduleResponse {
  scheduleId: number;
  employeeId: number;
  employeeName: string;
  workDate: string; // YYYY-MM-DD
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  confirmed: boolean;
}

interface Employee {
  id: number;
  name: string;
}

export default function SchedulesDailyPage() {
  const params = useParams();
  const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleResponse | null>(null);

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  // 날짜 변경
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // 스케줄 조회
  useEffect(() => {
    fetchSchedules();
  }, [storeId, selectedDate]);

  // 직원 목록 조회
  useEffect(() => {
    fetchEmployees();
  }, [storeId]);

  const fetchEmployees = async () => {
    try {
      const token = authService.getToken();
      const res = await fetch(`http://3.37.87.159/api/stores/${storeId}/employees/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('직원 목록을 불러오지 못했습니다.');
      const data = await res.json();
      setEmployees(data.map((emp: any) => ({ id: emp.id, name: emp.name })));
    } catch (err: any) {
      console.error('직원 목록 조회 실패:', err);
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const dateStr = formatDate(selectedDate);
      const res = await fetch(
        `http://3.37.87.159/api/stores/${storeId}/schedules/date?workDate=${dateStr}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  };

  // 시간대별로 스케줄 그룹화
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const getSchedulesForHour = (hour: number) => {
    return schedules.filter((schedule) => {
      const start = new Date(schedule.startTime);
      const end = new Date(schedule.endTime);
      return start.getHours() <= hour && end.getHours() > hour;
    });
  };

  if (loading) return <p className="p-6">로딩 중...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">일간 스케줄</h1>
          <p className="text-gray-600 mt-1">
            선택한 날짜의 직원 근무 스케줄을 관리하는 화면입니다.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          스케줄 추가
        </Button>
      </div>

      {/* 날짜 선택 */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <div className="text-lg font-semibold">
            {selectedDate.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
            className="mt-1"
          >
            오늘로 이동
          </Button>
        </div>
        <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 타임라인 뷰 */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {timeSlots.map((hour) => {
              const hourSchedules = getSchedulesForHour(hour);
              return (
                <div key={hour} className="flex min-h-[80px] hover:bg-gray-50 transition">
                  {/* 시간 라벨 */}
                  <div className="w-20 px-4 py-3 flex items-center justify-end border-r text-sm text-gray-500 font-medium">
                    {hour.toString().padStart(2, '0')}:00
                  </div>

                  {/* 스케줄 영역 */}
                  <div className="flex-1 relative p-2">
                    {hourSchedules.map((schedule) => {
                      const start = new Date(schedule.startTime);
                      const end = new Date(schedule.endTime);
                      const startHour = start.getHours();
                      const startMin = start.getMinutes();
                      const endHour = end.getHours();
                      const endMin = end.getMinutes();

                      // 현재 시간대에 해당하는 스케줄만 표시
                      if (startHour === hour || (startHour < hour && endHour > hour)) {
                        const topPercent =
                          startHour === hour ? (startMin / 60) * 100 : 0;
                        const heightPercent =
                          startHour === hour && endHour === hour
                            ? ((endMin - startMin) / 60) * 100
                            : startHour < hour && endHour > hour
                            ? 100
                            : ((60 - startMin) / 60) * 100;

                        return (
                          <div
                            key={schedule.scheduleId}
                            className={`absolute left-2 right-2 rounded-md p-2 text-xs shadow-sm cursor-pointer hover:shadow-md transition ${
                              schedule.confirmed
                                ? 'bg-blue-100 border border-blue-300'
                                : 'bg-yellow-100 border border-yellow-300'
                            }`}
                            style={{
                              top: `${topPercent}%`,
                              height: `${Math.max(heightPercent, 20)}%`,
                            }}
                            onClick={() => setEditingSchedule(schedule)}
                          >
                            <div className="font-semibold">{schedule.employeeName}</div>
                            <div className="text-gray-600 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                            </div>
                            {!schedule.confirmed && (
                              <div className="text-yellow-700 text-xs mt-1">미확정</div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 스케줄이 없을 때 */}
      {schedules.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>선택한 날짜에 등록된 스케줄이 없습니다.</p>
            <p className="text-sm mt-2">새 스케줄을 추가해주세요.</p>
          </CardContent>
        </Card>
      )}

      {/* 스케줄 생성 모달 */}
      {showCreateModal && (
        <ScheduleCreateModal
          storeId={storeId}
          defaultDate={selectedDate}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchSchedules();
            setShowCreateModal(false);
          }}
        />
      )}

      {/* 스케줄 수정 모달 */}
      {editingSchedule && (
        <ScheduleEditModal
          storeId={storeId}
          schedule={editingSchedule}
          onClose={() => setEditingSchedule(null)}
          onSuccess={() => {
            fetchSchedules();
            setEditingSchedule(null);
          }}
        />
      )}
    </div>
  );
}
