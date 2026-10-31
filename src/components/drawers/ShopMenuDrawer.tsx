'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { X, ChevronLeft, BookOpen, Heart, Flame } from 'lucide-react';
import { Star8Point } from '@/components/svg/Ornaments';

export const ShopMenuDrawer: React.FC = () => {
  const { activeDrawer, closeDrawer, openDrawer } = useShop();
  const isOpen = activeDrawer === 'menu';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start animate-fade-in" aria-modal="true" role="dialog">
      {/* Darkened Backdrop */}
      <div
        className="absolute inset-0 bg-[#3d2a1f]/40 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-[#f8f2e7] border-e border-[rgba(92,61,46,0.18)] h-full flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(92,61,46,0.12)] bg-[#fcfaf5]">
            <div className="flex items-center gap-2">
              <Star8Point size={15} />
              <h2 className="text-base font-amiri font-bold text-[#5c3d2e]">
                المتجر
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-[#5c3d2e] hover:bg-[#5c3d2e]/10 rounded transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Rows with Hairline Dividers */}
          <nav className="divide-y divide-[rgba(92,61,46,0.12)] text-xs font-cairo text-[#3d2a1f]">
            {/* 1. Row: عبايات */}
            <div>
              <Link
                href="/shop?category=عبايات"
                onClick={closeDrawer}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-[#fcfaf5] transition-colors"
              >
                <div className="flex items-center gap-2 font-semibold text-[#5c3d2e]">
                  <span>عبايات</span>
                </div>
                <ChevronLeft size={14} className="text-[#8a6b57]" />
              </Link>
            </div>

            {/* 2. Row: إسدالات */}
            <div>
              <Link
                href="/shop?category=إسدالات"
                onClick={closeDrawer}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-[#fcfaf5] transition-colors"
              >
                <div className="flex items-center gap-2 font-semibold text-[#5c3d2e]">
                  <span>إسدالات</span>
                </div>
                <ChevronLeft size={14} className="text-[#8a6b57]" />
              </Link>
            </div>

            {/* 3. Plain Row: الأكثر مبيعًا */}
            <div>
              <Link
                href="/shop?filter=bestseller"
                onClick={closeDrawer}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-[#fcfaf5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Flame size={15} className="text-[#5c3d2e]" />
                  <span className="font-semibold text-[#5c3d2e]">الأكثر مبيعًا</span>
                </div>
                <ChevronLeft size={14} className="text-[#8a6b57]" />
              </Link>
            </div>

            {/* 4. Plain Row: المحتوى */}
            <div>
              <Link
                href="/content"
                onClick={closeDrawer}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-[#fcfaf5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={15} className="text-[#5c3d2e]" />
                  <span>المحتوى والمجلة التراثية</span>
                </div>
                <ChevronLeft size={14} className="text-[#8a6b57]" />
              </Link>
            </div>

            {/* 5. Plain Row: المفضلة */}
            <div>
              <button
                onClick={() => openDrawer('wishlist')}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-[#fcfaf5] transition-colors text-start"
              >
                <div className="flex items-center gap-2">
                  <Heart size={15} className="text-[#5c3d2e]" />
                  <span>المفضلة</span>
                </div>
                <ChevronLeft size={14} className="text-[#8a6b57]" />
              </button>
            </div>
          </nav>
        </div>

        {/* Drawer Bottom Box */}
        <div className="p-4 border-t border-[rgba(92,61,46,0.12)] bg-[#fcfaf5] text-xs font-cairo space-y-2.5">
          <div className="text-[#8a6b57] text-[11px]">
            <span className="block font-semibold text-[#5c3d2e] mb-0.5">
              خدمة التوصيل والاستقبال الخاص
            </span>
            <span>القاهرة · الشيخ زايد · التجمع · الإسكندرية</span>
          </div>
          <Link
            href="/shop"
            onClick={closeDrawer}
            className="block w-full py-2 bg-[#5c3d2e] text-[#f8f2e7] text-center text-xs font-medium hover:bg-[#3d2a1f] transition-colors"
          >
            استعراض كامل التشكيلة
          </Link>
        </div>
      </div>
    </div>
  );
};
