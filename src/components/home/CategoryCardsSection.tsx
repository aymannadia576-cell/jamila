'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CornerOrnament } from '@/components/svg/Ornaments';

export const CategoryCardsSection: React.FC = () => {
  const categories = [
    {
      id: 'abayas',
      title: 'عبايات',
      link: '/shop?category=عبايات',
      image: '/products/product-1.png',
    },
    {
      id: 'sadals',
      title: 'إسدالات',
      link: '/shop?category=إسدالات',
      image: '/products/product-2.png',
    },
    {
      id: 'bestsellers',
      title: 'الأكثر مبيعًا',
      link: '/shop?filter=bestseller',
      image: '/products/product-3.png',
    },
  ];

  return (
    <section id="categories" className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {categories.map((cat) => {
          return (
            <Link
              key={cat.id}
              href={cat.link}
              className="relative bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-4 sm:p-5 flex flex-col justify-between hover:border-[#5c3d2e] hover:shadow-[0_10px_25px_rgba(92,61,46,0.06)] transition-all duration-300 group rounded-xs"
            >
              <CornerOrnament position="top-start" color="#5c3d2e" />
              <CornerOrnament position="top-end" color="#5c3d2e" />
              <CornerOrnament position="bottom-start" color="#5c3d2e" />
              <CornerOrnament position="bottom-end" color="#5c3d2e" />

              <div className="text-center mb-3">
                <h3 className="text-2xl sm:text-3xl font-amiri font-bold text-[#5c3d2e] group-hover:text-[#3d2a1f] transition-colors">
                  {cat.title}
                </h3>
              </div>

              <div className="relative w-full aspect-[4/3] bg-[#f8f2e7] border border-[rgba(92,61,46,0.1)] overflow-hidden rounded-xs">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
