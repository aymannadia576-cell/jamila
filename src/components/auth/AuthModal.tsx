'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Crown,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { CornerOrnament } from '@/components/svg/Ornaments';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authTab, setAuthTab, loginUser, signupUser } =
    useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('القاهرة');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (authTab === 'login') {
        const res = await loginUser(email, password);
        if (res.success) {
          setSuccessMessage('أهلاً بكِ في دار جميلة! تم تسجيل الدخول بنجاح.');
          setTimeout(() => {
            closeAuthModal();
          }, 1200);
        } else {
          setErrorMessage(res.message || 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد أو كلمة المرور.');
        }
      } else {
        const res = await signupUser(name, email, password, phone, city);
        if (res.success) {
          setSuccessMessage('مرحباً بكِ في دار جميلة! تم إنشاء حسابك بنجاح.');
          setTimeout(() => {
            closeAuthModal();
          }, 1200);
        } else {
          setErrorMessage(res.message || 'فشل إنشاء الحساب. قد يكون البريد الإلكتروني مسجلاً مسبقاً.');
        }
      }
    } catch {
      setErrorMessage('حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-cairo">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.25)] w-full max-w-md shadow-2xl relative my-8 overflow-hidden rounded-xs"
      >
        <CornerOrnament position="top-start" color="#5c3d2e" />
        <CornerOrnament position="top-end" color="#5c3d2e" />
        <CornerOrnament position="bottom-start" color="#5c3d2e" />
        <CornerOrnament position="bottom-end" color="#5c3d2e" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(92,61,46,0.12)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#f8f2e7] border border-[rgba(92,61,46,0.18)] flex items-center justify-center text-[#5c3d2e]">
              <Crown size={17} className="text-[#5c3d2e]" />
            </div>
            <div>
              <h3 className="text-base font-amiri font-bold text-[#3d2a1f]">
                {authTab === 'login' ? 'تسجيل دخول العميلة' : 'انضمي لعائلة دار جميلة'}
              </h3>
              <p className="text-[11px] text-[#8a6b57]">
                {authTab === 'login'
                  ? 'سجلي دخولك لمتابعة طلباتك ومفضلتك الحصرية'
                  : 'أنشئي حسابك واستمتعي بتجربة تسوق راقية وخدمة ملكية'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 text-[#8a6b57] hover:text-[#3d2a1f] hover:bg-[#f8f2e7] rounded-xs transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[rgba(92,61,46,0.12)] bg-[#f8f2e7]/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-center transition-all ${
              authTab === 'login'
                ? 'bg-[#fcfaf5] text-[#5c3d2e] border-b-2 border-[#5c3d2e] font-bold shadow-xs'
                : 'text-[#8a6b57] hover:text-[#3d2a1f]'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-center transition-all ${
              authTab === 'signup'
                ? 'bg-[#fcfaf5] text-[#5c3d2e] border-b-2 border-[#5c3d2e] font-bold shadow-xs'
                : 'text-[#8a6b57] hover:text-[#3d2a1f]'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* Feedback Messages */}
        <div className="px-5 sm:px-6 pt-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 text-xs">
          {/* Full Name for signup */}
          {authTab === 'signup' && (
            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1">
                الاسم بالكامل *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: ياسمين المنشاوي"
                  className="w-full ps-8 pe-3 py-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                />
                <User size={14} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]" />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[#3d2a1f] font-semibold mb-1">
              البريد الإلكتروني *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@jamila.com"
                className="w-full ps-8 pe-3 py-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
              />
              <Mail size={14} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[#3d2a1f] font-semibold mb-1">
              كلمة المرور *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="٦ أحرف أو أرقام على الأقل"
                className="w-full ps-8 pe-8 py-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
              />
              <Lock size={14} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 end-2.5 text-[#8a6b57] hover:text-[#3d2a1f]"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* City / Governorate for signup */}
          {authTab === 'signup' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#3d2a1f] font-semibold mb-1">
                  رقم الموبايل
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full ps-8 pe-2 py-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                  />
                  <Phone size={13} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]" />
                </div>
              </div>

              <div>
                <label className="block text-[#3d2a1f] font-semibold mb-1">
                  المحافظة
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs cursor-pointer"
                >
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة والشيخ زايد">الجيزة والشيخ زايد</option>
                  <option value="الإسكندرية والساحل">الإسكندرية والساحل</option>
                  <option value="المنصورة والدقهلية">المنصورة والدقهلية</option>
                  <option value="طنطا والغربية">طنطا والغربية</option>
                  <option value="بورسعيد والقناة">بورسعيد والقناة</option>
                  <option value="أسيوط والصعيد">أسيوط والصعيد</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#5c3d2e] hover:bg-[#3d2a1f] text-[#f8f2e7] text-xs font-semibold rounded-xs transition-colors shadow-2xs mt-4 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={14} className="text-[#e8d7be]" />
                <span>{authTab === 'login' ? 'دخول لحسابي' : 'تأكيد وإنشاء الحساب'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="p-3 bg-[#f8f2e7] border-t border-[rgba(92,61,46,0.1)] text-center text-[11px] text-[#8a6b57]">
          {authTab === 'login' ? (
            <span>
              ليس لديكِ حساب بعد؟{' '}
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className="font-bold text-[#5c3d2e] hover:underline"
              >
                انضمي الآن مجاناً
              </button>
            </span>
          ) : (
            <span>
              لديكِ حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className="font-bold text-[#5c3d2e] hover:underline"
              >
                تسجيل الدخول
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};