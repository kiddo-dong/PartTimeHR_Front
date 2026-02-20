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

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function SchedulesWeeklyPage() {
  const params = useParams();
  const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleResponse | null>(null);

  // 주의 시작일 계산 (월요일)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 조정
    return new Date(d.setDate(diff));
  };

  // 주의 모든 날짜 가져오기
  const getWeekDates = (date: Date) => {
    const start = getWeekStart(date);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(currentWeek);

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const [weekOffset, setWeekOffset] = useState(0); // 0: 이번 주, -1: 지난 주, 1: 다음 주

  // 주 변경
  const changeWeek = (weeks: number) => {
    setWeekOffset((prev) => prev + weeks);
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + weeks * 7);
    setCurrentWeek(newDate);
  };

  // 스케줄 조회 (주간)
  useEffect(() => {
    fetchWeeklySchedules();
  }, [storeId, weekOffset]);

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

  const fetchWeeklySchedules = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      
      // 주간 스케줄 조회 API 사용
      const res = await fetch(
        `http://3.37.87.159/api/stores/${storeId}/schedules/week?offset=${weekOffset}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('주간 스케줄을 가져오는 데 실패했습니다.');
      const data = await res.json();
      setSchedules(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 특정 날짜의 스케줄 가져오기
  const getSchedulesForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return schedules.filter((s) => s.workDate === dateStr);
  };

  if (loading) return <p className="p-6">로딩 중...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">주간 스케줄</h1>
          <p className="text-gray-600 mt-1">
            한 주 단위로 직원 근무 스케줄을 관리하는 화면입니다.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          스케줄 추가
        </Button>
      </div>

      {/* 주 선택 */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <Button variant="outline" size="icon" onClick={() => changeWeek(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <div className="text-lg font-semibold">
            {weekDates[0].toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} ~{' '}
            {weekDates[6].toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentWeek(new Date());
              setWeekOffset(0);
            }}
            className="mt-1"
          >
            이번 주로 이동
          </Button>
        </div>
        <Button variant="outline" size="icon" onClick={() => changeWeek(1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 주간 그리드 뷰 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-left font-semibold text-gray-700 min-w-[120px]">
                    직원
                  </th>
                  {weekDates.map((date, idx) => (
                    <th
                      key={idx}
                      className="p-3 text-center font-semibold text-gray-700 border-l min-w-[140px]"
                    >
                      <div>{WEEKDAYS[date.getDay()]}</div>
                      <div className="text-sm font-normal text-gray-500">
                        {date.getDate()}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      등록된 직원이 없습니다.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{employee.name}</td>
                      {weekDates.map((date, idx) => {
                        const daySchedules = getSchedulesForDate(date).filter(
                          (s) => s.employeeId === employee.id
                        );
                        return (
                          <td
                            key={idx}
                            className="p-2 border-l align-top min-h-[100px]"
                          >
                            <div className="space-y-1">
                              {daySchedules.map((schedule) => (
                                <div
                                  key={schedule.scheduleId}
                                  className={`text-xs p-2 rounded border cursor-pointer hover:shadow-md transition ${
                                    schedule.confirmed
                                      ? 'bg-blue-100 border-blue-300'
                                      : 'bg-yellow-100 border-yellow-300'
                                  }`}
                                  onClick={() => setEditingSchedule(schedule)}
                                >
                                  <div className="font-semibold">
                                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                  </div>
                                  {!schedule.confirmed && (
                                    <div className="text-yellow-700 mt-1">미확정</div>
                                  )}
                                </div>
                              ))}
                              {daySchedules.length === 0 && (
                                <div className="text-gray-300 text-xs text-center py-2">
                                  -
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 스케줄이 없을 때 */}
      {schedules.length === 0 && employees.length > 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>이번 주에 등록된 스케줄이 없습니다.</p>
            <p className="text-sm mt-2">새 스케줄을 추가해주세요.</p>
          </CardContent>
        </Card>
      )}

      {/* 스케줄 생성 모달 */}
      {showCreateModal && (
        <ScheduleCreateModal
          storeId={storeId}
          defaultDate={weekDates[0]}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchWeeklySchedules();
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
            fetchWeeklySchedules();
            setEditingSchedule(null);
          }}
        />
      )}
    </div>
  );
}
