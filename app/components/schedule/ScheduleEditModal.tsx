'use client';

import { useState } from 'react';
import { authService } from '@/app/utils/auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { X } from 'lucide-react';

interface ScheduleResponse {
  scheduleId: number;
  employeeId: number;
  employeeName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  confirmed: boolean;
}

interface ScheduleEditModalProps {
  storeId: string;
  schedule: ScheduleResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScheduleEditModal({
  storeId,
  schedule,
  onClose,
  onSuccess,
}: ScheduleEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ISO datetime을 날짜와 시간으로 분리
  const startDate = new Date(schedule.startTime);
  const endDate = new Date(schedule.endTime);

  const [form, setForm] = useState({
    workDate: schedule.workDate,
    startTime: startDate.toTimeString().slice(0, 5), // HH:MM
    endTime: endDate.toTimeString().slice(0, 5), // HH:MM
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.startTime || !form.endTime) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = authService.getToken();
      if (!token) throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');

      const payload = {
        // 백엔드 LocalDateTime에 맞춰 timezone(Z) 없이 전송
        startTime: `${form.workDate}T${form.startTime}:00`,
        endTime: `${form.workDate}T${form.endTime}:00`,
      };

      const res = await fetch(
        `http://3.37.87.159/api/stores/${storeId}/schedules/${schedule.scheduleId}/employees/${schedule.employeeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || '스케줄 수정에 실패했습니다.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || '스케줄 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('이 스케줄을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      setLoading(true);
      setError('');
      const token = authService.getToken();
      if (!token) throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');

      const res = await fetch(
        `http://3.37.87.159/api/stores/${storeId}/schedules/${schedule.scheduleId}/employees/${schedule.employeeId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || '스케줄 삭제에 실패했습니다.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || '스케줄 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">스케줄 수정</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">직원</div>
          <div className="font-semibold">{schedule.employeeName}</div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>근무 날짜 *</Label>
            <Input
              name="workDate"
              type="date"
              value={form.workDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>시작 시간 *</Label>
              <Input
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>종료 시간 *</Label>
              <Input
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-between gap-2 pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              삭제
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                취소
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '수정 중...' : '수정'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

