'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, RefreshCw, LogOut, ShieldCheck } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useShop } from '@/context/ShopContext';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenSidebar }) => {
  const router = useRouter();
  const { adminProfile, refreshData, isLoadingData } = useAdmin();
  const { logoutUser } = useShop();

  const handleAdminLogout = async () => {
    await logoutUser();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#fcfaf5] border-b border-[rgba(92,61,46,0.15)] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between font-cairo">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-[#5c3d2e] hover:bg-[#5c3d2e]/10 rounded-xs transition-colors"
          aria-label="فتح القائمة الجانبية"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-amiri font-bold text-[#3d2a1f]">
            لوحة تحكم دار جميلة
          </h1>
          <p className="text-[10px] text-[#8a6b57] hidden sm:block">
            إدارة الأزياء والطلبات والشحن لجميع محافظات جمهورية مصر العربية
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={refreshData}
          disabled={isLoadingData}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f8f2e7] hover:bg-[#eadecc] text-[#5c3d2e] border border-[rgba(92,61,46,0.2)] rounded-xs text-[11px] font-semibold transition-colors cursor-pointer"
          title="تحديث البيانات من قاعدة البيانات"
        >
          <RefreshCw size={13} className={isLoadingData ? 'animate-spin' : ''} />
          <span className="hidden md:inline">تحديث البيانات</span>
        </button>

        <div className="flex items-center gap-2 ps-2 border-s border-[rgba(92,61,46,0.15)]">
          <div className="w-8 h-8 rounded-full bg-[#5c3d2e] text-[#f8f2e7] flex items-center justify-center font-bold text-xs">
            <ShieldCheck size={15} />
          </div>
          <div className="hidden sm:block text-start">
            <div className="text-xs font-bold text-[#3d2a1f] leading-tight">
              {adminProfile.name}
            </div>
            <div className="text-[10px] text-[#8a6b57]">{adminProfile.email}</div>
          </div>
        </div>

        <button
          onClick={handleAdminLogout}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xs text-[11px] font-semibold transition-colors cursor-pointer"
          title="تسجيل الخروج"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  );
};
