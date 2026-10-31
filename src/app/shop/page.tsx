'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from '@/components/common/ProductCard';
import { Star8Point } from '@/components/svg/Ornaments';
import { Search, ArrowUpDown } from 'lucide-react';

type SortOption = 'default' | 'price-asc' | 'price-desc';

interface ShopInnerProps {
  initialCategory: string;
  initialQuery: string;
  tagParam: string | null;
}

function ShopInner({ initialCategory, initialQuery, tagParam }: ShopInnerProps) {
  const { products } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  let filtered = products.filter((p) => {
    if (selectedCategory === 'عبايات' && p.category !== 'عبايات') return false;
    if (selectedCategory === 'إسدالات' && p.category !== 'إسدالات') return false;
    if (selectedCategory === 'الأكثر مبيعًا' && !p.bestSeller) return false;

    if (tagParam && !p.tag.includes(tagParam) && !p.fabric.includes(tagParam)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchTag = p.tag.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchFabric = p.fabric.toLowerCase().includes(q);
      if (!matchName && !matchTag && !matchDesc && !matchFabric) return false;
    }

    return true;
  });

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  const categoryOptions = ['الكل', 'عبايات', 'إسدالات', 'الأكثر مبيعًا'];

  return (
    <div className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-cairo">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-1.5 mb-2 text-xs text-[#8a6b57]">
          <span>الرئيسية</span>
          <span>/</span>
          <span className="text-[#5c3d2e] font-semibold">المتجر والأزياء</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-amiri font-bold text-[#5c3d2e] mb-2">
          {selectedCategory === 'الكل'
            ? 'كافة تصاميم جميلة الفاخرة'
            : selectedCategory === 'الأكثر مبيعًا'
            ? 'التصاميم الأكثر مبيعًا وطلباً'
            : `مجموعة ${selectedCategory} الراقية`}
        </h1>
      </div>

      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.14)] p-3.5 sm:p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-center md:justify-start">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#5c3d2e] text-[#f8f2e7]'
                  : 'bg-transparent text-[#8a6b57] border border-[rgba(92,61,46,0.2)] hover:border-[#5c3d2e] hover:text-[#5c3d2e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="تصفية بالاسم أو القماش..."
              className="w-full py-1.5 px-3 ps-8 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-xs text-[#3d2a1f] placeholder-[#8a6b57]/60 focus:outline-none focus:border-[#5c3d2e]"
            />
            <Search size={13} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]" />
          </div>

          <div className="flex items-center gap-1 w-full sm:w-auto text-xs text-[#8a6b57]">
            <ArrowUpDown size={13} className="text-[#5c3d2e]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="py-1.5 px-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-xs text-[#5c3d2e] focus:outline-none focus:border-[#5c3d2e] cursor-pointer"
            >
              <option value="default">الترتيب الافتراضي</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between text-xs text-[#8a6b57]">
        <span>
          عرض <strong className="text-[#5c3d2e]">{filtered.length}</strong> من أصل{' '}
          <strong className="text-[#5c3d2e]">{products.length}</strong> قطعة متوفرة
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#5c3d2e] underline hover:text-[#3d2a1f]"
          >
            مسح التصفية
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#fcfaf5] border border-[rgba(92,61,46,0.14)] p-8">
          <div className="w-12 h-12 mx-auto mb-3 border border-[rgba(92,61,46,0.25)] rounded-full flex items-center justify-center">
            <Star8Point size={20} className="text-[#8a6b57]" />
          </div>
          <h3 className="text-base font-amiri font-bold text-[#5c3d2e] mb-1">
            لم نتمكن من العثور على تصاميم مطابقة
          </h3>
          <p className="text-xs text-[#8a6b57] mb-5">
            جربي تغيير كلمة البحث أو اختيار تصنيف آخر من القائمة أعلاه.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('الكل');
              setSearchQuery('');
            }}
            className="px-5 py-2 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold hover:bg-[#3d2a1f]"
          >
            عرض كافة القطع
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');
  const tagParam = searchParams.get('tag');
  const queryParam = searchParams.get('q') || '';

  const initialCategory =
    filterParam === 'bestseller'
      ? 'الأكثر مبيعًا'
      : categoryParam
      ? categoryParam
      : 'الكل';

  return (
    <ShopInner
      key={`${initialCategory}-${queryParam}-${tagParam || ''}`}
      initialCategory={initialCategory}
      initialQuery={queryParam}
      tagParam={tagParam}
    />
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-cairo text-xs text-[#8a6b57]">جاري تحميل المتجر...</div>}>
      <ShopContent />
    </Suspense>
  );
}
