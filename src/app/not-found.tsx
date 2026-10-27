import React from 'react';
import Link from 'next/link';
import { Star8Point, CornerOrnament } from '@/components/svg/Ornaments';
import { MashrabiyaPattern } from '@/components/svg/MashrabiyaPattern';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 font-cairo relative overflow-hidden">
      <MashrabiyaPattern opacity={0.06} />

      <div className="relative bg-[#fcfaf5] border border-[rgba(92,61,46,0.3)] p-8 sm:p-14 max-w-lg text-center z-10 shadow-lg">
        <CornerOrnament position="top-start" color="#5c3d2e" />
        <CornerOrnament position="top-end" color="#5c3d2e" />
        <CornerOrnament position="bottom-start" color="#5c3d2e" />
        <CornerOrnament position="bottom-end" color="#5c3d2e" />

        <div className="flex items-center justify-center gap-2 mb-4">
          <Star8Point size={16} />
          <span className="text-3xl sm:text-4xl font-playfair font-bold text-[#5c3d2e]">
            404
          </span>
          <Star8Point size={16} />
        </div>

        <h1 className="text-2xl font-amiri font-bold text-[#5c3d2e] mb-2">
          الصفحة غير موجودة
        </h1>

        <p className="text-xs sm:text-sm text-[#8a6b57] mb-8 leading-relaxed">
          عذراً، الصفحة التي تبحثين عنها قد تكون نُقلت أو لم تعد متوفرة في أرشيف دار جميلة.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold uppercase tracking-wider hover:bg-[#3d2a1f] transition-colors"
        >
          <span>العودة للرئيسية</span>
          <ArrowLeft size={14} />
        </Link>
      </div>
    </div>
  );
}
