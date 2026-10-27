'use client';

import React, { useState, useRef } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  X,
  Upload,
  Images,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Product } from '@/data/products';
import { CornerOrnament } from '@/components/svg/Ornaments';
import Link from 'next/link';

export default function AdminProductsPage() {
  const {
    productsList,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleBestSeller,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'الكل' | 'عبايات' | 'إسدالات'>('الكل');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [customSizeInput, setCustomSizeInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const STANDARD_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', 'Free Size'];

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'عبايات',
    price: 1850,
    tag: 'حرير فاخر',
    bestSeller: false,
    image: '/products/product-1.png',
    gallery: ['/products/product-1.png'],
    svgVariant: 'qamar',
    description: '',
    fabric: 'حرير طبيعي ١٠٠٪',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    features: ['قصة انسيابية راقية', 'مناسبة لكافة المناسبات'],
    stock: 10,
  });

  const filteredProducts = productsList.filter((p) => {
    const matchesSearch =
      p.name.includes(searchQuery) || p.fabric.includes(searchQuery) || p.tag.includes(searchQuery);
    const matchesCategory =
      selectedCategory === 'الكل' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'عبايات',
      price: 1850,
      tag: 'حرير كريب فاخر',
      bestSeller: false,
      image: '/products/product-1.png',
      gallery: ['/products/product-1.png'],
      svgVariant: 'qamar',
      description: 'تصميم ملكي راقٍ مستوحى من التراث العربي ومصنوع بحرفية عالية.',
      fabric: 'حرير طبيعي 100%',
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      features: ['قصة مريحة وفضفاضة', 'مرفق معها طرحة مجانية'],
      stock: 10,
    });
    setCustomSizeInput('');
    setUploadError('');
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    const gallery = Array.from(new Set([p.image, ...(p.gallery || [])].filter(Boolean)));
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      tag: p.tag,
      bestSeller: p.bestSeller,
      image: gallery[0] || '/products/product-1.png',
      gallery: gallery.length > 0 ? gallery : ['/products/product-1.png'],
      svgVariant: p.svgVariant,
      description: p.description,
      fabric: p.fabric,
      sizes: p.sizes?.length ? p.sizes : ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      features: p.features?.length ? p.features : ['قصة انسيابية راقية'],
      stock: typeof p.stock === 'number' && !Number.isNaN(p.stock) ? Math.max(0, p.stock) : 10,
    });
    setCustomSizeInput('');
    setUploadError('');
    setIsAddModalOpen(true);
  };

  const handleToggleSize = (size: string) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      if (exists) {
        if (prev.sizes.length <= 1) return prev;
        return { ...prev, sizes: prev.sizes.filter((s) => s !== size) };
      } else {
        return { ...prev, sizes: [...prev.sizes, size] };
      }
    });
  };

  const handleAddCustomSize = () => {
    const clean = customSizeInput.trim().toUpperCase();
    if (!clean) return;
    setFormData((prev) => ({
      ...prev,
      sizes: Array.from(new Set([...prev.sizes, clean])),
    }));
    setCustomSizeInput('');
  };

  // Upload multiple images via server-side /api/upload (never fall back to raw client FileReader Base64)
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    setIsUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fileArray.forEach((f) => fd.append('files', f));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        const uploadedUrls = data.urls as string[];
        setFormData((prev) => {
          const nextGallery = Array.from(new Set([...uploadedUrls, ...prev.gallery]));
          return {
            ...prev,
            image: uploadedUrls[0],
            gallery: nextGallery,
          };
        });
      } else {
        setUploadError(
          data.message ||
            'فشل رفع الصور إلى الخدمة السحابية. يرجى التحقق من صيغة وحجم الصورة أو إعدادات Cloudinary.'
        );
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setUploadError('حدث خطأ أثناء الاتصال بخادم رفع الصور.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleToggleStudioImage = (imgUrl: string) => {
    setFormData((prev) => {
      const exists = prev.gallery.includes(imgUrl);
      let nextGallery: string[];
      if (exists) {
        if (prev.gallery.length <= 1) return prev;
        nextGallery = prev.gallery.filter((i) => i !== imgUrl);
      } else {
        nextGallery = [...prev.gallery, imgUrl];
      }
      const nextPrimary = nextGallery.includes(prev.image) ? prev.image : nextGallery[0];
      const orderedGallery = [nextPrimary, ...nextGallery.filter((i) => i !== nextPrimary)];
      return {
        ...prev,
        image: nextPrimary,
        gallery: orderedGallery,
      };
    });
  };

  const handleSetPrimaryImage = (imgUrl: string) => {
    setFormData((prev) => {
      const orderedGallery = [imgUrl, ...prev.gallery.filter((i) => i !== imgUrl)];
      return {
        ...prev,
        image: imgUrl,
        gallery: orderedGallery,
      };
    });
  };

  const handleRemoveGalleryImage = (imgUrl: string) => {
    setFormData((prev) => {
      if (prev.gallery.length <= 1) return prev;
      const nextGallery = prev.gallery.filter((i) => i !== imgUrl);
      const nextPrimary = prev.image === imgUrl ? nextGallery[0] : prev.image;
      return {
        ...prev,
        image: nextPrimary,
        gallery: nextGallery,
      };
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGallery =
      formData.gallery.length > 0 ? formData.gallery : [formData.image || '/products/product-1.png'];
    const payload: Omit<Product, 'id'> = {
      ...formData,
      image: cleanGallery[0],
      gallery: cleanGallery,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
    } else {
      addProduct(payload);
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنتِ متأكدة من رغبتكِ في حذف المنتج "${name}"؟`)) {
      deleteProduct(id);
    }
  };

  const availableImages = [
    '/products/product-1.png',
    '/products/product-2.png',
    '/products/product-3.png',
  ];

  return (
    <div className="space-y-6 font-cairo">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-amiri font-bold text-[#3d2a1f] flex items-center gap-2">
            <Package size={22} className="text-[#5c3d2e]" />
            <span>إدارة المنتجات والأزياء</span>
          </h1>
          <p className="text-xs text-[#8a6b57]">
            عرض وإضافة وتعديل العباءات والإسدالات الفاخرة ورفع عدة صور لكل منتج
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#5c3d2e] hover:bg-[#3d2a1f] text-[#f8f2e7] text-xs font-semibold rounded-xs transition-colors shadow-2xs cursor-pointer"
        >
          <Plus size={16} />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={15}
            className="absolute top-1/2 -translate-y-1/2 start-3 text-[#8a6b57]"
          />
          <input
            type="text"
            placeholder="البحث باسم المنتج أو خامة القماش..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-3 py-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-xs text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['الكل', 'عبايات', 'إسدالات'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#5c3d2e] text-[#f8f2e7]'
                  : 'bg-[#f8f2e7] text-[#5c3d2e] border border-[rgba(92,61,46,0.2)] hover:bg-[#eadecc]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const prodGallery = Array.from(
            new Set([product.image, ...(product.gallery || [])].filter(Boolean))
          );
          return (
            <div
              key={product.id}
              className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-4 shadow-2xs flex flex-col justify-between group hover:border-[#5c3d2e] transition-all rounded-xs"
            >
              <div>
                <div className="relative aspect-[3/4] bg-[#f8f2e7] border border-[rgba(92,61,46,0.1)] overflow-hidden rounded-xs mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
                  />

                  <button
                    onClick={() => toggleBestSeller(product.id)}
                    title={product.bestSeller ? 'إلغاء تمييز الأكثر مبيعاً' : 'تعيين كأكثر مبيعاً'}
                    className={`absolute top-2 end-2 p-1.5 rounded-full backdrop-blur-xs transition-all cursor-pointer ${
                      product.bestSeller
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-black/30 text-white/80 hover:text-white'
                    }`}
                  >
                    <Star size={14} fill={product.bestSeller ? 'currentColor' : 'none'} />
                  </button>

                  <span className="absolute top-2 start-2 px-2 py-0.5 bg-[#5c3d2e] text-[#f8f2e7] text-[9px] font-semibold rounded-xs">
                    {product.category}
                  </span>

                  <span className="absolute bottom-2 end-2 px-2 py-0.5 bg-black/65 text-[#f8f2e7] text-[10px] font-semibold rounded-xs flex items-center gap-1">
                    <Images size={11} />
                    <span>{prodGallery.length} صور</span>
                  </span>

                  <span
                    className={`absolute bottom-2 start-2 px-2 py-0.5 text-[10px] font-bold rounded-xs shadow-2xs ${
                      (product.stock ?? 10) <= 0
                        ? 'bg-red-700 text-white'
                        : 'bg-[#fcfaf5]/95 text-[#5c3d2e] border border-[rgba(92,61,46,0.25)]'
                    }`}
                  >
                    {(product.stock ?? 10) <= 0
                      ? 'Sold Out (نفذت الكمية: 0)'
                      : `المخزون: ${product.stock ?? 10} قطع`}
                  </span>
                </div>

                {prodGallery.length > 1 && (
                  <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1">
                    {prodGallery.map((gImg, idx) => (
                      <img
                        key={idx}
                        src={gImg}
                        alt=""
                        className="w-8 h-10 object-cover object-top rounded-xs border border-[rgba(92,61,46,0.2)] shrink-0"
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="text-[10px] text-[#8a6b57] truncate">{product.tag}</div>
                  <h3 className="font-amiri font-bold text-base text-[#3d2a1f] line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#5c3d2e] font-cairo">
                      {product.price.toLocaleString('ar-SA')} ج.م
                    </div>
                    <div className="text-[10px] text-[#8a6b57] truncate max-w-[140px]">
                      المقاسات: {(product.sizes?.length ? product.sizes : ['S', 'M', 'L', 'XL']).join('، ')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[rgba(92,61,46,0.1)] flex items-center justify-between">
                <Link
                  href={`/product/${product.id}`}
                  target="_blank"
                  className="text-[11px] text-[#8a6b57] hover:text-[#5c3d2e] flex items-center gap-1"
                >
                  <ExternalLink size={12} />
                  <span>معاينة</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="p-1.5 bg-[#f8f2e7] hover:bg-[#eadecc] text-blue-700 border border-[rgba(92,61,46,0.15)] rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                    title="تعديل المنتج"
                  >
                    <Edit2 size={13} />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-1.5 bg-[#f8f2e7] hover:bg-red-50 text-red-600 border border-[rgba(92,61,46,0.15)] rounded-xs text-xs cursor-pointer"
                    title="حذف المنتج"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fcfaf5] border border-[rgba(92,61,46,0.25)] w-full max-w-2xl shadow-2xl relative my-8 animate-fade-in font-cairo rounded-xs">
            <CornerOrnament position="top-start" color="#5c3d2e" />
            <CornerOrnament position="top-end" color="#5c3d2e" />
            <CornerOrnament position="bottom-start" color="#5c3d2e" />
            <CornerOrnament position="bottom-end" color="#5c3d2e" />

            <div className="p-5 border-b border-[rgba(92,61,46,0.12)] flex items-center justify-between">
              <div>
                <h2 className="text-base font-amiri font-bold text-[#5c3d2e]">
                  {editingProduct ? 'تعديل بيانات وصور المنتج' : 'إضافة منتج جديد'}
                </h2>
                <p className="text-[11px] text-[#8a6b57]">
                  أدخلي تفاصيل القطعة وارفعي صورة أو عدة صور لنفس المنتج ليظهر للعميلات كألبوم متكامل
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#8a6b57] hover:text-[#3d2a1f] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 text-xs max-h-[78vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#3d2a1f] font-semibold mb-1">
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: عباية قمر الملكية"
                    className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#3d2a1f] font-semibold mb-1">
                    القسم *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Product['category'],
                      })
                    }
                    className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                  >
                    <option value="عبايات">عبايات</option>
                    <option value="إسدالات">إسدالات</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#3d2a1f] font-semibold mb-1">
                    السعر (ج.م) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#3d2a1f] font-semibold mb-1">
                    الكمية بالمخزون (Stock) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock ?? 10}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                  />
                  <span className="block text-[10px] text-[#8a6b57] mt-0.5">
                    مخفي عن العميل — عند الوصول لـ 0 يظهر Sold Out
                  </span>
                </div>

                <div>
                  <label className="block text-[#3d2a1f] font-semibold mb-1">
                    وصف مختصر / خامة القماش *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="مثال: حرير ياباني خام"
                    className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                  />
                </div>
              </div>

              <div className="bg-[#f8f2e7] border border-[rgba(92,61,46,0.18)] p-3.5 rounded-xs space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <label className="block text-[#3d2a1f] font-bold">
                      المقاسات المتاحة لهذا المنتج ({formData.sizes.length} مقاسات محددة) *
                    </label>
                    <p className="text-[10px] text-[#8a6b57]">
                      اضغطي على المقاسات لتفعيلها أو إلغائها — ستظهر المقاسات المحددة فقط للعميلة
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
                      }))
                    }
                    className="text-[10px] text-[#5c3d2e] underline hover:text-[#3d2a1f] cursor-pointer self-start sm:self-auto"
                  >
                    تحديد جميع المقاسات القياسية
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {Array.from(new Set([...STANDARD_SIZES, ...formData.sizes])).map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xs border transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#5c3d2e] text-[#f8f2e7] border-[#5c3d2e] shadow-2xs'
                            : 'bg-[#fcfaf5] text-[#8a6b57] border-[rgba(92,61,46,0.2)] hover:border-[#5c3d2e] hover:text-[#3d2a1f]'
                        }`}
                      >
                        <span>{size}</span>
                        {isSelected && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSize();
                      }
                    }}
                    placeholder="إضافة مقاس آخر (مثال: 4XL أو مقاس خاص)..."
                    className="flex-1 p-1.5 bg-[#fcfaf5] border border-[rgba(92,61,46,0.2)] text-xs text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-3 py-1.5 bg-[#5c3d2e] text-[#f8f2e7] text-[11px] font-semibold rounded-xs hover:bg-[#3d2a1f] cursor-pointer"
                  >
                    + إضافة مقاس
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#3d2a1f] font-semibold mb-1">
                  تفاصيل الخامة والتطريز *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fabric}
                  onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  placeholder="مثال: حرير ياباني خام 100% مع أورجانزا مبرومة"
                  className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[#3d2a1f] font-semibold mb-1">
                  الوصف الكامل للقطعة *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="اكتبي وصفاً جذاباً للعباية وتفاصيل التصميم والقصة..."
                  className="w-full p-2 bg-[#f8f2e7] border border-[rgba(92,61,46,0.2)] text-[#3d2a1f] focus:outline-none focus:border-[#5c3d2e] rounded-xs"
                />
              </div>

              {/* Multi-Image Upload & Gallery Management */}
              <div className="space-y-3 bg-[#f8f2e7] border border-[rgba(92,61,46,0.18)] p-3.5 rounded-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-[#3d2a1f] font-bold">
                      صور المنتج ({formData.gallery.length} صور مضافة حالياً) *
                    </label>
                    <p className="text-[10px] text-[#8a6b57]">
                      يمكنكِ رفع عدة صور دفعة واحدة من جهازكِ أو اختيار أكثر من صورة، وتحديد الصورة الرئيسية
                    </p>
                  </div>

                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleFilesSelected}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#5c3d2e] text-[#f8f2e7] text-[11px] font-semibold rounded-xs hover:bg-[#3d2a1f] transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <Upload size={14} />
                      <span>{isUploading ? 'جاري رفع الصور...' : 'رفع صور من جهازكِ (+)'}</span>
                    </button>
                  </div>
                </div>

                {uploadError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-[11px] rounded-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div>
                  <span className="block text-[11px] font-semibold text-[#5c3d2e] mb-1.5">
                    ألبوم صور هذا المنتج (تظهر كلها للعميلة في المتجر):
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {formData.gallery.map((imgUrl, idx) => {
                      const isPrimary = formData.image === imgUrl || idx === 0;
                      return (
                        <div
                          key={`${imgUrl}-${idx}`}
                          className={`relative aspect-[3/4] bg-[#fcfaf5] border rounded-xs overflow-hidden group ${
                            isPrimary
                              ? 'border-[#5c3d2e] ring-2 ring-[#5c3d2e]'
                              : 'border-[rgba(92,61,46,0.22)]'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`صورة ${idx + 1}`}
                            className="w-full h-full object-cover object-top"
                          />

                          {isPrimary ? (
                            <span className="absolute top-1.5 start-1.5 px-1.5 py-0.5 bg-[#5c3d2e] text-[#f8f2e7] text-[9px] font-bold rounded-xs flex items-center gap-0.5 shadow-2xs">
                              <CheckCircle2 size={10} />
                              <span>الرئيسية</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(imgUrl)}
                              className="absolute bottom-1.5 inset-x-1.5 py-1 bg-[#5c3d2e]/90 text-[#f8f2e7] text-[9px] font-semibold rounded-xs hover:bg-[#3d2a1f] cursor-pointer text-center"
                            >
                              تعيين كرئيسية
                            </button>
                          )}

                          {formData.gallery.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(imgUrl)}
                              title="حذف هذه الصورة من المنتج"
                              className="absolute top-1.5 end-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 cursor-pointer shadow-xs"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-[rgba(92,61,46,0.12)]">
                  <span className="block text-[10px] text-[#8a6b57] mb-1.5">
                    أو اضغطي لإضافة / إزالة صور من كتالوج دار جميلة الجاهز:
                  </span>
                  <div className="flex items-center gap-2">
                    {availableImages.map((img) => {
                      const inGallery = formData.gallery.includes(img);
                      return (
                        <button
                          key={img}
                          type="button"
                          onClick={() => handleToggleStudioImage(img)}
                          className={`relative w-14 h-18 border overflow-hidden rounded-xs cursor-pointer transition-all ${
                            inGallery
                              ? 'border-[#5c3d2e] ring-2 ring-[#5c3d2e]'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="choice" className="w-full h-full object-cover object-top" />
                          {inGallery && (
                            <span className="absolute top-0.5 end-0.5 w-4 h-4 bg-[#5c3d2e] text-[#f8f2e7] rounded-full flex items-center justify-center text-[9px]">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bestSellerCheck"
                  checked={formData.bestSeller}
                  onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                  className="w-4 h-4 text-[#5c3d2e] accent-[#5c3d2e] cursor-pointer"
                />
                <label htmlFor="bestSellerCheck" className="text-xs text-[#3d2a1f] font-semibold cursor-pointer">
                  تمييز هذه القطعة في قسم الأكثر مبيعاً (Best Seller)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(92,61,46,0.12)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#f8f2e7] text-[#5c3d2e] border border-[rgba(92,61,46,0.2)] text-xs font-semibold rounded-xs hover:bg-[#eadecc] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold rounded-xs hover:bg-[#3d2a1f] transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج للمتجر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
