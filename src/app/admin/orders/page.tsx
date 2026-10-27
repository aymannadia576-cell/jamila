'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Trash2,
  X,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { useAdmin, Order } from '@/context/AdminContext';
import { CornerOrnament } from '@/components/svg/Ornaments';

export default function AdminOrdersPage() {
  const { ordersList, updateOrderStatus, deleteOrder } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = ordersList.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.includes(searchQuery) ||
      order.customerPhone.includes(searchQuery) ||
      order.city.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-xs text-[10px] font-semibold flex items-center gap-1">
            <Clock size={11} />
            <span>بانتظار التأكيد</span>
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-xs text-[10px] font-semibold flex items-center gap-1">
            <Clock size={11} />
            <span>قيد التجهيز والتفصيل</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-xs text-[10px] font-semibold flex items-center gap-1">
            <Truck size={11} />
            <span>تم الشحن مع المندوب</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xs text-[10px] font-semibold flex items-center gap-1">
            <CheckCircle2 size={11} />
            <span>تم التوصيل بنجاح</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-800 border border-red-300 rounded-xs text-[10px] font-semibold flex items-center gap-1">
            <XCircle size={11} />
            <span>طلب ملغي</span>
          </span>
        );
    }
  };

  const getPaymentBadge = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'cod':
        return (
          <span className="text-[11px] text-[#5c3d2e] flex items-center gap-1">
            <Banknote size={12} />
            <span>الدفع عند الاستلام</span>
          </span>
        );
      case 'visa':
        return (
          <span className="text-[11px] text-blue-700 flex items-center gap-1">
            <CreditCard size={12} />
            <span>بطاقة بنكية (فيزا / ماستركارد)</span>
          </span>
        );
      case 'instapay':
        return (
          <span className="text-[11px] text-purple-700 flex items-center gap-1">
            <CreditCard size={12} />
            <span>تحويل إنستاباي (InstaPay)</span>
          </span>
        );
    }
  };

  const statusTabs: Array<{ id: 'all' | Order['status']; label: string }> = [
    { id: 'all', label: 'الكل' },
    { id: 'pending', label: 'بانتظار التأكيد' },
    { id: 'processing', label: 'قيد التجهيز' },
    { id: 'shipped', label: 'تم الشحن' },
    { id: 'delivered', label: 'تم التوصيل' },
    { id: 'cancelled', label: 'ملغي' },
  ];

  return (
    <div className="space-y-6 font-cairo">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-amiri font-bold text-[#3d2a1f] flex items-center gap-2">
            <ShoppingBag size={22} className="text-[#5c3d2e]" />
            <span>إدارة طلبات العميلات</span>
          </h1>
          <p className="text-xs text-[#8a6b57]">
            متابعة وتحديث حالات طلبات الشحن والتسليم لكافة محافظات مصر
          </p>
        </div>

        <div className="text-xs font-semibold text-[#5c3d2e] bg-[#f8f2e7] px-3 py-1.5 border border-[rgba(92,61,46,0.18)] rounded-xs">
          إجمالي الطلبات: {ordersList.length} طلب
        </div>
      </div>

      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={15}
            className="absolute top-1/2 -translate-y-1/2 start-3 text-[#8a6b57]"
          />
          <input
            type="text"
            placeholder="البحث برقم الطلب، اسم العميلة، أو رقم الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-3 py-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-xs text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {statusTabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === item.id
                  ? 'bg-[#5c3d2e] text-[#f8f2e7]'
                  : 'bg-[#f8f2e7] text-[#5c3d2e] border border-[rgba(92,61,46,0.2)] hover:bg-[#eadecc]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] shadow-2xs overflow-x-auto rounded-xs">
        <table className="w-full text-start text-xs">
          <thead className="bg-[#f8f2e7] border-b border-[rgba(92,61,46,0.14)] text-[#5c3d2e]">
            <tr>
              <th className="p-3.5 text-start font-semibold">رقم الطلب</th>
              <th className="p-3.5 text-start font-semibold">العميلة</th>
              <th className="p-3.5 text-start font-semibold">المحافظة / العنوان</th>
              <th className="p-3.5 text-start font-semibold">القطع المطلوبة</th>
              <th className="p-3.5 text-start font-semibold">الإجمالي</th>
              <th className="p-3.5 text-start font-semibold">حالة الطلب</th>
              <th className="p-3.5 text-center font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(92,61,46,0.08)]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#8a6b57]">
                  لا توجد طلبات مطابقة للبحث
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#f8f2e7]/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#5c3d2e]">
                    {order.id}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-[#3d2a1f]">{order.customerName}</div>
                    <div className="text-[11px] text-[#8a6b57] font-mono">{order.customerPhone}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-[#3d2a1f] font-medium">{order.city}</div>
                    <div className="text-[11px] text-[#8a6b57] truncate max-w-[200px]">
                      {order.address}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-[#f8f2e7] border border-[rgba(92,61,46,0.15)] rounded-xs font-semibold">
                      {order.items.length} قطعة
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-[#5c3d2e] font-amiri text-sm">
                    {order.total.toLocaleString('ar-SA')} ج.م
                  </td>
                  <td className="p-3.5">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as Order['status'])
                      }
                      className="text-xs p-1.5 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] rounded-xs font-semibold text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] cursor-pointer"
                    >
                      <option value="pending">بانتظار التأكيد</option>
                      <option value="processing">قيد التجهيز</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التوصيل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 bg-[#f8f2e7] hover:bg-[#eadecc] text-[#5c3d2e] border border-[rgba(92,61,46,0.15)] rounded-xs transition-colors cursor-pointer"
                        title="عرض تفاصيل الطلب"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنتِ متأكدة من حذف الطلب ${order.id}؟`)) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-1.5 bg-[#f8f2e7] hover:bg-red-50 text-red-600 border border-[rgba(92,61,46,0.15)] rounded-xs transition-colors cursor-pointer"
                        title="حذف الطلب"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.25)] w-full max-w-xl shadow-2xl relative my-8 animate-fade-in font-cairo rounded-xs">
            <CornerOrnament position="top-start" color="#5c3d2e" />
            <CornerOrnament position="top-end" color="#5c3d2e" />
            <CornerOrnament position="bottom-start" color="#5c3d2e" />
            <CornerOrnament position="bottom-end" color="#5c3d2e" />

            <div className="p-5 border-b border-[rgba(92,61,46,0.12)] flex items-center justify-between">
              <div>
                <h2 className="text-base font-amiri font-bold text-[#5c3d2e]">
                  تفاصيل الطلب: {selectedOrder.id}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#8a6b57] hover:text-[#3d2a1f] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="bg-[#f8f2e7] border border-[rgba(92,61,46,0.12)] p-3.5 space-y-2 rounded-xs">
                <div className="font-semibold text-[#5c3d2e] border-b border-[rgba(92,61,46,0.1)] pb-1.5">
                  بيانات العميلة والتوصيل:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#3d2a1f]">
                  <div>
                    <span className="text-[#8a6b57]">الاسم:</span> {selectedOrder.customerName}
                  </div>
                  <div>
                    <span className="text-[#8a6b57]">رقم الهاتف:</span> {selectedOrder.customerPhone}
                  </div>
                  <div>
                    <span className="text-[#8a6b57]">المحافظة:</span> {selectedOrder.city}
                  </div>
                  <div>
                    <span className="text-[#8a6b57]">طريقة الدفع:</span> {getPaymentBadge(selectedOrder.paymentMethod)}
                  </div>
                </div>
                <div>
                  <span className="text-[#8a6b57]">العنوان بالتفصيل:</span> {selectedOrder.address}
                </div>
                {selectedOrder.notes && (
                  <div className="pt-1 text-[#8a6b57] italic">
                    ملاحظات: {selectedOrder.notes}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-[#5c3d2e]">القطع المطلوبة:</div>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#f8f2e7] border border-[rgba(92,61,46,0.1)] flex items-center justify-between gap-3 rounded-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-16 object-cover object-top rounded-xs border border-[rgba(92,61,46,0.15)]"
                        />
                        <div>
                          <div className="font-amiri font-bold text-sm text-[#3d2a1f]">{item.name}</div>
                          <div className="text-[11px] text-[#8a6b57]">
                            المقاس: <span className="font-semibold text-[#5c3d2e]">{item.size}</span> · الكمية: <span className="font-semibold text-[#5c3d2e]">{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-[#5c3d2e] font-amiri text-sm">
                        {(item.price * item.quantity).toLocaleString('ar-SA')} ج.م
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(92,61,46,0.12)] flex items-center justify-between">
                <span className="font-semibold text-[#3d2a1f]">إجمالي الطلب النهائي:</span>
                <span className="text-lg font-amiri font-bold text-[#5c3d2e]">
                  {selectedOrder.total.toLocaleString('ar-SA')} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
