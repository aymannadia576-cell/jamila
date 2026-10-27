'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { BrandWordmark } from '@/components/common/BrandWordmark';
import { CornerOrnament } from '@/components/svg/Ornaments';
import { Mail, Lock, User, Phone, MapPin, ShieldAlert, CheckCircle2, ArrowLeft, Crown } from 'lucide-react';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { user, loginUser, signupUser, logoutUser, isLoadingUser } = useShop();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('القاهرة');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoadingUser && user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [user, isLoadingUser, router]);

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setErrorMsg('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginUser(email.trim(), password);
        if (res.success && res.user) {
          setPassword('');
          router.replace(res.user.role === 'admin' ? '/admin' : '/');
        } else {
          setPassword('');
          setErrorMsg(res.message || 'بيانات الدخول غير صحيحة، يرجى التحقق من البريد أو كلمة المرور');
        }
      } else {
        if (password.length < 6) {
          setErrorMsg('كلمة المرور يجب ألا تقل عن 6 أحرف');
          return;
        }
        const res = await signupUser(name.trim(), email.trim(), password, phone.trim(), city);
        if (res.success && res.user) {
          setPassword('');
          router.replace('/');
        } else {
          setErrorMsg(res.message || 'فشل إنشاء الحساب، يرجى المحاولة مجدداً');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-cairo">
      <div className="relative w-full max-w-md bg-[#fcfaf5] border border-[rgba(92,61,46,0.22)] p-6 sm:p-10 shadow-lg animate-fade-in rounded-xs">
        <CornerOrnament position="top-start" color="#5c3d2e" />
        <CornerOrnament position="top-end" color="#5c3d2e" />
        <CornerOrnament position="bottom-start" color="#5c3d2e" />
        <CornerOrnament position="bottom-end" color="#5c3d2e" />

        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <BrandWordmark size="default" />
          </div>
          <h1 className="text-xl sm:text-2xl font-amiri font-bold text-[#5c3d2e]">
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>
          <p className="text-xs text-[#8a6b57] mt-1 font-light">
            {mode === 'login'
              ? 'أهلاً بكِ مجدداً — سجّلي الدخول إلى حسابكِ'
              : 'سجلي حسابكِ الجديد للاستفادة من مميزات دار جميلة ومتابعة طلباتكِ'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1 bg-[#f8f2e7] p-1 border border-[rgba(92,61,46,0.12)] mb-5">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 text-xs font-semibold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#5c3d2e] text-[#f8f2e7] shadow-2xs'
                : 'text-[#8a6b57] hover:text-[#5c3d2e]'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2 text-xs font-semibold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#5c3d2e] text-[#f8f2e7] shadow-2xs'
                : 'text-[#8a6b57] hover:text-[#5c3d2e]'
            }`}
          >
            إنشاء حساب
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xs flex items-center gap-2 font-medium">
            <ShieldAlert size={16} className="shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLoadingUser ? (
          <div className="py-10 flex justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#5c3d2e] border-t-transparent animate-spin" />
          </div>
        ) : user ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 mx-auto bg-[#5c3d2e] text-[#f8f2e7] rounded-full flex items-center justify-center">
              {user.role === 'admin' ? <Crown size={22} /> : <CheckCircle2 size={24} />}
            </div>
            <div>
              <div className="font-amiri font-bold text-lg text-[#3d2a1f]">
                {user.name}
              </div>
              <div className="text-xs text-[#8a6b57]">
                {user.email} · {user.role === 'admin' ? 'حساب الإدارة' : 'عميلة مسجلة'}
              </div>
            </div>
            <div className="pt-2 space-y-2">
              {user.role === 'admin' ? (
                <Link
                  href="/admin"
                  className="block w-full py-2.5 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold hover:bg-[#3d2a1f] transition-colors shadow-2xs"
                >
                  الانتقال إلى لوحة الإدارة (Admin Dashboard)
                </Link>
              ) : (
                <Link
                  href="/"
                  className="block w-full py-2.5 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold hover:bg-[#3d2a1f] transition-colors shadow-2xs"
                >
                  تصفح المتجر والمجموعات
                </Link>
              )}
              <button
                onClick={logoutUser}
                className="w-full py-2 text-xs text-[#8a6b57] hover:text-[#5c3d2e] transition-colors cursor-pointer"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3.5 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block text-[#3d2a1f] font-semibold mb-1 text-[11px]">
                  الاسم الكريم *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="الاسم الأول والعائلة"
                    className="w-full py-2 px-3 ps-8 bg-[#f8f2e7] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                  />
                  <User size={14} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1 text-[11px]">
                البريد الإلكتروني *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="off"
                  name="jm-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full py-2 px-3 ps-8 bg-[#f8f2e7] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                />
                <Mail size={14} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]" />
              </div>
            </div>

            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1 text-[11px]">
                كلمة المرور *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={mode === 'signup' ? 6 : undefined}
                  autoComplete="new-password"
                  name="jm-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2 px-3 ps-8 bg-[#f8f2e7] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                />
                <Lock size={14} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]" />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#3d2a1f] font-semibold mb-1 text-[11px]">
                    رقم الهاتف / الواتساب
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full py-2 px-3 ps-8 bg-[#f8f2e7] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                    />
                    <Phone size={14} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[#3d2a1f] font-semibold mb-1 text-[11px]">
                    المحافظة
                  </label>
                  <div className="relative">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full py-2 px-3 ps-8 bg-[#f8f2e7] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                    >
                      <option value="القاهرة">القاهرة</option>
                      <option value="الجيزة">الجيزة</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="الدقهلية (المنصورة)">الدقهلية (المنصورة)</option>
                      <option value="الغربية (طنطا)">الغربية (طنطا)</option>
                      <option value="الشرقية">الشرقية</option>
                      <option value="بورسعيد">بورسعيد</option>
                      <option value="السويس">السويس</option>
                      <option value="محافظات الصعيد">محافظات الصعيد</option>
                      <option value="البحر الأحمر">البحر الأحمر</option>
                    </select>
                    <MapPin size={14} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]" />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold uppercase tracking-wider hover:bg-[#3d2a1f] transition-colors rounded-xs shadow-xs cursor-pointer disabled:opacity-60"
            >
              {loading
                ? 'جاري التحقق والاتصال...'
                : mode === 'login'
                ? 'تسجيل الدخول'
                : 'تأكيد إنشاء الحساب'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[rgba(92,61,46,0.1)] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#8a6b57] hover:text-[#5c3d2e] transition-colors font-medium"
          >
            <ArrowLeft size={13} />
            <span>العودة إلى متجر دار جميلة</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
