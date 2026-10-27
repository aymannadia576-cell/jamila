'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { GarmentSketch } from '@/components/svg/GarmentSketches';
import { Star8Point } from '@/components/svg/Ornaments';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const router = useRouter();
  const {
    activeDrawer,
    closeDrawer,
    wishlistProducts,
    toggleWishlist,
    addToCart,
    wishlistCount,
  } = useShop();

  const isOpen = activeDrawer === 'wishlist';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in" aria-modal="true" role="dialog">
      <div
        className="absolute inset-0 bg-[#3d2a1f]/40 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xs sm:max-w-sm bg-[#f8f2e7] border-s border-[rgba(92,61,46,0.18)] h-full flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(92,61,46,0.12)] bg-[#fcfaf5]">
            <div className="flex items-center gap-2">
              <Heart size={17} className="text-[#5c3d2e]" />
              <h2 className="text-base font-amiri font-bold text-[#5c3d2e]">
                قائمة المفضلة ({wishlistCount})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-[#5c3d2e] hover:bg-[#5c3d2e]/10 rounded transition-colors"
              aria-label="إغلاق المفضلة"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-14 px-4">
                <div className="w-12 h-12 mx-auto mb-3 border border-[rgba(92,61,46,0.25)] rounded-full flex items-center justify-center">
                  <Star8Point size={18} className="text-[#8a6b57]" />
                </div>
                <h3 className="text-sm font-amiri font-bold text-[#5c3d2e] mb-1">
                  لا توجد عناصر في مفضلتكِ
                </h3>
                <p className="text-[11px] text-[#8a6b57] font-cairo mb-5">
                  اضغطي على رمز القلب في بطاقات العباءات لحفظ التصاميم التي تنال إعجابكِ.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    router.push('/shop');
                  }}
                  className="px-5 py-2 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-cairo hover:bg-[#3d2a1f] transition-colors"
                >
                  استكشاف التصاميم
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pe-1">
                {wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.14)] p-3 flex gap-3 items-center relative"
                  >
                    <div className="w-14 h-18 bg-[#f8f2e7] border border-[rgba(92,61,46,0.1)] overflow-hidden flex-shrink-0 rounded-xs">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="p-1 w-full h-full flex items-center justify-center">
                          <GarmentSketch variant={product.svgVariant} stroke="#5c3d2e" className="w-full h-full" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${product.id}`}
                        onClick={closeDrawer}
                        className="text-xs font-amiri font-bold text-[#3d2a1f] hover:text-[#5c3d2e] block truncate"
                      >
                        {product.name}
                      </Link>
                      <div className="text-[10px] text-[#8a6b57] font-cairo truncate">
                        {product.tag}
                      </div>
                      <div className="text-[11px] font-semibold text-[#5c3d2e] font-cairo mt-0.5">
                        {product.price.toLocaleString('ar-SA')} ج.م
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-[#8a6b57] hover:text-[#5c3d2e] p-1 transition-colors"
                        aria-label="إزالة من المفضلة"
                        title="إزالة"
                      >
                        <Trash2 size={12} />
                      </button>

                      {(product.stock ?? 10) <= 0 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-[9px] font-bold font-cairo rounded-xs uppercase">
                          Sold Out
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            addToCart(product, product.sizes?.[0] || 'M', 1);
                          }}
                          className="px-2 py-1 bg-[#5c3d2e] text-[#f8f2e7] text-[10px] font-cairo hover:bg-[#3d2a1f] transition-colors flex items-center gap-1"
                        >
                          <ShoppingBag size={10} />
                          <span>للسلة</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-[rgba(92,61,46,0.12)] bg-[#fcfaf5]">
            <button
              onClick={() => {
                wishlistProducts
                  .filter((p) => (p.stock ?? 10) > 0)
                  .forEach((p) => addToCart(p, p.sizes?.[0] || 'M', 1));
              }}
              className="w-full py-2.5 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-cairo font-medium hover:bg-[#3d2a1f] transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} />
              <span>نقل جميع القطع المتاحة إلى السلة</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
