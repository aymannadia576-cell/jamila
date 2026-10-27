'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  X,
} from 'lucide-react';
import { useAdmin, ShippingZone } from '@/context/AdminContext';
import { CornerOrnament } from '@/components/svg/Ornaments';

export default function AdminZonesPage() {
  const { zonesList, addZone, updateZone, deleteZone, toggleZoneStatus } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    governorates: '',
    shippingFee: 65,
    estimatedDays: '٢ - ٣ أيام',
    isActive: true,
  });

  // Filter zones
  const filteredZones = zonesList.filter((zone) => {
    return (
      zone.name.includes(searchQuery) ||
      zone.governorates.includes(searchQuery)
    );
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      governorates: '',
      shippingFee: 65,
      estimatedDays: '٢ - ٣ أيام',
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (zone: ShippingZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      governorates: zone.governorates,
      shippingFee: zone.shippingFee,
      estimatedDays: zone.estimatedDays,
      isActive: zone.isActive,
    });
  };

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingZone) {
      updateZone(editingZone.id, {
        name: formData.name,
        governorates: formData.governorates,
        shippingFee: Number(formData.shippingFee),
        estimatedDays: formData.estimatedDays,
        isActive: formData.isActive,
      });
      setEditingZone(null);
    } else {
      addZone({
        name: formData.name,
        governorates: formData.governorates,
        shippingFee: Number(formData.shippingFee),
        estimatedDays: formData.estimatedDays,
        isActive: formData.isActive,
      });
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف منطقة الشحن "${name}"؟`)) {
      deleteZone(id);
    }
  };

  return (
    <div className="space-y-5 font-cairo">
      {/* Top Header & Search */}
      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.12)] p-4 sm:p-5 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-amiri font-bold text-[#3d2a1f]">
            مناطق التوصيل والشحن (Zones)
          </h2>
          <p className="text-xs text-[#8a6b57]">
            تحديد تكلفة الشحن ومواعيد التوصيل لمحافظات مصر ({zonesList.length} مناطق)
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
              placeholder="بحث باسم المنطقة أو المحافظة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-8 pe-3 py-1.5 bg-[#f8f2e7] border border-[rgba(92,61,46,0.15)] text-xs text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#5c3d2e] hover:bg-[#3d2a1f] text-[#f8f2e7] text-xs font-semibold rounded-xs transition-colors shadow-2xs"
          >
            <Plus size={15} />
            <span>إضافة منطقة (Zone)</span>
          </button>
        </div>
      </div>

      {/* Zones Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredZones.map((zone) => (
          <div
            key={zone.id}
            className={`bg-[#fcfaf5] border p-5 shadow-2xs transition-all relative flex flex-col justify-between ${
              zone.isActive
                ? 'border-[rgba(92,61,46,0.2)] hover:border-[#5c3d2e]'
                : 'border-dashed border-gray-300 opacity-70 bg-gray-50'
            }`}
          >
            <div>
              {/* Header: Name and Status Toggle */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-amiri font-bold text-base text-[#3d2a1f] flex items-center gap-1.5">
                    <span>{zone.name}</span>
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-[#8a6b57] mt-0.5">
                    <Clock size={12} />
                    <span>مدة التوصيل: {zone.estimatedDays}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleZoneStatus(zone.id)}
                  className="flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  title={zone.isActive ? 'تعطيل المنطقة' : 'تفعيل المنطقة'}
                >
                  {zone.isActive ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xs text-[10px]">
                      مفعلة
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 border border-gray-300 rounded-xs text-[10px]">
                      معطلة
                    </span>
                  )}
                </button>
              </div>

              {/* Included Governorates */}
              <div className="p-2.5 bg-[#f8f2e7] border border-[rgba(92,61,46,0.1)] rounded-xs mb-4">
                <span className="text-[10px] font-semibold text-[#5c3d2e] block mb-1">
                  المحافظات والمدن المشمولة:
                </span>
                <p className="text-[11px] text-[#3d2a1f] leading-relaxed">
                  {zone.governorates}
                </p>
              </div>
            </div>

            {/* Footer: Price and Actions */}
            <div className="pt-3 border-t border-[rgba(92,61,46,0.1)] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8a6b57] block">سعر التوصيل:</span>
                <span className="font-bold text-[#5c3d2e] text-base font-amiri">
                  {zone.shippingFee} ج.م
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(zone)}
                  className="p-1.5 bg-[#f8f2e7] hover:bg-[#eadecc] text-blue-700 border border-[rgba(92,61,46,0.15)] rounded-xs text-xs flex items-center gap-1"
                  title="تعديل المنطقة"
                >
                  <Edit2 size={13} />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => handleDelete(zone.id, zone.name)}
                  className="p-1.5 bg-[#f8f2e7] hover:bg-red-50 text-red-600 border border-[rgba(92,61,46,0.15)] rounded-xs text-xs"
                  title="حذف المنطقة"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Zone Modal */}
      {(isAddModalOpen || editingZone) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.25)] w-full max-w-lg shadow-2xl relative my-8 animate-fade-in font-cairo">
            <CornerOrnament position="top-start" color="#5c3d2e" />
            <CornerOrnament position="top-end" color="#5c3d2e" />
            <CornerOrnament position="bottom-start" color="#5c3d2e" />
            <CornerOrnament position="bottom-end" color="#5c3d2e" />

            <div className="p-5 border-b border-[rgba(92,61,46,0.12)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-amiri font-bold text-[#5c3d2e]">
                  {editingZone ? 'تعديل منطقة الشحن (Zone)' : 'إضافة منطقة شحن جديدة (Zone)'}
                </h3>
                <p className="text-[11px] text-[#8a6b57]">
                  تحديد المحافظات المشمولة وتكلفة الشحن بالجنيه المصري
                </p>
              </div>

              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingZone(null);
                }}
                className="p-1 text-[#8a6b57] hover:text-[#3d2a1f]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="p-5 space-y-4 text-xs">
              {/* Zone Name */}
              <div>
                <label className="block text-[#3d2a1f] font-semibold mb-1">
                  اسم المنطقة / القطاع الجغرافي *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: القاهرة الكبرى والجيزة أو مدن القناة"
                  className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                />
              </div>

              {/* Governorates list */}
              <div>
                <label className="block text-[#3d2a1f] font-semibold mb-1">
                  المحافظات والمدن المشمولة بالتفصيل *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.governorates}
                  onChange={(e) => setFormData({ ...formData, governorates: e.target.value })}
                  placeholder="مثال: القاهرة، الجيزة، الشيخ زايد، 6 أكتوبر، التجمع، المعادي، مصر الجديدة..."
                  className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                />
              </div>

              {/* Price & Estimated Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#3d2a1f] font-semibold mb-1">
                    سعر الشحن والتوصيل (ج.م) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.shippingFee}
                    onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#3d2a1f] font-semibold mb-1">
                    مدة التوصيل المتوقعة *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.estimatedDays}
                    onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                    placeholder="مثال: ٢٤ - ٤٨ ساعة"
                    className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isZoneActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#5c3d2e] accent-[#5c3d2e] cursor-pointer"
                />
                <label
                  htmlFor="isZoneActive"
                  className="text-xs text-[#3d2a1f] font-semibold cursor-pointer"
                >
                  تفعيل المنطقة فوراً لاستقبال الطلبات
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(92,61,46,0.12)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingZone(null);
                  }}
                  className="px-4 py-2 bg-[#f8f2e7] text-[#5c3d2e] border border-[rgba(92,61,46,0.2)] text-xs font-semibold rounded-xs hover:bg-[#eadecc]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold rounded-xs hover:bg-[#3d2a1f] transition-colors shadow-2xs"
                >
                  {editingZone ? 'حفظ تعديلات المنطقة' : 'إضافة المنطقة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}