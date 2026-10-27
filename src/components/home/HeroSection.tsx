'use client';

import React from 'react';
import Link from 'next/link';
import { MashrabiyaPattern } from '@/components/svg/MashrabiyaPattern';
import { MihrabArchFrame } from '@/components/svg/MihrabArchFrame';
import { Sparkles, ArrowDown, Flame } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-center items-center px-4 py-8 sm:py-14 overflow-hidden bg-[#f8f2e7]">
      <MashrabiyaPattern opacity={0.06} />

      <div className="absolute top-4 start-4 sm:top-6 sm:start-6 w-8 sm:w-10 h-8 sm:h-10 border-t border-s border-[rgba(92,61,46,0.2)] pointer-events-none" />
      <div className="absolute top-4 end-4 sm:top-6 sm:end-6 w-8 sm:w-10 h-8 sm:h-10 border-t border-e border-[rgba(92,61,46,0.2)] pointer-events-none" />
      <div className="absolute bottom-4 start-4 sm:bottom-6 sm:start-6 w-8 sm:w-10 h-8 sm:h-10 border-b border-s border-[rgba(92,61,46,0.2)] pointer-events-none" />
      <div className="absolute bottom-4 end-4 sm:bottom-6 sm:end-6 w-8 sm:w-10 h-8 sm:h-10 border-b border-e border-[rgba(92,61,46,0.2)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl mx-auto my-auto">
        <MihrabArchFrame animate={true}>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-amiri font-bold text-[#5c3d2e] leading-[1.2] mb-6 max-w-xl">
            لِأَنَّ الجَمَالَ يَرْتَدِي
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md justify-center">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-7 py-3 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-cairo font-semibold uppercase tracking-wider hover:bg-[#3d2a1f] transition-all flex items-center justify-center gap-2 shadow-xs group"
            >
              <Sparkles size={14} className="transition-transform group-hover:rotate-12" />
              <span>استكشفي المجموعة</span>
            </Link>

            <Link
              href="/shop?filter=bestseller"
              className="w-full sm:w-auto px-7 py-3 bg-transparent text-[#5c3d2e] border border-[rgba(92,61,46,0.35)] text-xs font-cairo font-semibold uppercase tracking-wider hover:border-[#5c3d2e] hover:bg-[#5c3d2e]/5 transition-all flex items-center justify-center gap-2"
            >
              <Flame size={14} />
              <span>الأكثر مبيعًا</span>
            </Link>
          </div>

          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-3 text-[9px] sm:text-[10px] tracking-[0.18em] font-cairo text-[#8a6b57]">
            <span>حرير طبيعي ١٠٠٪</span>
            <span>✦</span>
            <span>حياكة يدوية متقنة</span>
            <span>✦</span>
            <span>إصدارات محدودة</span>
          </div>
        </MihrabArchFrame>
      </div>

      <a
        href="#categories"
        className="relative z-10 mt-2 sm:mt-4 flex flex-col items-center gap-1 text-[#8a6b57] hover:text-[#5c3d2e] transition-colors"
        aria-label="الانتقال إلى الأقسام"
      >
        <span className="text-[9px] font-cairo uppercase tracking-widest">
          استكشاف
        </span>
        <ArrowDown size={13} className="animate-bounce" />
      </a>
    </section>
  );
};
