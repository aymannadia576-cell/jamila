'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Crown,
  MapPin,
  ShoppingBag,
  MessageCircle,
  X,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { CornerOrnament } from '@/components/svg/Ornaments';

export default function AdminCustomersPage() {
  const { customersList, addCustomer } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'القاهرة',
  });

  // Filter customers
  const filteredCustomers = customersList.filter((cust) => {
    return (
      cust.name.includes(searchQuery) ||
      cust.phone.includes(searchQuery) ||
      cust.city.includes(searchQuery) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || 'customer@jamila.com',
      city: formData.city,
      totalOrders: 1,
      totalSpent: 1850,
    });
    setIsAddModalOpen(false);
    setFormData({ name: '', phone: '', email: '', city: 'القاهرة' });
  };

  return (
    <div className="space-y-5 font-cairo">
      {/* Top Header & Search in one calm bar */}
      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.12)] p-4 sm:p-5 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-amiri font-bold text-[#3d2a1f]">
            دليل العميلات
          </h2>
          <p className="text-xs text-[#8a6b57]">
            قائمة العميلات المسجلات في محافظات مصر ({customersList.length} عميلة)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className="absolute top-1/2 -translate-y-1/2 start-3 text-[#8a6b57]"
            />
            <input
              type="text"
              placeholder="بحث باسم العميلة أو الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-8 pe-3 py-1.5 bg-[#f8f2e7] border border-[rgba(92,61,46,0.15)] text-xs text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#5c3d2e] hover:bg-[#3d2a1f] text-[#f8f2e7] text-xs font-semibold rounded-xs transition-colors shadow-2xs"
          >
            <Plus size={15} />
            <span>إضافة عميلة</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#f8f2e7] border-b border-[rgba(92,61,46,0.12)] text-[#8a6b57] font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4 text-start">العميلة</th>
                <th className="py-3 px-4 text-start">بيانات التواصل</th>
                <th className="py-3 px-4 text-start">المحافظة / المدينة</th>
                <th className="py-3 px-4 text-center">الطلبات</th>
                <th className="py-3 px-4 text-start">إجمالي الإنفاق</th>
                <th className="py-3 px-4 text-start">تصنيف العضوية</th>
                <th className="py-3 px-4 text-center">تواصل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(92,61,46,0.08)]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#8a6b57]">
                    لم يتم العثور على أي عميلة مطابقة.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const isVip = customer.totalSpent >= 5000;
                  return (
                    <tr key={customer.id} className="hover:bg-[#f8f2e7]/40 transition-colors">
                      {/* Name with Initials */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#5c3d2e] text-[#f8f2e7] font-bold font-amiri flex items-center justify-center text-xs flex-shrink-0">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-[#3d2a1f]">
                              {customer.name}
                            </div>
                            <div className="text-[10px] text-[#8a6b57]">
                              انضمت: {customer.joinedDate}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-[#3d2a1f]">{customer.phone}</div>
                        <div className="text-[10px] text-[#8a6b57]">{customer.email}</div>
                      </td>

                      {/* City */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-[#5c3d2e] font-semibold text-[11px]">
                          <MapPin size={11} className="text-[#8a6b57]" />
                          <span>{customer.city}</span>
                        </div>
                      </td>

                      {/* Total Orders */}
                      <td className="py-3 px-4 text-center font-bold text-[#3d2a1f]">
                        {customer.totalOrders}
                      </td>

                      {/* Total Spent in EGP */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#5c3d2e] text-xs">
                          {customer.totalSpent.toLocaleString('ar-SA')} ج.م
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3 px-4">
                        {isVip ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-xs text-[10px] font-bold">
                            <Crown size={11} className="text-amber-800" />
                            <span>ملكية VIP</span>
                          </span>
                        ) : customer.totalOrders > 1 ? (
                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-xs text-[10px] font-medium">
                            عميلة مميزة
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 bg-[#f8f2e7] text-[#8a6b57] border border-[rgba(92,61,46,0.12)] rounded-xs text-[10px]">
                            عميلة جديدة
                          </span>
                        )}
                      </td>

                      {/* Direct WhatsApp */}
                      <td className="py-3 px-4 text-center">
                        <a
                          href={`https://wa.me/2${customer.phone.replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xs transition-colors"
                          title="محادثة واتساب مباشرة"
                        >
                          <MessageCircle size={14} />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.25)] w-full max-w-md shadow-2xl relative animate-fade-in font-cairo">
            <CornerOrnament position="top-start" color="#5c3d2e" />
            <CornerOrnament position="top-end" color="#5c3d2e" />
            <CornerOrnament position="bottom-start" color="#5c3d2e" />
            <CornerOrnament position="bottom-end" color="#5c3d2e" />

            <div className="p-5 border-b border-[rgba(92,61,46,0.12)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-amiri font-bold text-[#5c3d2e]">
                  إضافة عميلة جديدة
                </h3>
                <p className="text-[11px] text-[#8a6b57]">
                  تسجيل بيانات عميلة جديدة في قاعدة بيانات دار جميلة
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#8a6b57] hover:text-[#3d2a1f]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#3d2a1f] font-medium mb-1">
                  الاسم بالكامل *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: ياسمين المنشاوي"
                  className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[#3d2a1f] font-medium mb-1">
                  رقم الموبايل *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01012345678"
                  className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[#3d2a1f] font-medium mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="yasmin@example.com"
                  className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[#3d2a1f] font-medium mb-1">
                  المحافظة / المدينة
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs cursor-pointer"
                >
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة والشيخ زايد">الجيزة والشيخ زايد</option>
                  <option value="الإسكندرية والساحل">الإسكندرية والساحل</option>
                  <option value="المنصورة والدقهلية">المنصورة والدقهلية</option>
                  <option value="طنطا والغربية">طنطا والغربية</option>
                  <option value="أسيوط ومحافظات الصعيد">أسيوط ومحافظات الصعيد</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(92,61,46,0.12)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#f8f2e7] text-[#5c3d2e] border border-[rgba(92,61,46,0.2)] text-xs font-semibold rounded-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold rounded-xs hover:bg-[#3d2a1f] transition-colors shadow-2xs"
                >
                  حفظ العميلة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
