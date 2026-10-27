'use client';

import React, { useState } from 'react';
import {
  Truck,
  CreditCard,
  Bell,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { CornerOrnament } from '@/components/svg/Ornaments';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdmin();

  const [formState, setFormState] = useState({ ...settings });
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 font-cairo max-w-4xl">
      {/* Top Header */}
      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-amiri font-bold text-[#3d2a1f]">
            إعدادات متجر دار جميلة
          </h2>
          <p className="text-xs text-[#8a6b57]">
            تخصيص سياسة الشحن في مصر، نص الإعلان العلوي، وبوابات الدفع
          </p>
        </div>

        {showSavedToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-xs animate-fade-in">
            <CheckCircle2 size={14} className="text-emerald-700" />
            <span>تم حفظ التعديلات بنجاح!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Shipping & Delivery Settings */}
        <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 shadow-2xs space-y-4 relative">
          <CornerOrnament position="top-start" color="#5c3d2e" />
          <CornerOrnament position="top-end" color="#5c3d2e" />

          <h3 className="text-base font-amiri font-bold text-[#5c3d2e] border-b border-[rgba(92,61,46,0.1)] pb-2 flex items-center gap-2">
            <Truck size={16} />
            <span>سياسة الشحن والتوصيل داخل جمهورية مصر العربية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1">
                حد الشحن المجاني (بالجنيه المصري)
              </label>
              <input
                type="number"
                min={0}
                value={formState.freeShippingThreshold}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    freeShippingThreshold: Number(e.target.value),
                  })
                }
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
              />
              <span className="text-[10px] text-[#8a6b57] mt-0.5 block">
                الطلبات التي تتجاوز هذا المبلغ تحصل على توصيل مجاني تلقائياً
              </span>
            </div>

            <div>
              <label className="block text-[#3d2a1f] font-semibold mb-1">
                تكلفة الشحن الافتراضية (بالجنيه المصري)
              </label>
              <input
                type="number"
                min={0}
                value={formState.standardDeliveryFee}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    standardDeliveryFee: Number(e.target.value),
                  })
                }
                className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
              />
              <span className="text-[10px] text-[#8a6b57] mt-0.5 block">
                تطبق على الطلبات الأقل من حد الشحن المجاني
              </span>
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 shadow-2xs space-y-4">
          <h3 className="text-base font-amiri font-bold text-[#5c3d2e] border-b border-[rgba(92,61,46,0.1)] pb-2 flex items-center gap-2">
            <Bell size={16} />
            <span>نص الشريط الإعلاني العلوي في المتجر</span>
          </h3>

          <div>
            <label className="block text-[#3d2a1f] font-semibold mb-1">
              رسالة الشريط الترويجي (الظاهرة في أعلى واجهة المتجر)
            </label>
            <input
              type="text"
              value={formState.announcementText}
              onChange={(e) =>
                setFormState({ ...formState, announcementText: e.target.value })
              }
              className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
            />
          </div>
        </div>

        {/* Payment Gateways in Egypt */}
        <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 shadow-2xs space-y-4">
          <h3 className="text-base font-amiri font-bold text-[#5c3d2e] border-b border-[rgba(92,61,46,0.1)] pb-2 flex items-center gap-2">
            <CreditCard size={16} />
            <span>طرق الدفع المتاحة للعميلات في مصر</span>
          </h3>

          <div className="space-y-2.5">
            <label className="flex items-center gap-2.5 p-3 bg-[#f8f2e7] border border-[rgba(92,61,46,0.12)] rounded-xs cursor-pointer hover:bg-[#eadecc]/40 transition-colors">
              <input
                type="checkbox"
                checked={formState.isCodEnabled}
                onChange={(e) =>
                  setFormState({ ...formState, isCodEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-[#5c3d2e]"
              />
              <div>
                <span className="font-semibold text-[#3d2a1f] block">
                  الدفع نقداً عند الاستلام (COD)
                </span>
                <span className="text-[10px] text-[#8a6b57]">
                  السماح للعميلة بالدفع لمندوب التوصيل بعد معاينة القطعة
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 bg-[#f8f2e7] border border-[rgba(92,61,46,0.12)] rounded-xs cursor-pointer hover:bg-[#eadecc]/40 transition-colors">
              <input
                type="checkbox"
                checked={formState.isInstaPayEnabled}
                onChange={(e) =>
                  setFormState({ ...formState, isInstaPayEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-[#5c3d2e]"
              />
              <div>
                <span className="font-semibold text-[#3d2a1f] block">
                  التحويل الفوري عبر InstaPay والمحافظ الإلكترونية (فودافون كاش)
                </span>
                <span className="text-[10px] text-[#8a6b57]">
                  إتاحة التحويل المباشر مع تأكيد فوري للطلب
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 bg-[#f8f2e7] border border-[rgba(92,61,46,0.12)] rounded-xs cursor-pointer hover:bg-[#eadecc]/40 transition-colors">
              <input
                type="checkbox"
                checked={formState.isCardEnabled}
                onChange={(e) =>
                  setFormState({ ...formState, isCardEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-[#5c3d2e]"
              />
              <div>
                <span className="font-semibold text-[#3d2a1f] block">
                  البطاقات البنكية (Visa & Mastercard)
                </span>
                <span className="text-[10px] text-[#8a6b57]">
                  الدفع الإلكتروني الآمن المباشر
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#5c3d2e] hover:bg-[#3d2a1f] text-[#f8f2e7] text-xs font-semibold rounded-xs transition-colors shadow-2xs"
          >
            <Save size={15} />
            <span>حفظ إعدادات المتجر</span>
          </button>
        </div>
      </form>
    </div>
  );
}
