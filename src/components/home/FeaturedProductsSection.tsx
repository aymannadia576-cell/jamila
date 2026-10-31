'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from '@/components/common/ProductCard';
import { ArrowLeft } from 'lucide-react';

export const FeaturedProductsSection: React.FC = () => {
  const { products } = useShop();
  const [activeTab, setActiveTab] = useState<'الكل' | 'عبايات' | 'إسدالات' | 'الأكثر مبيعًا'>('الكل');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'الكل') return true;
    if (activeTab === 'الأكثر مبيعًا') return p.bestSeller;
    return p.category === activeTab;
  });

  const tabs: Array<'الكل' | 'عبايات' | 'إسدالات' | 'الأكثر مبيعًا'> = [
    'الكل',
    'عبايات',
    'إسدالات',
    'الأكثر مبيعًا',
  ];

  return (
    <section id="featured" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-amiri font-bold text-[#5c3d2e] mb-3">
          تصاميم مرسومة بروح الأصالة العربية
        </h2>
        <p className="text-xs sm:text-sm text-[#8a6b57] font-cairo">
          كل قطعة تحفة فنية مرسومة بخطوط أنيقة ومحاكة بأجود أنواع الحرير الطبيعي والتطريز اليدوي الدقيق.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-cairo font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#5c3d2e] text-[#f8f2e7] border border-[#5c3d2e]'
                  : 'bg-transparent text-[#8a6b57] border border-[rgba(92,61,46,0.2)] hover:border-[#5c3d2e] hover:text-[#5c3d2e]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-[#fcfaf5] border border-[rgba(92,61,46,0.14)] p-8 my-6">
          <p className="text-xs text-[#8a6b57] font-cairo">
            لا توجد تصاميم معروضة حالياً في هذا القسم. سيتم إضافة تشكيلات جديدة قريباً.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-14 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-cairo font-semibold uppercase tracking-wider hover:bg-[#3d2a1f] transition-colors shadow-xs"
        >
          <span>استعراض كافة التصاميم ({products.length} قطعة)</span>
          <ArrowLeft size={16} />
        </Link>
      </div>
    </section>
  );
};
