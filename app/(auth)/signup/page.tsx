'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    storeName: '',
    storePhone: '',
    storeAddress: '',
    weekStartDay: 1,
    weeklyPayApplicable: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert('회원가입 실패');
      return;
    }

    alert('회원가입 성공');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-xl font-bold text-center">사장 회원가입</h1>

        <input
          name="email"
          placeholder="이메일"
          onChange={handleChange}
          className="input"
        />

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
          className="input"
        />

        <input
          type="password"
          name="passwordConfirm"
          placeholder="비밀번호 확인"
          onChange={handleChange}
          className="input"
        />

        <input
          name="name"
          placeholder="이름"
          onChange={handleChange}
          className="input"
        />

        <input
          name="phone"
          placeholder="휴대폰 번호"
          onChange={handleChange}
          className="input"
        />

        <hr />

        <input
          name="storeName"
          placeholder="매장명"
          onChange={handleChange}
          className="input"
        />

        <input
          name="storePhone"
          placeholder="매장 전화번호"
          onChange={handleChange}
          className="input"
        />

        <input
          name="storeAddress"
          placeholder="매장 주소"
          onChange={handleChange}
          className="input"
        />

        <select
          name="weekStartDay"
          onChange={handleChange}
          className="input"
        >
          <option value={1}>월요일</option>
          <option value={2}>화요일</option>
          <option value={3}>수요일</option>
          <option value={4}>목요일</option>
          <option value={5}>금요일</option>
          <option value={6}>토요일</option>
          <option value={7}>일요일</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="weeklyPayApplicable"
            checked={form.weeklyPayApplicable}
            onChange={handleChange}
          />
          주휴수당 적용
        </label>

        <button
          type="submit"
          className="w-full rounded bg-black py-2 text-white"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
