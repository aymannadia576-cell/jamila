'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  Users,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpLeft,
  Plus,
  Store,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminDashboardPage() {
  const { productsList, ordersList, customersList, zonesList } = useAdmin();

  const totalProducts = productsList.length;
  const pendingOrders = ordersList.filter((o) => o.status === 'pending').length;
  const totalCustomers = customersList.length;
  const activeZones = zonesList.filter((z) => z.isActive).length;

  const recentOrders = ordersList.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-xs bg-[#5c3d2e]/10 text-[#5c3d2e] font-semibold">
            <CheckCircle2 size={12} />
            تم التوصيل
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-xs bg-[#8a6b57]/15 text-[#5c3d2e] font-semibold">
            <Clock size={12} />
            قيد التجهيز
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-xs bg-[#3d2a1f]/10 text-[#3d2a1f] font-semibold">
            <TrendingUp size={12} />
            جاري الشحن
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-xs bg-red-100 text-red-700 font-semibold">
            <AlertCircle size={12} />
            ملغي
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-xs bg-amber-100 text-amber-800 font-semibold">
            <Clock size={12} />
            معلق
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-cairo">
      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-6 sm:p-8 rounded-xs shadow-2xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-800 tracking-wider">
                النظام متصل • دار جميلة للأزياء
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-amiri font-bold text-[#5c3d2e] mb-1">
              أهلاً بكِ في لوحة الإدارة الرئيسية
            </h1>
            <p className="text-xs sm:text-sm text-[#8a6b57] font-light">
              متابعة مقتنيات العباءات، الطلبات، العميلات، والشحن في كافة محافظات جمهورية مصر العربية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold hover:bg-[#3d2a1f] transition-colors rounded-xs shadow-2xs"
            >
              <Plus size={14} />
              <span>إضافة تصميم جديد</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#f8f2e7] text-[#5c3d2e] border border-[rgba(92,61,46,0.25)] text-xs font-semibold hover:bg-[#eadecc] transition-colors rounded-xs"
            >
              <Store size={14} />
              <span>معاينة المتجر الحي</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Link
          href="/admin/products"
          className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.14)] p-5 rounded-xs hover:border-[#5c3d2e] hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#8a6b57] font-medium">المنتجات المعروضة</span>
            <div className="w-8 h-8 rounded-full bg-[#5c3d2e]/10 text-[#5c3d2e] flex items-center justify-center group-hover:bg-[#5c3d2e] group-hover:text-[#f8f2e7] transition-colors">
              <Package size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-amiri text-[#3d2a1f] mb-1">
              {totalProducts} <span className="text-xs font-cairo font-normal text-[#8a6b57]">قطعة</span>
            </div>
            <div className="flex items-center text-[11px] text-[#5c3d2e] font-semibold gap-1">
              <span>إدارة وتعديل الكتالوج</span>
              <ArrowUpLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.14)] p-5 rounded-xs hover:border-[#5c3d2e] hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#8a6b57] font-medium">إجمالي الطلبات</span>
            <div className="w-8 h-8 rounded-full bg-[#5c3d2e]/10 text-[#5c3d2e] flex items-center justify-center group-hover:bg-[#5c3d2e] group-hover:text-[#f8f2e7] transition-colors">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-amiri text-[#3d2a1f] mb-1">
              {ordersList.length} <span className="text-xs font-cairo font-normal text-[#8a6b57]">طلب</span>
              {pendingOrders > 0 && (
                <span className="ms-2 text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-cairo">
                  {pendingOrders} قيد الانتظار
                </span>
              )}
            </div>
            <div className="flex items-center text-[11px] text-[#5c3d2e] font-semibold gap-1">
              <span>متابعة الشحن والتوصيل</span>
              <ArrowUpLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </Link>

        <Link
          href="/admin/customers"
          className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.14)] p-5 rounded-xs hover:border-[#5c3d2e] hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#8a6b57] font-medium">سجل العميلات</span>
            <div className="w-8 h-8 rounded-full bg-[#5c3d2e]/10 text-[#5c3d2e] flex items-center justify-center group-hover:bg-[#5c3d2e] group-hover:text-[#f8f2e7] transition-colors">
              <Users size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-amiri text-[#3d2a1f] mb-1">
              {totalCustomers} <span className="text-xs font-cairo font-normal text-[#8a6b57]">عميلة</span>
            </div>
            <div className="flex items-center text-[11px] text-[#5c3d2e] font-semibold gap-1">
              <span>عرض العميلات ومحافظاتهن</span>
              <ArrowUpLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </Link>

        <Link
          href="/admin/zones"
          className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.14)] p-5 rounded-xs hover:border-[#5c3d2e] hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#8a6b57] font-medium">مناطق التوصيل</span>
            <div className="w-8 h-8 rounded-full bg-[#5c3d2e]/10 text-[#5c3d2e] flex items-center justify-center group-hover:bg-[#5c3d2e] group-hover:text-[#f8f2e7] transition-colors">
              <MapPin size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-amiri text-[#3d2a1f] mb-1">
              {activeZones} <span className="text-xs font-cairo font-normal text-[#8a6b57]">مناطق مفعلة</span>
            </div>
            <div className="flex items-center text-[11px] text-[#5c3d2e] font-semibold gap-1">
              <span>تعديل الأسعار والمحافظات</span>
              <ArrowUpLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.15)] rounded-xs overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-[rgba(92,61,46,0.1)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#5c3d2e]" />
            <h2 className="font-amiri font-bold text-lg text-[#3d2a1f]">
              أحدث طلبات العميلات
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-[#5c3d2e] font-semibold hover:underline flex items-center gap-1"
          >
            <span>عرض كافة الطلبات ({ordersList.length})</span>
            <ArrowUpLeft size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs font-cairo">
            <thead className="bg-[#f8f2e7] border-b border-[rgba(92,61,46,0.1)] text-[#5c3d2e]">
              <tr>
                <th className="py-3 px-4 text-start font-semibold">رقم الطلب</th>
                <th className="py-3 px-4 text-start font-semibold">العميلة</th>
                <th className="py-3 px-4 text-start font-semibold">المحافظة</th>
                <th className="py-3 px-4 text-start font-semibold">القطع</th>
                <th className="py-3 px-4 text-start font-semibold">الإجمالي</th>
                <th className="py-3 px-4 text-start font-semibold">الحالة</th>
                <th className="py-3 px-4 text-start font-semibold">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(92,61,46,0.06)]">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#f8f2e7]/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-[#5c3d2e]">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#3d2a1f]">
                    {order.customerName}
                    <div className="text-[10px] text-[#8a6b57] font-mono">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#8a6b57]">
                    {order.city}
                  </td>
                  <td className="py-3 px-4 text-[#3d2a1f]">
                    {order.items.map((i) => `${i.name} (${i.size})`).join('، ')}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#5c3d2e]">
                    {order.total.toLocaleString('ar-SA')} ج.م
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#8a6b57]">
                    {order.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/products"
          className="p-4 bg-[#fcfaf5] border border-[rgba(92,61,46,0.12)] rounded-xs hover:border-[#5c3d2e] transition-colors flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#5c3d2e] text-[#f8f2e7] flex items-center justify-center shrink-0">
            <Package size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-[#3d2a1f] group-hover:text-[#5c3d2e] transition-colors">
              إدارة وتعديل المنتجات
            </div>
            <div className="text-[11px] text-[#8a6b57]">
              إضافة عبايات جديدة وتحديد المقاسات
            </div>
          </div>
        </Link>

        <Link
          href="/admin/zones"
          className="p-4 bg-[#fcfaf5] border border-[rgba(92,61,46,0.12)] rounded-xs hover:border-[#5c3d2e] transition-colors flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#5c3d2e] text-[#f8f2e7] flex items-center justify-center shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-[#3d2a1f] group-hover:text-[#5c3d2e] transition-colors">
              تحديد أسعار التوصيل
            </div>
            <div className="text-[11px] text-[#8a6b57]">
              القاهرة، الجيزة، الإسكندرية، والصعيد
            </div>
          </div>
        </Link>

        <Link
          href="/admin/security"
          className="p-4 bg-[#fcfaf5] border border-[rgba(92,61,46,0.12)] rounded-xs hover:border-[#5c3d2e] transition-colors flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#5c3d2e] text-[#f8f2e7] flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-[#3d2a1f] group-hover:text-[#5c3d2e] transition-colors">
              تغيير كلمة المرور
            </div>
            <div className="text-[11px] text-[#8a6b57]">
              تأمين حساب الإدارة وتعديل البيانات
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
