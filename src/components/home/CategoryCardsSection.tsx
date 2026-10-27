'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CornerOrnament, StarDivider } from '@/components/svg/Ornaments';
import { ArrowLeft, Sparkles, Flame, Layers } from 'lucide-react';

export const CategoryCardsSection: React.FC = () => {
  const categories = [
    {
      id: 'abayas',
      title: 'عبايات',
      subtitle: 'مجموعة الهوت كوتور',
      description: 'قصات معمارية منسدلة من الحرير الياباني الخام والكريب المزدوج الفاخر.',
      link: '/shop?category=عبايات',
      icon: Sparkles,
      image: '/products/product-1.png',
      badge: 'تشكيلة ٢٠٢٦',
    },
    {
      id: 'sadals',
      title: 'إسدالات',
      subtitle: 'أطقم الأصالة والراحة',
      description: 'إسدالات صلاة واستقبال انسيابية بقطعتين تجمع بين الستر التام والخفة.',
      link: '/shop?category=إسدالات',
      icon: Layers,
      image: '/products/product-2.png',
      badge: 'تصاميم تراثية',
    },
    {
      id: 'bestsellers',
      title: 'الأكثر مبيعًا',
      subtitle: 'مقتنيات النخبة',
      description: 'القطع الأكثر إقبالاً وإشادة من عميلات دار جميلة في كافة محافظات مصر.',
      link: '/shop?filter=bestseller',
      icon: Flame,
      image: '/products/product-3.png',
      badge: 'الأعلى تقييماً',
    },
  ];

  return (
    <section id="categories" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <StarDivider label="أقسام التشكيلة الفاخرة" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.link}
              className="relative bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 sm:p-6 flex flex-col justify-between hover:border-[#5c3d2e] hover:shadow-[0_10px_25px_rgba(92,61,46,0.06)] transition-all duration-300 group rounded-xs"
            >
              <CornerOrnament position="top-start" color="#5c3d2e" />
              <CornerOrnament position="top-end" color="#5c3d2e" />
              <CornerOrnament position="bottom-start" color="#5c3d2e" />
              <CornerOrnament position="bottom-end" color="#5c3d2e" />

              <div>
                <div className="flex items-center justify-between mb-3 border-b border-[rgba(92,61,46,0.1)] pb-2.5">
                  <span className="text-[9px] font-cairo font-semibold text-[#8a6b57] px-2 py-0.5 border border-[rgba(92,61,46,0.18)] rounded-xs">
                    {cat.badge}
                  </span>
                  <Icon size={16} className="text-[#5c3d2e]" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-amiri font-bold text-[#5c3d2e] mb-0.5 group-hover:text-[#3d2a1f] transition-colors">
                  {cat.title}
                </h3>
                <span className="text-[11px] text-[#8a6b57] font-cairo block mb-2 font-medium">
                  {cat.subtitle}
                </span>

                <p className="text-xs text-[#3d2a1f]/80 font-cairo leading-relaxed mb-3">
                  {cat.description}
                </p>
              </div>

              <div className="relative w-full aspect-[4/3] bg-[#f8f2e7] border border-[rgba(92,61,46,0.1)] overflow-hidden my-2 rounded-xs">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="mt-3 pt-3 border-t border-[rgba(92,61,46,0.1)] flex items-center justify-between text-xs font-cairo font-semibold text-[#5c3d2e]">
                <span>تصفح قسم {cat.title}</span>
                <ArrowLeft size={14} className="transform transition-transform group-hover:-translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
