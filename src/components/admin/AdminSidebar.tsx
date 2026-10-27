'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MapPin,
  ShieldCheck,
  Settings,
  Store,
  X,
} from 'lucide-react';
import { BrandWordmark } from '@/components/common/BrandWordmark';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'الرئيسية والملخص',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'المنتجات والأزياء',
      href: '/admin/products',
      icon: Package,
    },
    {
      label: 'طلبات العميلات',
      href: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      label: 'سجل العميلات',
      href: '/admin/customers',
      icon: Users,
    },
    {
      label: 'مناطق التوصيل (Zones)',
      href: '/admin/zones',
      icon: MapPin,
    },
    {
      label: 'الإعدادات العامة',
      href: '/admin/settings',
      icon: Settings,
    },
    {
      label: 'الأمان وكلمة المرور',
      href: '/admin/security',
      icon: ShieldCheck,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 start-0 z-50 w-64 bg-[#3d2a1f] text-[#f8f2e7] flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="p-5 border-b border-[#f8f2e7]/10 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="brightness-200 contrast-100">
                <BrandWordmark size="small" variant="light" showArabicSubtitle={false} />
              </div>
              <span className="text-[11px] text-[#e8d7be] font-cairo font-semibold tracking-wider mt-1">
                لوحة الإدارة • دار جميلة
              </span>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#f8f2e7]/70 hover:text-white rounded-xs"
              aria-label="إغلاق القائمة"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="p-3 space-y-1.5 font-cairo">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xs text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#f8f2e7] text-[#3d2a1f] font-bold shadow-xs'
                      : 'text-[#f8f2e7]/80 hover:bg-[#5c3d2e] hover:text-white'
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#f8f2e7]/10 space-y-2 font-cairo">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-[#5c3d2e] hover:bg-[#704b39] text-[#f8f2e7] text-xs font-semibold rounded-xs transition-colors border border-[#f8f2e7]/15"
          >
            <Store size={15} />
            <span>العودة لواجهة المتجر</span>
          </Link>
          <div className="text-[10px] text-center text-[#f8f2e7]/50">
            دار جميلة للأزياء الراقية © ٢٠٢٦
          </div>
        </div>
      </aside>
    </>
  );
};
