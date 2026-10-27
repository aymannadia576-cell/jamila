'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';
import { useShop } from '@/context/ShopContext';
import { GarmentSketch } from '@/components/svg/GarmentSketches';
import { CornerOrnament } from '@/components/svg/Ornaments';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const isFavorited = isInWishlist(product.id);
  const isSoldOut = typeof product.stock === 'number' && product.stock <= 0;
  const defaultSize = product.sizes?.length ? product.sizes[0] : 'M';

  const gallery = Array.from(
    new Set([product.image, ...(product.gallery || [])].filter(Boolean))
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const currentImage = gallery[activeIdx] || product.image;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % gallery.length);
  };

  return (
    <div className="relative bg-[#fcfaf5] border border-[rgba(92,61,46,0.16)] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:border-[#5c3d2e] hover:shadow-[0_8px_20px_rgba(92,61,46,0.05)] group">
      <CornerOrnament position="top-start" color="#5c3d2e" />
      <CornerOrnament position="top-end" color="#5c3d2e" />
      <CornerOrnament position="bottom-start" color="#5c3d2e" />
      <CornerOrnament position="bottom-end" color="#5c3d2e" />

      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex items-center gap-1.5">
          {isSoldOut ? (
            <span className="inline-block bg-red-800 text-white text-[9px] font-cairo font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase">
              Sold Out • نفذت الكمية
            </span>
          ) : product.bestSeller ? (
            <span className="inline-block bg-[#5c3d2e] text-[#f8f2e7] text-[9px] font-cairo font-semibold px-2 py-0.5 rounded-xs tracking-wider">
              الأكثر مبيعًا
            </span>
          ) : (
            <span className="inline-block text-[9px] font-cairo text-[#8a6b57] px-1.5 py-0.5 border border-[rgba(92,61,46,0.2)] rounded-xs">
              {product.category}
            </span>
          )}

          {gallery.length > 1 && (
            <span className="inline-flex items-center gap-1 text-[9px] font-cairo font-semibold text-[#5c3d2e] bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] px-1.5 py-0.5 rounded-xs">
              <Images size={10} />
              <span>{gallery.length} صور</span>
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            isFavorited
              ? 'text-[#5c3d2e] bg-[#5c3d2e]/10'
              : 'text-[#8a6b57] hover:text-[#5c3d2e] hover:bg-[#5c3d2e]/5'
          }`}
          aria-label={isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart size={16} fill={isFavorited ? '#5c3d2e' : 'none'} strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative w-full aspect-[3/4] my-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.1)] overflow-hidden rounded-xs">
        <Link
          href={`/product/${product.id}`}
          className="relative block w-full h-full"
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt={`${product.name} - صورة ${activeIdx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized={
                currentImage.startsWith('data:') ||
                currentImage.startsWith('blob:') ||
                currentImage.startsWith('/uploads/')
              }
              className={`object-cover object-top transform transition-transform duration-700 ease-out group-hover:scale-105 ${
                isSoldOut ? 'opacity-75 grayscale-[25%]' : ''
              }`}
            />
          ) : (
            <div className="w-full h-full p-4 transform transition-transform duration-500 group-hover:scale-104">
              <GarmentSketch variant={product.svgVariant} stroke="#5c3d2e" className="w-full h-full" />
            </div>
          )}
          {isSoldOut && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-[#3d2a1f]/85 text-[#f8f2e7] py-1.5 text-center text-xs font-cairo font-bold tracking-widest uppercase shadow-md">
              Sold Out • نفذت الكمية
            </div>
          )}
        </Link>

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="الصورة السابقة"
              className="absolute top-1/2 -translate-y-1/2 start-2 z-10 w-7 h-7 rounded-full bg-[#fcfaf5]/90 text-[#5c3d2e] border border-[rgba(92,61,46,0.25)] flex items-center justify-center shadow-xs hover:bg-[#5c3d2e] hover:text-[#f8f2e7] transition-all cursor-pointer"
            >
              <ChevronRight size={15} />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="الصورة التالية"
              className="absolute top-1/2 -translate-y-1/2 end-2 z-10 w-7 h-7 rounded-full bg-[#fcfaf5]/90 text-[#5c3d2e] border border-[rgba(92,61,46,0.25)] flex items-center justify-center shadow-xs hover:bg-[#5c3d2e] hover:text-[#f8f2e7] transition-all cursor-pointer"
            >
              <ChevronLeft size={15} />
            </button>

            <div className="absolute bottom-2 inset-x-0 z-10 flex items-center justify-center gap-1.5">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveIdx(idx);
                  }}
                  aria-label={`عرض صورة ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeIdx === idx
                      ? 'w-5 bg-[#5c3d2e]'
                      : 'w-1.5 bg-[#fcfaf5]/85 hover:bg-[#fcfaf5]'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-1 mb-1">
          {gallery.slice(0, 5).map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`w-9 h-11 rounded-xs overflow-hidden border transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'border-[#5c3d2e] ring-1 ring-[#5c3d2e] scale-105'
                  : 'border-[rgba(92,61,46,0.2)] opacity-65 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt="" className="w-full h-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}

      <div className="pt-2 text-center flex flex-col items-center">
        <span className="text-[10px] text-[#8a6b57] font-cairo mb-1 block truncate max-w-full">
          {product.tag}
        </span>

        <Link
          href={`/product/${product.id}`}
          className="text-base sm:text-lg font-amiri font-bold text-[#3d2a1f] hover:text-[#5c3d2e] transition-colors mb-1 line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="text-xs sm:text-sm font-semibold text-[#5c3d2e] font-cairo mb-3.5">
          {product.price.toLocaleString('ar-SA')} ج.م
        </div>

        {isSoldOut ? (
          <button
            type="button"
            disabled
            className="w-full py-2 px-3 bg-[#eadecc] text-[#8a6b57] border border-[rgba(92,61,46,0.2)] text-xs font-cairo font-bold flex items-center justify-center gap-1.5 cursor-not-allowed uppercase tracking-wider"
          >
            <span>Sold Out • نفذت الكمية</span>
          </button>
        ) : (
          <button
            onClick={() => addToCart(product, defaultSize, 1)}
            className="w-full py-2 px-3 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-cairo font-medium hover:bg-[#3d2a1f] transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ShoppingBag size={13} />
            <span>أضيفي للسلة</span>
          </button>
        )}
      </div>
    </div>
  );
};
