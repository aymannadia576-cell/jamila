'use client';

import React from 'react';
import Link from 'next/link';
import { Star8Point } from '@/components/svg/Ornaments';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#5c3d2e] text-[#f8f2e7] pt-12 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-[rgba(248,242,231,0.12)] relative overflow-hidden font-cairo">
      {/* Background Decorative Stars */}
      <div className="absolute top-8 start-6 opacity-8 pointer-events-none" aria-hidden="true">
        <Star8Point size={100} color="#f8f2e7" />
      </div>
      <div className="absolute bottom-8 end-6 opacity-8 pointer-events-none" aria-hidden="true">
        <Star8Point size={100} color="#f8f2e7" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 mb-10 text-xs">
          {/* Col 1: Wordmark Logo & Brand Statement (100% Transparent Background, Fixed Cream Color) */}
          <div className="space-y-3.5 md:col-span-2">
            <Link
              href="/"
              className="inline-block select-none"
              aria-label="JAMILA جميلة"
            >
              <img
                src="/jamila-logo-light.png"
                alt="JAMILA جميلة"
                className="h-12 sm:h-14 w-auto max-w-[190px] object-contain opacity-100"
                style={{ opacity: 1, filter: 'none' }}
              />
            </Link>
            <p className="text-[#f8f2e7]/90 max-w-sm leading-relaxed text-xs font-light">
              دار أزياء عربية متخصصة في العباءات والسدالات الفاخرة، تجمع بين نقاء الحرير وعراقة العمارة الإسلامية برؤية معاصرة للأناقة المحتشمة. شحن وتوصيل سريع لباب المنزل في كافة محافظات مصر.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="w-3.5 h-3.5 rounded-full bg-[#f8f2e7] border border-[#5c3d2e]" title="كريمي #f8f2e7" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#3d2a1f] border border-[#f8f2e7]" title="شوكولاتة دافئة #3d2a1f" />
              <span className="text-[10px] text-[#f8f2e7]/75 tracking-wider">لوحة ألوان جميلة التراثية الخالصة</span>
            </div>
          </div>

          {/* Col 2: تسوقي (Shop Links) */}
          <div>
            <h4 className="text-xs font-amiri font-bold text-[#f8f2e7] mb-3 border-b border-[#f8f2e7]/15 pb-1.5 uppercase tracking-wider">
              تسوقي
            </h4>
            <ul className="space-y-2 text-[#f8f2e7]/85 text-[11px]">
              <li>
                <Link href="/shop?category=عبايات" className="hover:text-[#f8f2e7] transition-colors">
                  عبايات الهوت كوتور
                </Link>
              </li>
              <li>
                <Link href="/shop?category=إسدالات" className="hover:text-[#f8f2e7] transition-colors">
                  إسدالات الصلاة الفاخرة
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=bestseller" className="hover:text-[#f8f2e7] transition-colors">
                  الأكثر مبيعًا
                </Link>
              </li>
              <li>
                <Link href="/content" className="hover:text-[#f8f2e7] transition-colors">
                  المجلة والمحتوى
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: تابعينا وتواصلي معنا */}
          <div>
            <h4 className="text-xs font-amiri font-bold text-[#f8f2e7] mb-3 border-b border-[#f8f2e7]/15 pb-1.5 uppercase tracking-wider">
              تابعينا وتواصلي معنا
            </h4>
            <ul className="space-y-2 text-[#f8f2e7]/85 text-[11px]">
              <li>
                <span className="block text-[#f8f2e7]/70 text-[10px]">خدمة العملاء في مصر:</span>
                <span className="text-[#f8f2e7] font-semibold">توصيل سريع لجميع المحافظات</span>
              </li>
              <li>
                <span className="text-[#f8f2e7] font-medium">القاهرة · الشيخ زايد · التجمع الخامس</span>
              </li>
              <li>
                <span className="text-[#f8f2e7] font-medium">الإسكندرية · المنصورة · طنطا والصعيد</span>
              </li>
              <li>
                <a href="mailto:concierge@jamila.com" className="hover:underline text-[#f8f2e7]/90">
                  concierge@jamila.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright + City */}
        <div className="pt-6 border-t border-[#f8f2e7]/15 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#f8f2e7]/70">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} دار جميلة للأزياء الراقية — جمهورية مصر العربية.
          </div>
          <div className="mt-2.5 sm:mt-0 font-amiri text-xs text-[#f8f2e7]/90 flex items-center gap-2">
            <span>القاهرة</span>
            <span>·</span>
            <span>الإسكندرية</span>
            <span>·</span>
            <span>الجيزة</span>
            <span>·</span>
            <span>محافظات مصر</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
