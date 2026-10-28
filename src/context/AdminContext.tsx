'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/data/products';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  paymentMethod: 'cod' | 'visa' | 'instapay';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  createdAt: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  governorates: string;
  shippingFee: number;
  estimatedDays: string;
  isActive: boolean;
}

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
}

export interface StoreSettings {
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  announcementText: string;
  isCodEnabled: boolean;
  isInstaPayEnabled: boolean;
  isCardEnabled: boolean;
}

interface AdminContextType {
  productsList: Product[];
  ordersList: Order[];
  customersList: Customer[];
  zonesList: ShippingZone[];
  adminProfile: AdminProfile;
  settings: StoreSettings;
  isLoadingData: boolean;
  addProduct: (
    newProduct: Omit<Product, 'id'>
  ) => Promise<{ success: boolean; message?: string; product?: Product }>;
  updateProduct: (
    id: string,
    updated: Partial<Product>
  ) => Promise<{ success: boolean; message?: string; product?: Product }>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleBestSeller: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  addCustomer: (cust: Omit<Customer, 'id' | 'joinedDate'>) => Promise<void>;
  addZone: (zone: Omit<ShippingZone, 'id'>) => Promise<void>;
  updateZone: (id: string, updated: Partial<ShippingZone>) => Promise<void>;
  deleteZone: (id: string) => Promise<void>;
  toggleZoneStatus: (id: string) => Promise<void>;
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const initialOrders: Order[] = [
  {
    id: 'JM-EG-804912',
    customerName: 'الأميرة فريدة المنصور',
    customerPhone: '01012345678',
    city: 'القاهرة (التجمع الخامس)',
    address: 'شارع التسعين الشمالي، فيلا ٤٢، القاهرة الجديدة',
    paymentMethod: 'visa',
    status: 'delivered',
    items: [
      {
        productId: 'jm-01',
        name: 'عباية الدانتيل الملكية السوداء',
        image: '/products/product-1.png',
        size: 'M',
        price: 2450,
        quantity: 1,
      },
      {
        productId: 'jm-02',
        name: 'عباية الهدى العاجية بالدانتيل المنسدل',
        image: '/products/product-2.png',
        size: 'L',
        price: 2750,
        quantity: 1,
      },
    ],
    total: 5200,
    createdAt: '٢٠٢٦/٠٤/٠٨ - ٠٨:٣٠ م',
    notes: 'يرجى تغليف الطلب كهدية فاخرة مع بطاقة إهداء.',
  },
  {
    id: 'JM-EG-805104',
    customerName: 'نهى الشاذلي',
    customerPhone: '01298765432',
    city: 'الإسكندرية (سموحة)',
    address: 'ميدان فيكتور عمانويل، برج النخيل، الطابق الخامس',
    paymentMethod: 'instapay',
    status: 'processing',
    items: [
      {
        productId: 'jm-03',
        name: 'عباية السهرة الراقية بالدانتيل الفاخر',
        image: '/products/product-3.png',
        size: 'M',
        price: 2600,
        quantity: 1,
      },
    ],
    total: 2600,
    createdAt: '٢٠٢٦/٠٤/٠٩ - ٠١:١٥ م',
  },
  {
    id: 'JM-EG-805390',
    customerName: 'سلمى الكيلاني',
    customerPhone: '01122334455',
    city: 'الجيزة (الشيخ زايد)',
    address: 'كمبوند بيفرلي هيلز، المرحلة الثانية',
    paymentMethod: 'cod',
    status: 'pending',
    items: [
      {
        productId: 'jm-05',
        name: 'سدال الصفاء العاجي بالدانتيل',
        image: '/products/product-2.png',
        size: 'XL',
        price: 1750,
        quantity: 2,
      },
    ],
    total: 3500,
    createdAt: '٢٠٢٦/٠٤/١٠ - ١٠:٠٥ ص',
  },
];

const initialCustomers: Customer[] = [
  {
    id: 'cust-01',
    name: 'الأميرة فريدة المنصور',
    phone: '01012345678',
    email: 'farida.mansour@example.com',
    city: 'القاهرة',
    totalOrders: 5,
    totalSpent: 14800,
    joinedDate: 'يناير ٢٠٢٦',
  },
  {
    id: 'cust-02',
    name: 'نهى الشاذلي',
    phone: '01298765432',
    email: 'noha.shazly@example.com',
    city: 'الإسكندرية',
    totalOrders: 3,
    totalSpent: 7450,
    joinedDate: 'فبراير ٢٠٢٦',
  },
  {
    id: 'cust-03',
    name: 'سلمى الكيلاني',
    phone: '01122334455',
    email: 'salma.kilany@example.com',
    city: 'الجيزة',
    totalOrders: 2,
    totalSpent: 5200,
    joinedDate: 'مارس ٢٠٢٦',
  },
  {
    id: 'cust-04',
    name: 'د. مريم عبد الرحمن',
    phone: '01066778899',
    email: 'mariam.dr@example.com',
    city: 'المنصورة',
    totalOrders: 4,
    totalSpent: 9800,
    joinedDate: 'مارس ٢٠٢٦',
  },
];

const initialZones: ShippingZone[] = [
  {
    id: 'zone-01',
    name: 'القاهرة الكبرى والجيزة',
    governorates: 'القاهرة، الجيزة، التجمع، الشيخ زايد، 6 أكتوبر، المعادي، مصر الجديدة',
    shippingFee: 50,
    estimatedDays: '٢٤ - ٤٨ ساعة',
    isActive: true,
  },
  {
    id: 'zone-02',
    name: 'الإسكندرية والساحل الشمالي',
    governorates: 'الإسكندرية، برج العرب، الساحل الشمالي، العلمين',
    shippingFee: 65,
    estimatedDays: '٢ - ٣ أيام',
    isActive: true,
  },
  {
    id: 'zone-03',
    name: 'محافظات الدلتا والوجه البحري',
    governorates: 'الدقهلية (المنصورة)، الغربية (طنطا)، المنوفية، القليوبية، الشرقية، البحيرة، كفر الشيخ، دمياط',
    shippingFee: 75,
    estimatedDays: '٢ - ٤ أيام',
    isActive: true,
  },
  {
    id: 'zone-04',
    name: 'مدن القناة وسيناء',
    governorates: 'بورسعيد، الإسماعيلية، السويس، جنوب سيناء (شرم الشيخ)',
    shippingFee: 85,
    estimatedDays: '٣ - ٤ أيام',
    isActive: true,
  },
  {
    id: 'zone-05',
    name: 'محافظات الصعيد والوجه القبلي',
    governorates: 'الفيوم، بني سويف، المنيا، أسيوط، سوهاج، قنا، الأقصر، أسوان',
    shippingFee: 95,
    estimatedDays: '٣ - ٥ أيام',
    isActive: true,
  },
  {
    id: 'zone-06',
    name: 'محافظات البحر الأحمر والمناطق النائية',
    governorates: 'الغردقة، الجونة، سفاجا، مرسى علم، الوادي الجديد، مطروح',
    shippingFee: 120,
    estimatedDays: '٤ - ٦ أيام',
    isActive: true,
  },
];

const initialSettings: StoreSettings = {
  freeShippingThreshold: 4000,
  standardDeliveryFee: 65,
  announcementText: 'توصيل سريع لكافة محافظات مصر | شحن مجاني للطلبات فوق ٤,٠٠٠ ج.م',
  isCodEnabled: true,
  isInstaPayEnabled: true,
  isCardEnabled: true,
};

interface RawOrderRecord {
  id?: string;
  _id?: string;
  customerName?: string;
  customerPhone?: string;
  city?: string;
  address?: string;
  paymentMethod?: Order['paymentMethod'];
  status?: Order['status'];
  items?: OrderItem[];
  total?: number;
  createdAt?: string;
  notes?: string;
}

interface RawCustomerRecord {
  _id?: string;
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>(initialOrders);
  const [customersList, setCustomersList] = useState<Customer[]>(initialCustomers);
  const [zonesList, setZonesList] = useState<ShippingZone[]>(initialZones);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'مديرة دار جميلة',
    email: 'admin@jamila.com',
    phone: '01012345678',
  });
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  const refreshData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [prodRes, ordRes, custRes, zoneRes, setRes] = await Promise.allSettled([
        fetch('/api/products', { cache: 'no-store' }),
        fetch('/api/orders', { cache: 'no-store' }),
        fetch('/api/customers', { cache: 'no-store' }),
        fetch('/api/zones', { cache: 'no-store' }),
        fetch('/api/settings', { cache: 'no-store' }),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
        const prodData = await prodRes.value.json();
        if (prodData.success && Array.isArray(prodData.products)) {
          setProductsList(prodData.products as Product[]);
        }
      }

      if (ordRes.status === 'fulfilled' && ordRes.value.ok) {
        const ordData = await ordRes.value.json();
        if (ordData.success && Array.isArray(ordData.orders)) {
          setOrdersList(
            (ordData.orders as RawOrderRecord[]).map((o) => ({
              id: o.id || o._id || '',
              customerName: o.customerName || '',
              customerPhone: o.customerPhone || '',
              city: o.city || '',
              address: o.address || '',
              paymentMethod: o.paymentMethod || 'cod',
              status: o.status || 'pending',
              items: o.items || [],
              total: Number(o.total) || 0,
              createdAt: o.createdAt
                ? new Date(o.createdAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'الآن',
              notes: o.notes,
            }))
          );
        }
      }

      if (custRes.status === 'fulfilled' && custRes.value.ok) {
        const custData = await custRes.value.json();
        if (custData.success && Array.isArray(custData.customers)) {
          setCustomersList(
            (custData.customers as RawCustomerRecord[]).map((c) => ({
              id: c._id || c.id || '',
              name: c.name || '',
              phone: c.phone || '01000000000',
              email: c.email || '',
              city: c.city || 'القاهرة',
              totalOrders: c.totalOrders || 0,
              totalSpent: c.totalSpent || 0,
              joinedDate: c.createdAt
                ? new Date(c.createdAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                  })
                : '٢٠٢٦',
            }))
          );
        }
      }

      if (zoneRes.status === 'fulfilled' && zoneRes.value.ok) {
        const zoneData = await zoneRes.value.json();
        if (zoneData.success && Array.isArray(zoneData.zones) && zoneData.zones.length > 0) {
          setZonesList(zoneData.zones as ShippingZone[]);
        }
      }

      if (setRes.status === 'fulfilled' && setRes.value.ok) {
        const setData = await setRes.value.json();
        if (setData.success && setData.settings) {
          setSettings({
            freeShippingThreshold: Number(setData.settings.freeShippingThreshold) || 4000,
            standardDeliveryFee: Number(setData.settings.standardDeliveryFee) || 65,
            announcementText:
              setData.settings.announcementText || initialSettings.announcementText,
            isCodEnabled: Boolean(setData.settings.isCodEnabled),
            isInstaPayEnabled: Boolean(setData.settings.isInstaPayEnabled),
            isCardEnabled: Boolean(setData.settings.isCardEnabled),
          });
        }
      }
    } catch (error) {
      console.error('Error syncing Admin data with MongoDB:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void refreshData();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshData]);

  const addProduct = async (
    newProductData: Omit<Product, 'id'>
  ): Promise<{ success: boolean; message?: string; product?: Product }> => {
    const newId = `jm-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const gallery = Array.from(
      new Set([newProductData.image, ...(newProductData.gallery || [])].filter(Boolean))
    );
    const created: Product = {
      ...newProductData,
      id: newId,
      image: gallery[0] || '/products/product-1.png',
      gallery: gallery.length > 0 ? gallery : ['/products/product-1.png'],
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created),
      });
      const data = await res.json();
      if (res.ok && data.success && data.product) {
        const savedProduct = data.product as Product;
        setProductsList((prev) => [savedProduct, ...prev.filter((p) => p.id !== savedProduct.id)]);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('jamila:product-sync'));
        }
        return { success: true, product: savedProduct };
      }
      return {
        success: false,
        message: data.message || 'فشل حفظ المنتج في قاعدة البيانات',
      };
    } catch (error) {
      console.error('Error adding product to MongoDB:', error);
      return {
        success: false,
        message: 'حدث خطأ في الاتصال بالخادم أثناء إضافة المنتج',
      };
    }
  };

  const updateProduct = async (
    id: string,
    updated: Partial<Product>
  ): Promise<{ success: boolean; message?: string; product?: Product }> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (res.ok && data.success && data.product) {
        const savedProduct = data.product as Product;
        setProductsList((prev) =>
          prev.map((p) => (p.id === id ? savedProduct : p))
        );
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('jamila:product-sync'));
        }
        return { success: true, product: savedProduct };
      }
      return {
        success: false,
        message: data.message || 'فشل تحديث المنتج في قاعدة البيانات',
      };
    } catch (error) {
      console.error('Error updating product in MongoDB:', error);
      return {
        success: false,
        message: 'حدث خطأ في الاتصال بالخادم أثناء تحديث المنتج',
      };
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductsList((prev) => prev.filter((p) => p.id !== id));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('jamila:product-sync'));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting product from MongoDB:', error);
      return false;
    }
  };

  const toggleBestSeller = async (id: string) => {
    const current = productsList.find((p) => p.id === id);
    if (!current) return;
    await updateProduct(id, { bestSeller: !current.bestSeller });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrdersList((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await refreshData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrdersList((prev) => prev.filter((o) => o.id !== orderId));
    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const addCustomer = async (cust: Omit<Customer, 'id' | 'joinedDate'>) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cust),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshData();
        return;
      }
    } catch (error) {
      console.error('Error adding customer to MongoDB:', error);
    }
    const newCust: Customer = {
      ...cust,
      id: `cust-${Date.now().toString().slice(-4)}`,
      joinedDate: 'أبريل ٢٠٢٦',
    };
    setCustomersList((prev) => [newCust, ...prev]);
  };

  const addZone = async (zone: Omit<ShippingZone, 'id'>) => {
    const newZone: ShippingZone = {
      ...zone,
      id: `zone-${Date.now().toString().slice(-4)}`,
    };
    setZonesList((prev) => [...prev, newZone]);
    try {
      await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZone),
      });
    } catch (error) {
      console.error('Error adding zone to MongoDB:', error);
    }
  };

  const updateZone = async (id: string, updated: Partial<ShippingZone>) => {
    setZonesList((prev) => prev.map((z) => (z.id === id ? { ...z, ...updated } : z)));
    try {
      await fetch(`/api/zones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (error) {
      console.error('Error updating zone in MongoDB:', error);
    }
  };

  const deleteZone = async (id: string) => {
    setZonesList((prev) => prev.filter((z) => z.id !== id));
    try {
      await fetch(`/api/zones/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting zone from MongoDB:', error);
    }
  };

  const toggleZoneStatus = async (id: string) => {
    const current = zonesList.find((z) => z.id === id);
    if (!current) return;
    await updateZone(id, { isActive: !current.isActive });
  };

  const updateAdminProfile = (profile: Partial<AdminProfile>) => {
    setAdminProfile((prev) => ({ ...prev, ...profile }));
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
    } catch (error) {
      console.error('Error updating store settings:', error);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        productsList,
        ordersList,
        customersList,
        zonesList,
        adminProfile,
        settings,
        isLoadingData,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleBestSeller,
        updateOrderStatus,
        deleteOrder,
        addCustomer,
        addZone,
        updateZone,
        deleteZone,
        toggleZoneStatus,
        updateAdminProfile,
        updateSettings,
        refreshData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
