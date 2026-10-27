'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from '@/components/common/ProductCard';
import { CornerOrnament, StarDivider } from '@/components/svg/Ornaments';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Sparkles,
  Check,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const { products, addToCart, toggleWishlist, isInWishlist } = useShop();

  const productId = params?.id as string;
  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isSoldOut = typeof product.stock === 'number' && product.stock <= 0;
  const maxAvailable =
    typeof product.stock === 'number' && product.stock > 0 ? product.stock : 10;
  const productSizes = product.sizes?.length ? product.sizes : ['S', 'M', 'L', 'XL', '2XL', '3XL'];
  const galleryImages = Array.from(
    new Set([product.image, ...(product.gallery || [])].filter(Boolean))
  );

  const activeSelectedSize = productSizes.includes(selectedSize)
    ? selectedSize
    : productSizes[0];
  const activeSelectedImage =
    selectedImage && galleryImages.includes(selectedImage)
      ? selectedImage
      : product.image || '/products/product-1.png';
  const activeGalleryIdx = Math.max(0, galleryImages.indexOf(activeSelectedImage));

  const handleAddToCart = () => {
    addToCart(product, activeSelectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-cairo">
      <div className="flex items-center gap-2 text-xs text-[#8a6b57] mb-8">
        <Link href="/" className="hover:text-[#5c3d2e] transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-[#5c3d2e] transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#5c3d2e] font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-[#fcfaf5] border border-[rgba(92,61,46,0.2)] overflow-hidden shadow-sm group">
            <CornerOrnament position="top-start" color="#5c3d2e" />
            <CornerOrnament position="top-end" color="#5c3d2e" />
            <CornerOrnament position="bottom-start" color="#5c3d2e" />
            <CornerOrnament position="bottom-end" color="#5c3d2e" />

            <img
              src={activeSelectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-103"
            />

            {isSoldOut ? (
              <span className="absolute top-4 start-4 bg-red-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xs tracking-wider uppercase z-10 shadow-md">
                Sold Out • نفذت الكمية
              </span>
            ) : (
              product.bestSeller && (
                <span className="absolute top-4 start-4 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold px-3 py-1 rounded-xs tracking-wider z-10 shadow-xs">
                  الأكثر طلباً ⭐
                </span>
              )
            )}

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage(
                      galleryImages[(activeGalleryIdx - 1 + galleryImages.length) % galleryImages.length]
                    )
                  }
                  className="absolute top-1/2 -translate-y-1/2 start-3 z-10 w-9 h-9 rounded-full bg-[#fcfaf5]/90 text-[#5c3d2e] border border-[rgba(92,61,46,0.25)] flex items-center justify-center shadow-xs hover:bg-[#5c3d2e] hover:text-[#f8f2e7] transition-all cursor-pointer"
                  aria-label="الصورة السابقة"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage(
                      galleryImages[(activeGalleryIdx + 1) % galleryImages.length]
                    )
                  }
                  className="absolute top-1/2 -translate-y-1/2 end-3 z-10 w-9 h-9 rounded-full bg-[#fcfaf5]/90 text-[#5c3d2e] border border-[rgba(92,61,46,0.25)] flex items-center justify-center shadow-xs hover:bg-[#5c3d2e] hover:text-[#f8f2e7] transition-all cursor-pointer"
                  aria-label="الصورة التالية"
                >
                  ›
                </button>
                <span className="absolute bottom-3 end-3 bg-black/65 text-[#f8f2e7] text-[11px] font-semibold px-2.5 py-0.5 rounded-xs z-10">
                  {activeGalleryIdx + 1} / {galleryImages.length}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {galleryImages.map((imgSrc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(imgSrc)}
                className={`relative w-20 h-24 sm:w-24 sm:h-28 bg-[#fcfaf5] border overflow-hidden flex-shrink-0 transition-all cursor-pointer rounded-xs ${
                  activeSelectedImage === imgSrc
                    ? 'border-[#5c3d2e] ring-2 ring-[#5c3d2e]/60 shadow-xs'
                    : 'border-[rgba(92,61,46,0.2)] opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={imgSrc}
                  alt={`${product.name} ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="inline-block text-[11px] font-semibold tracking-wider mb-1.5 px-2 py-0.5 bg-[#5c3d2e]/10 text-[#5c3d2e] rounded-xs">
              {product.category} · {product.tag}
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-amiri font-bold text-[#3d2a1f] mb-2 leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3 my-4">
              <span className="text-2xl sm:text-3xl font-bold font-cairo text-[#5c3d2e]">
                {product.price.toLocaleString('ar-SA')} ج.م
              </span>
              <span className="text-xs text-[#8a6b57]">
                شامل ضريبة القيمة المضافة
              </span>
              {isSoldOut && (
                <span className="px-2.5 py-0.5 bg-red-100 text-red-800 border border-red-200 text-xs font-bold rounded-xs uppercase">
                  Sold Out • نفذت الكمية
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#3d2a1f]/85 leading-relaxed border-t border-[rgba(92,61,46,0.12)] pt-4">
              {product.description}
            </p>
          </div>

          <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.14)] p-3.5 space-y-1 text-xs">
            <div className="text-[11px] font-bold text-[#5c3d2e] flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>مواصفات القماش الملكي</span>
            </div>
            <p className="text-[#3d2a1f]/80 text-[11px] leading-normal">{product.fabric}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#3d2a1f]">
                اختيار المقاس:
              </label>
              <span className="text-[11px] text-[#8a6b57]">المقاسات المصرية والخليجية</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {productSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 text-xs font-bold transition-all rounded-xs border cursor-pointer ${
                    activeSelectedSize === size
                      ? 'bg-[#5c3d2e] text-[#f8f2e7] border-[#5c3d2e] shadow-xs'
                      : 'bg-[#fcfaf5] text-[#5c3d2e] border-[rgba(92,61,46,0.2)] hover:border-[#5c3d2e]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {!isSoldOut && (
                <div className="flex items-center border border-[rgba(92,61,46,0.25)] bg-[#fcfaf5] h-11 px-2 rounded-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 text-sm text-[#5c3d2e] font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-[#3d2a1f] min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(maxAvailable, quantity + 1))}
                    className="px-2 text-sm text-[#5c3d2e] font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              )}

              {isSoldOut ? (
                <button
                  type="button"
                  disabled
                  className="flex-1 h-11 bg-[#eadecc] text-[#8a6b57] border border-[rgba(92,61,46,0.25)] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs cursor-not-allowed"
                >
                  <span>Sold Out — نفذت الكمية حالياً</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-11 bg-[#5c3d2e] hover:bg-[#3d2a1f] text-[#f8f2e7] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xs rounded-xs cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      <span>تمت الإضافة لحقيبة التسوق!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>أضيفي إلى حقيبة التسوق</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`h-11 w-11 flex items-center justify-center border transition-colors rounded-xs cursor-pointer ${
                  isFavorited
                    ? 'border-[#5c3d2e] bg-[#5c3d2e]/10 text-[#5c3d2e]'
                    : 'border-[rgba(92,61,46,0.25)] bg-[#fcfaf5] text-[#8a6b57] hover:text-[#5c3d2e]'
                }`}
                title={isFavorited ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
              >
                <Heart size={18} fill={isFavorited ? '#5c3d2e' : 'none'} />
              </button>
            </div>
          </div>

          <div className="border-t border-[rgba(92,61,46,0.12)] pt-4 space-y-2.5 text-xs text-[#8a6b57]">
            <div className="flex items-center gap-2.5">
              <Truck size={16} className="text-[#5c3d2e] flex-shrink-0" />
              <span>توصيل سريع لكافة محافظات مصر (شحن مجاني للطلبات فوق ٤,٠٠٠ ج.م)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-[#5c3d2e] flex-shrink-0" />
              <span>ضمان أصالة الخيوط والحرير الطبيعي بنسبة ١٠٠٪</span>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="border-t border-[rgba(92,61,46,0.12)] pt-12">
          <StarDivider label="قطع مقترحة من نفس التشكيلة" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
