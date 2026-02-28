'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/app/utils/auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { X } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
}

interface ScheduleCreateModalProps {
  storeId: string;
  defaultDate?: Date;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScheduleCreateModal({
  storeId,
  defaultDate,
  onClose,
  onSuccess,
}: ScheduleCreateModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    employeeId: '',
    workDate: defaultDate ? defaultDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    startTime: '',
    endTime: '',
  });

  // 직원 목록 조회
  useEffect(() => {
    fetchEmployees();
  }, [storeId]);

  const fetchEmployees = async () => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
      const res = await fetch(`http://3.37.87.159/api/stores/${storeId}/employees/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('직원 목록을 불러오지 못했습니다.');
      const data = await res.json();
      setEmployees(data.map((emp: any) => ({ id: emp.id, name: emp.name })));
    } catch (err: any) {
      setError(err.message || '직원 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.employeeId || !form.startTime || !form.endTime) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = authService.getToken();
      if (!token) throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');

      const payload = {
        employeeId: Number(form.employeeId),
        workDate: form.workDate,
        // 백엔드 LocalDateTime에 맞춰 timezone(Z) 없이 전송
        startTime: `${form.workDate}T${form.startTime}:00`,
        endTime: `${form.workDate}T${form.endTime}:00`,
      };

      const res = await fetch(`http://3.37.87.159/api/stores/${storeId}/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || '스케줄 생성에 실패했습니다.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || '스케줄 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">스케줄 추가</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>직원 *</Label>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 h-9"
              required
            >
              <option value="">직원을 선택하세요</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '생성 중...' : '생성'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

