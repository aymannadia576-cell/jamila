'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminProvider } from '@/context/AdminContext';
import { useShop } from '@/context/ShopContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoadingUser } = useShop();

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#f8f2e7] flex items-center justify-center font-cairo">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-[#5c3d2e] border-t-transparent animate-spin" />
          <p className="text-xs text-[#5c3d2e] font-semibold">
            جاري التحقق من صلاحيات الإدارة...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f8f2e7] flex items-center justify-center p-4 font-cairo">
        <div className="max-w-md w-full bg-[#fcfaf5] border border-[rgba(92,61,46,0.22)] p-8 text-center shadow-lg rounded-xs space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-800 flex items-center justify-center">
            <ShieldAlert size={28} />
          </div>
          <h1 className="text-xl font-amiri font-bold text-[#3d2a1f]">
            غير مصرح لكِ بالوصول إلى لوحة الإدارة
          </h1>
          <p className="text-xs text-[#8a6b57] leading-relaxed">
            هذه المنطقة مخصصة لإدارة دار جميلة فقط. يرجى تسجيل الدخول بحساب الإدارة للمتابعة.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold rounded-xs hover:bg-[#3d2a1f] transition-colors flex items-center justify-center gap-1.5"
            >
              <Lock size={14} />
              <span>تسجيل الدخول كمسؤول</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#f8f2e7] text-[#5c3d2e] border border-[rgba(92,61,46,0.2)] text-xs font-semibold rounded-xs hover:bg-[#eadecc] transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>العودة للمتجر</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#f8f2e7] text-[#3d2a1f] flex flex-col lg:flex-row font-cairo">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
