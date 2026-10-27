'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  Database,
  UserCheck,
  Save,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { CornerOrnament } from '@/components/svg/Ornaments';

export default function AdminSecurityPage() {
  const { adminProfile, updateAdminProfile } = useAdmin();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [profileName, setProfileName] = useState(adminProfile.name);
  const [profileEmail, setProfileEmail] = useState(adminProfile.email);
  const [profilePhone, setProfilePhone] = useState(adminProfile.phone);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'كلمة المرور الجديدة غير متطابقة مع التأكيد', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: 'كلمة المرور يجب أن تتكون من ٦ خانات على الأقل', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ text: 'تم تحديث كلمة المرور بنجاح في قاعدة بيانات MongoDB!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ text: data.message || 'فشل تحديث كلمة المرور', type: 'error' });
      }
    } catch {
      setMessage({ text: 'حدث خطأ في الاتصال بالخادم وقاعدة البيانات', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
    });
    setProfileMessage('تم حفظ بيانات الحساب بنجاح!');
    setTimeout(() => setProfileMessage(null), 3000);
  };

  return (
    <div className="space-y-6 font-cairo max-w-4xl">
      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-amiri font-bold text-[#3d2a1f] flex items-center gap-2">
          <ShieldCheck size={22} className="text-[#5c3d2e]" />
          <span>الأمان وحساب الإدارة وتغيير كلمة المرور</span>
        </h1>
        <p className="text-xs text-[#8a6b57]">
          إدارة بيانات الدخول الآمنة للوحة التحكم والاتصال بقاعدة بيانات MongoDB Atlas
        </p>
      </div>

      <div className="bg-[#fcfaf5] border border-emerald-300 p-4 shadow-2xs rounded-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Database size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <span>حالة الاتصال بقاعدة البيانات: متصل ومؤمن</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[11px] text-[#8a6b57]">
              قاعدة بيانات MongoDB Atlas السحابية المشفرة
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs font-semibold">
          SSL / TLS Encrypted
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 shadow-2xs relative rounded-xs">
          <CornerOrnament position="top-start" color="#5c3d2e" />
          <CornerOrnament position="top-end" color="#5c3d2e" />
          <CornerOrnament position="bottom-start" color="#5c3d2e" />
          <CornerOrnament position="bottom-end" color="#5c3d2e" />

          <h2 className="text-base font-amiri font-bold text-[#5c3d2e] mb-1 flex items-center gap-1.5">
            <Key size={16} />
            <span>تغيير كلمة المرور</span>
          </h2>
          <p className="text-[11px] text-[#8a6b57] mb-4">
            تحديث كلمة المرور لحساب المدير وحفظها مشفرة في MongoDB
          </p>

          {message && (
            <div
              className={`p-3 text-xs mb-4 rounded-xs flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1">
                كلمة المرور الحالية *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
              />
            </div>

            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1">
                كلمة المرور الجديدة *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
              />
            </div>

            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1">
                تأكيد كلمة المرور الجديدة *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#5c3d2e] hover:bg-[#3d2a1f] disabled:opacity-50 text-[#f8f2e7] text-xs font-semibold rounded-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock size={14} />
              <span>{isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور في قاعدة البيانات'}</span>
            </button>
          </form>
        </div>

        <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 shadow-2xs relative rounded-xs">
          <CornerOrnament position="top-start" color="#5c3d2e" />
          <CornerOrnament position="top-end" color="#5c3d2e" />
          <CornerOrnament position="bottom-start" color="#5c3d2e" />
          <CornerOrnament position="bottom-end" color="#5c3d2e" />

          <h2 className="text-base font-amiri font-bold text-[#5c3d2e] mb-1 flex items-center gap-1.5">
            <UserCheck size={16} />
            <span>بيانات حساب المدير</span>
          </h2>
          <p className="text-[11px] text-[#8a6b57] mb-4">
            تحديث الاسم والبريد الإلكتروني ورقم هاتف إدارة دار جميلة
          </p>

          {profileMessage && (
            <div className="p-3 text-xs mb-4 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{profileMessage}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1">
                اسم المدير / المسؤول *
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
              />
            </div>

            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1">
                البريد الإلكتروني للإدارة *
              </label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
              />
            </div>

            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1">
                رقم هاتف الإدارة *
              </label>
              <input
                type="tel"
                required
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5c3d2e] hover:bg-[#3d2a1f] text-[#f8f2e7] text-xs font-semibold rounded-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              <span>حفظ بيانات الحساب</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
