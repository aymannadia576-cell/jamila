'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useShop, FREE_SHIPPING_THRESHOLD } from '@/context/ShopContext';
import { GarmentSketch } from '@/components/svg/GarmentSketches';
import { Star8Point, CornerOrnament } from '@/components/svg/Ornaments';
import { ShieldCheck, CheckCircle2, Truck, Banknote, Lock, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, user, zones, getZoneForLocation, refreshProducts } = useShop();

  const activeZones = useMemo(
    () => (zones.filter((z) => z.isActive).length > 0 ? zones.filter((z) => z.isActive) : zones),
    [zones]
  );

  const zoneOptions = useMemo(() => {
    return activeZones.map((zone) => {
      const govList = zone.governorates
        .split(/[،,]+/)
        .map((g) => g.trim())
        .filter(Boolean);
      const cities = govList.length > 0 ? govList : [zone.name];
      return {
        zone,
        cities,
      };
    });
  }, [activeZones]);

  const [formData, setFormData] = useState<{
    fullName?: string;
    phone?: string;
    city?: string;
    address?: string;
    paymentMethod: string;
    notes: string;
  }>({
    paymentMethod: 'cod',
    notes: '',
  });

  const effectiveFullName = formData.fullName ?? user?.name ?? '';
  const effectivePhone = formData.phone ?? user?.phone ?? '';
  const effectiveCity =
    formData.city || user?.city || zoneOptions[0]?.cities[0] || 'القاهرة';
  const effectiveAddress = formData.address ?? user?.address ?? '';

  const selectedZone = useMemo(
    () => getZoneForLocation(effectiveCity) || activeZones[0],
    [effectiveCity, getZoneForLocation, activeZones]
  );

  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : selectedZone ? Number(selectedZone.shippingFee) : 65;
  const finalTotal = cartTotal + shippingFee;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [placedSummary, setPlacedSummary] = useState<{
    recipientName: string;
    city: string;
    shippingFee: number;
    finalTotal: number;
    zoneName: string;
    estimatedDays: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setOrderError('');
    const refNumber = `JM-EG-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: refNumber,
          userId: user?.id || '',
          customerName: effectiveFullName,
          customerEmail: user?.email || '',
          customerPhone: effectivePhone,
          city: effectiveCity,
          address: effectiveAddress,
          paymentMethod: formData.paymentMethod,
          items: cart.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            image: item.product.image,
            size: item.size,
            price: item.product.price,
            quantity: item.quantity,
          })),
          total: finalTotal,
          notes: formData.notes,
        }),
      });
      const data = await res.json();
      await refreshProducts();

      if (!res.ok || !data.success) {
        setOrderError(data.message || 'تعذر إتمام الطلب، يرجى التحقق من توفر المنتجات والمحاولة مجدداً');
        return;
      }

      const confirmedTotal = Number(data.order?.total) || finalTotal;
      const confirmedRef = data.order?.id || refNumber;

      setOrderRef(confirmedRef);
      setPlacedSummary({
        recipientName: effectiveFullName || 'عميلة جميلة',
        city: effectiveCity,
        shippingFee,
        finalTotal: confirmedTotal,
        zoneName: selectedZone?.name || effectiveCity,
        estimatedDays: selectedZone?.estimatedDays || '٢ - ٤ أيام',
      });
      setOrderPlaced(true);
      clearCart();

      confetti({
        particleCount: 80,
        spread: 70,
        colors: ['#5c3d2e', '#f8f2e7', '#8a6b57', '#3d2a1f'],
      });
    } catch (err) {
      console.error('Error saving order:', err);
      setOrderError('حدث خطأ في الاتصال بالخادم، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto font-cairo text-center">
        <div className="relative bg-[#fcfaf5] border border-[rgba(92,61,46,0.25)] p-6 sm:p-10 shadow-lg animate-fade-in">
          <CornerOrnament position="top-start" color="#5c3d2e" />
          <CornerOrnament position="top-end" color="#5c3d2e" />
          <CornerOrnament position="bottom-start" color="#5c3d2e" />
          <CornerOrnament position="bottom-end" color="#5c3d2e" />

          <div className="w-14 h-14 mx-auto mb-3 bg-[#5c3d2e] text-[#f8f2e7] rounded-full flex items-center justify-center">
            <CheckCircle2 size={30} />
          </div>

          <h1 className="text-xl sm:text-2xl font-amiri font-bold text-[#5c3d2e] mb-1.5">
            تم استلام طلبكِ الفاخر بنجاح
          </h1>
          <p className="text-xs text-[#8a6b57] mb-5">
            شكراً لثقتكِ بدار جميلة. تم تسجيل طلبكِ وجاري تجهيز وشحن القطع لكافة محافظات مصر.
          </p>

          <div className="bg-[#f8f2e7] border border-[rgba(92,61,46,0.15)] p-3.5 text-xs text-start space-y-1.5 mb-6">
            <div className="flex justify-between border-b border-[rgba(92,61,46,0.08)] pb-1">
              <span className="text-[#8a6b57]">رقم الطلب الملكي:</span>
              <span className="font-mono font-bold text-[#5c3d2e] tracking-wider">{orderRef}</span>
            </div>
            <div className="flex justify-between border-b border-[rgba(92,61,46,0.08)] pb-1">
              <span className="text-[#8a6b57]">المستلم:</span>
              <span className="font-semibold text-[#3d2a1f]">{placedSummary?.recipientName}</span>
            </div>
            <div className="flex justify-between border-b border-[rgba(92,61,46,0.08)] pb-1">
              <span className="text-[#8a6b57]">مدينة / محافظة التوصيل:</span>
              <span className="font-semibold text-[#3d2a1f]">
                {placedSummary?.city} ({placedSummary?.zoneName})
              </span>
            </div>
            <div className="flex justify-between border-b border-[rgba(92,61,46,0.08)] pb-1">
              <span className="text-[#8a6b57]">تكلفة الشحن:</span>
              <span className="font-semibold text-[#5c3d2e]">
                {placedSummary?.shippingFee === 0
                  ? 'مجاني (تجاوز ٤,٠٠٠ ج.م)'
                  : `${placedSummary?.shippingFee.toLocaleString('ar-SA')} ج.م`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a6b57]">الإجمالي شامل الشحن:</span>
              <span className="font-bold text-[#5c3d2e]">
                {placedSummary?.finalTotal.toLocaleString('ar-SA')} ج.م
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block px-7 py-2.5 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold uppercase tracking-wider hover:bg-[#3d2a1f]"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 max-w-md mx-auto font-cairo text-center">
        <div className="w-12 h-12 mx-auto mb-3 border border-[rgba(92,61,46,0.25)] rounded-full flex items-center justify-center">
          <Star8Point size={20} className="text-[#8a6b57]" />
        </div>
        <h2 className="text-lg font-amiri font-bold text-[#5c3d2e] mb-1.5">
          حقيبة التسوق فارغة
        </h2>
        <p className="text-xs text-[#8a6b57] mb-5">
          يرجى إضافة تصاميم إلى حقيبتكِ لمتابعة إجراءات الطلب.
        </p>
        <Link
          href="/shop"
          className="inline-block px-5 py-2 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold hover:bg-[#3d2a1f]"
        >
          تصفح المتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-cairo">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-amiri font-bold text-[#5c3d2e] mb-1.5">
          إتمام الطلب الفاخر
        </h1>
        <p className="text-xs text-[#8a6b57]">
          توصيل سريع لجميع محافظات مصر • شحن مجاني للطلبات فوق 4,000 ج.م
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 sm:p-7 space-y-3.5 text-xs">
          <h2 className="text-base font-amiri font-bold text-[#5c3d2e] border-b border-[rgba(92,61,46,0.1)] pb-2 flex items-center gap-2">
            <Truck size={15} />
            <span>بيانات الشحن والتوصيل (حسب مناطق جمهورية مصر العربية)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#3d2a1f] font-medium mb-1 text-[11px]">
                الاسم الثلاثي *
              </label>
              <input
                type="text"
                required
                value={effectiveFullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="سارة العبدالله"
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e]"
              />
            </div>

            <div>
              <label className="block text-[#3d2a1f] font-medium mb-1 text-[11px]">
                رقم الموبايل *
              </label>
              <input
                type="tel"
                required
                value={effectivePhone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01000000000"
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#3d2a1f] font-medium mb-1 text-[11px]">
                المحافظة / المدينة (تُحدد سعر الشحن تلقائياً) *
              </label>
              <select
                value={effectiveCity}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] cursor-pointer"
              >
                {zoneOptions.map(({ zone, cities }) => (
                  <optgroup
                    key={zone.id}
                    label={`${zone.name} (${isFreeShipping ? 'شحن مجاني' : `${zone.shippingFee} ج.م`} • ${zone.estimatedDays})`}
                  >
                    {cities.map((cityOption) => (
                      <option key={`${zone.id}-${cityOption}`} value={cityOption}>
                        {cityOption} — {isFreeShipping ? 'شحن مجاني' : `${zone.shippingFee} ج.م`}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {selectedZone && (
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#5c3d2e] bg-[#f8f2e7] px-2.5 py-1 border border-[rgba(92,61,46,0.14)] rounded-xs">
                  <span className="font-semibold">{selectedZone.name}</span>
                  <span className="flex items-center gap-1 text-[#8a6b57]">
                    <Clock size={11} />
                    <span>التوصيل خلال {selectedZone.estimatedDays}</span>
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[#3d2a1f] font-medium mb-1 text-[11px]">
                العنوان بالتفصيل (الشارع والعمارة) *
              </label>
              <input
                type="text"
                required
                value={effectiveAddress}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="التجمع الخامس، شارع التسعين، عمارة 12"
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#3d2a1f] font-medium mb-1 text-[11px]">
              ملاحظات خاصة على المقاس أو ميعاد الاستلام (اختياري)
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="مثال: الاستلام بعد الساعة 4 عصراً، أو تعديل الطول إنش..."
              className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.22)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e]"
            />
          </div>

          <h2 className="text-base font-amiri font-bold text-[#5c3d2e] border-t border-[rgba(92,61,46,0.1)] pt-3 pb-1.5 flex items-center gap-2">
            <Banknote size={15} />
            <span>طريقة الدفع</span>
          </h2>

          <div>
            <div className="p-3 bg-[#f8f2e7] border border-[#5c3d2e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={true}
                  readOnly
                  className="accent-[#5c3d2e]"
                />
                <span className="text-xs font-semibold text-[#5c3d2e]">الدفع عند الاستلام (كاش)</span>
              </div>
              <span className="text-[10px] text-[#8a6b57]">متاح لكافة المحافظات</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 sm:p-6 text-xs">
          <h2 className="text-base font-amiri font-bold text-[#5c3d2e] border-b border-[rgba(92,61,46,0.1)] pb-2 mb-3">
            ملخص الطلبية ({cart.length} قطع)
          </h2>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pe-1 mb-3">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.08)]"
              >
                <div className="w-10 h-14 bg-[#fcfaf5] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[rgba(92,61,46,0.1)] rounded-xs">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <GarmentSketch variant={item.product.svgVariant} stroke="#5c3d2e" className="w-full h-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-amiri font-bold text-[#3d2a1f] block truncate text-xs">
                    {item.product.name}
                  </span>
                  <span className="text-[10px] text-[#8a6b57]">
                    المقاس: {item.size} · الكمية: {item.quantity}
                  </span>
                </div>
                <span className="font-semibold text-[#5c3d2e] text-xs">
                  {(item.product.price * item.quantity).toLocaleString('ar-SA')} ج.م
                </span>
              </div>
            ))}
          </div>

          {!isFreeShipping ? (
            <div className="mb-3 p-2.5 bg-[#f8f2e7] border border-[rgba(92,61,46,0.16)] rounded-xs text-[11px] text-[#5c3d2e]">
              متبقي <strong>{remainingForFree.toLocaleString('ar-SA')} ج.م</strong> للحصول على <strong>الشحن المجاني</strong> (للطلبات فوق ٤,٠٠٠ ج.م)
            </div>
          ) : (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xs text-[11px] text-emerald-800 font-semibold">
              🎉 طلبكِ تجاوز ٤,٠٠٠ ج.م — الشحن مجاني بالكامل!
            </div>
          )}

          <div className="space-y-1.5 border-t border-[rgba(92,61,46,0.1)] pt-2.5 text-[11px]">
            <div className="flex justify-between text-[#8a6b57]">
              <span>المجموع الفرعي للمنتجات:</span>
              <span>{cartTotal.toLocaleString('ar-SA')} ج.م</span>
            </div>
            <div className="flex justify-between text-[#8a6b57]">
              <span>
                تكلفة الشحن ({effectiveCity}{selectedZone ? ` • ${selectedZone.name}` : ''}):
              </span>
              <span className="font-semibold text-[#5c3d2e]">
                {isFreeShipping
                  ? 'مجاني (فوق ٤,٠٠٠ ج.م)'
                  : `${shippingFee.toLocaleString('ar-SA')} ج.م`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#3d2a1f] font-amiri border-t border-[rgba(92,61,46,0.1)] pt-2">
              <span>الإجمالي المستحق شامل الشحن:</span>
              <span className="text-base text-[#5c3d2e]">{finalTotal.toLocaleString('ar-SA')} ج.م</span>
            </div>
          </div>

          {orderError && (
            <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-800 text-[11px] rounded-xs text-center font-medium">
              {orderError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold uppercase tracking-wider hover:bg-[#3d2a1f] transition-colors flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-60 cursor-pointer"
          >
            <Lock size={13} />
            <span>{isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الفاخر'}</span>
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#8a6b57]">
            <ShieldCheck size={12} className="text-[#5c3d2e]" />
            <span>ضمان الأصالة والجودة العالية من دار جميلة</span>
          </div>
        </div>
      </form>
    </div>
  );
}
