'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { GarmentSketch } from '@/components/svg/GarmentSketches';
import { Star8Point } from '@/components/svg/Ornaments';
import { X, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    activeDrawer,
    closeDrawer,
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    user,
    freeShippingThreshold,
    getZoneForLocation,
  } = useShop();

  const isOpen = activeDrawer === 'cart';

  if (!isOpen) return null;

  const isFreeShipping = cartTotal >= freeShippingThreshold;
  const userZone = getZoneForLocation(user?.city);
  const estimatedShipping = isFreeShipping ? 0 : userZone?.shippingFee ?? 65;
  const finalTotal = cartTotal + estimatedShipping;
  const remainingForFree = Math.max(0, freeShippingThreshold - cartTotal);

  const handleCheckoutClick = () => {
    closeDrawer();
    router.push('/checkout');
  };

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
              <ShoppingBag size={17} className="text-[#5c3d2e]" />
              <h2 className="text-base font-amiri font-bold text-[#5c3d2e]">
                حقيبة التسوق ({cartCount})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-[#5c3d2e] hover:bg-[#5c3d2e]/10 rounded transition-colors"
              aria-label="إغلاق السلة"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4">
            {cart.length === 0 ? (
              <div className="text-center py-14 px-4">
                <div className="w-12 h-12 mx-auto mb-3 border border-[rgba(92,61,46,0.25)] rounded-full flex items-center justify-center">
                  <Star8Point size={18} className="text-[#8a6b57]" />
                </div>
                <h3 className="text-sm font-amiri font-bold text-[#5c3d2e] mb-1">
                  حقيبتكِ فارغة حالياً
                </h3>
                <p className="text-[11px] text-[#8a6b57] font-cairo mb-5">
                  استكشفي تصاميم العباءات والإسدالات الفاخرة وأضيفي ما يناسب ذوقك الرفيع.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    router.push('/shop');
                  }}
                  className="px-5 py-2 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-cairo hover:bg-[#3d2a1f] transition-colors"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[58vh] overflow-y-auto pe-1">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.size}-${idx}`}
                    className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.14)] p-3 flex gap-3 items-center relative"
                  >
                    <div className="w-14 h-18 bg-[#f8f2e7] border border-[rgba(92,61,46,0.1)] overflow-hidden flex-shrink-0 rounded-xs">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="p-1 w-full h-full flex items-center justify-center">
                          <GarmentSketch variant={item.product.svgVariant} stroke="#5c3d2e" className="w-full h-full" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.id}`}
                        onClick={closeDrawer}
                        className="text-xs font-amiri font-bold text-[#3d2a1f] hover:text-[#5c3d2e] block truncate"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-[10px] text-[#8a6b57] font-cairo">
                        المقاس: <span className="font-semibold text-[#5c3d2e]">{item.size}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-[#5c3d2e] font-cairo mt-0.5">
                        {item.product.price.toLocaleString('ar-SA')} ج.م
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="text-[#8a6b57] hover:text-[#5c3d2e] p-1 transition-colors"
                        aria-label="حذف القطعة"
                        title="حذف"
                      >
                        <Trash2 size={12} />
                      </button>

                      <div className="flex items-center border border-[rgba(92,61,46,0.2)] bg-[#f8f2e7]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, -1)}
                          className="px-1.5 py-0.5 text-[#5c3d2e] hover:bg-[#5c3d2e]/10 text-[10px]"
                          aria-label="تقليل الكمية"
                        >
                          <Minus size={9} />
                        </button>
                        <span className="px-1.5 text-[11px] font-medium font-cairo text-[#5c3d2e]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, 1)}
                          className="px-1.5 py-0.5 text-[#5c3d2e] hover:bg-[#5c3d2e]/10 text-[10px]"
                          aria-label="زيادة الكمية"
                        >
                          <Plus size={9} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-[rgba(92,61,46,0.12)] bg-[#fcfaf5] space-y-2.5 font-cairo text-xs">
            {!isFreeShipping ? (
              <div className="p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.15)] text-[10px] text-[#5c3d2e] rounded-xs text-center">
                أضيفي بقيمة <strong>{remainingForFree.toLocaleString('ar-SA')} ج.م</strong> أخرى للحصول على <strong>شحن مجاني</strong> (للطلبات فوق ٤,٠٠٠ ج.م)
              </div>
            ) : (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 rounded-xs text-center font-semibold">
                🎉 طلبكِ مؤهل للشحن المجاني لجميع محافظات مصر!
              </div>
            )}

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-[#8a6b57]">
                <span>المجموع الفرعي</span>
                <span>{cartTotal.toLocaleString('ar-SA')} ج.م</span>
              </div>
              <div className="flex justify-between text-[#8a6b57]">
                <span>
                  الشحن والتوصيل {user?.city ? `(${user.city})` : '(حسب المحافظة)'}
                </span>
                <span className="text-[#5c3d2e] font-semibold">
                  {isFreeShipping
                    ? 'مجاني'
                    : `${estimatedShipping.toLocaleString('ar-SA')} ج.م`}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-[#3d2a1f] border-t border-[rgba(92,61,46,0.1)] pt-1.5 font-amiri">
                <span>الإجمالي النهائي</span>
                <span className="text-sm text-[#5c3d2e]">{finalTotal.toLocaleString('ar-SA')} ج.م</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-2.5 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-medium uppercase tracking-wider hover:bg-[#3d2a1f] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
