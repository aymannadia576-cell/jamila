'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Star8Point } from '@/components/svg/Ornaments';
import { X, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authTab,
    setAuthTab,
    loginUser,
    signupUser,
    user,
    logoutUser,
  } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errs.email = 'يرجى إدخال البريد الإلكتروني';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    if (!password) {
      errs.password = 'يرجى إدخال كلمة المرور';
    } else if (password.length < 6) {
      errs.password = 'كلمة المرور يجب ألا تقل عن ٦ خانات';
    }

    if (authTab === 'signup' && !name.trim()) {
      errs.name = 'يرجى كتابة الاسم الكريم';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (authTab === 'login') {
        await loginUser(email, password);
      } else {
        await signupUser(name, email, password);
      }
      setName('');
      setEmail('');
      setPassword('');
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#3d2a1f]/50 backdrop-blur-xs"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#f8f2e7] border border-[rgba(92,61,46,0.25)] shadow-2xl p-6 sm:p-7 z-10">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-3.5 start-3.5 text-[#5c3d2e] hover:bg-[#5c3d2e]/10 p-1.5 rounded transition-colors"
          aria-label="إغلاق النافذة"
        >
          <X size={16} />
        </button>

        {/* If User is already logged in */}
        {user ? (
          <div className="text-center py-5">
            <div className="w-12 h-12 mx-auto mb-3 bg-[#5c3d2e] text-[#f8f2e7] rounded-full flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-amiri font-bold text-[#5c3d2e] mb-1">
              مرحباً بكِ، {user.name}
            </h3>
            <p className="text-xs text-[#8a6b57] font-cairo mb-5">
              تم تسجيل دخولكِ بنجاح إلى دار جميلة للأزياء الراقية ({user.email}).
            </p>
            <div className="space-y-2">
              <button
                onClick={closeAuthModal}
                className="w-full py-2 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-cairo font-medium hover:bg-[#3d2a1f]"
              >
                متابعة التسوق
              </button>
              <button
                onClick={logoutUser}
                className="w-full py-1.5 bg-transparent text-[#8a6b57] text-xs font-cairo hover:text-[#5c3d2e]"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center mb-5">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <Star8Point size={12} />
                <span className="text-[10px] tracking-[0.2em] font-amiri font-bold text-[#8a6b57]">
                  دار جميلة للأزياء الراقية
                </span>
                <Star8Point size={12} />
              </div>
              <h2 className="text-lg sm:text-xl font-amiri font-bold text-[#5c3d2e]">
                {authTab === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h2>
            </div>

            {/* Tab Buttons */}
            <div className="grid grid-cols-2 gap-1 bg-[#fcfaf5] p-1 border border-[rgba(92,61,46,0.12)] mb-5">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setErrors({});
                }}
                className={`py-1.5 text-xs font-cairo font-semibold transition-colors ${
                  authTab === 'login'
                    ? 'bg-[#5c3d2e] text-[#f8f2e7]'
                    : 'text-[#8a6b57] hover:text-[#5c3d2e]'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signup');
                  setErrors({});
                }}
                className={`py-1.5 text-xs font-cairo font-semibold transition-colors ${
                  authTab === 'signup'
                    ? 'bg-[#5c3d2e] text-[#f8f2e7]'
                    : 'text-[#8a6b57] hover:text-[#5c3d2e]'
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-cairo">
              {/* Name Field (Only on Sign Up) */}
              {authTab === 'signup' && (
                <div>
                  <label className="block text-[#3d2a1f] font-medium mb-1 text-[11px]">
                    الاسم الكريم *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="الاسم الأول والعائلة"
                      className="w-full py-2 px-3 ps-8 bg-[#fcfaf5] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e]"
                    />
                    <User size={14} className="absolute top-1/2 -translate-y-1/2 start-2 text-[#8a6b57]" />
                  </div>
                  {errors.name && (
                    <span className="text-[10px] text-[#5c3d2e] mt-1 block font-semibold">
                      {errors.name}
                    </span>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-[#3d2a1f] font-medium mb-1 text-[11px]">
                  البريد الإلكتروني *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full py-2 px-3 ps-8 bg-[#fcfaf5] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e]"
                  />
                  <Mail size={14} className="absolute top-1/2 -translate-y-1/2 start-2 text-[#8a6b57]" />
                </div>
                {errors.email && (
                  <span className="text-[10px] text-[#5c3d2e] mt-1 block font-semibold">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[#3d2a1f] font-medium mb-1 text-[11px]">
                  كلمة المرور *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-2 px-3 ps-8 bg-[#fcfaf5] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e]"
                  />
                  <Lock size={14} className="absolute top-1/2 -translate-y-1/2 start-2 text-[#8a6b57]" />
                </div>
                {errors.password && (
                  <span className="text-[10px] text-[#5c3d2e] mt-1 block font-semibold">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold uppercase tracking-wider hover:bg-[#3d2a1f] transition-colors mt-2"
              >
                {loading
                  ? 'جاري التحقق...'
                  : authTab === 'login'
                  ? 'تسجيل الدخول'
                  : 'تأكيد إنشاء الحساب'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
