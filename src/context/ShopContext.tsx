'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product, products as initialProducts } from '@/data/products';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  city?: string;
  address?: string;
}

export interface ShippingZoneInfo {
  id: string;
  name: string;
  governorates: string;
  shippingFee: number;
  estimatedDays: string;
  isActive: boolean;
}

export const FREE_SHIPPING_THRESHOLD = 4000;

const DEFAULT_ZONES: ShippingZoneInfo[] = [
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

export type DrawerType = 'menu' | 'cart' | 'wishlist' | null;

export interface AuthActionResult {
  success: boolean;
  user?: UserProfile;
  message?: string;
}

interface ShopContextType {
  products: Product[];
  refreshProducts: () => Promise<void>;
  zones: ShippingZoneInfo[];
  freeShippingThreshold: number;
  getZoneForLocation: (location?: string) => ShippingZoneInfo;
  getShippingFee: (subtotal: number, location?: string) => number;
  cart: CartItem[];
  wishlist: string[];
  activeDrawer: DrawerType;
  isAuthModalOpen: boolean;
  authTab: 'login' | 'signup';
  user: UserProfile | null;
  isLoadingUser: boolean;
  toastMessage: string | null;
  openDrawer: (drawer: DrawerType) => void;
  closeDrawer: () => void;
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  setAuthTab: (tab: 'login' | 'signup') => void;
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loginUser: (email: string, password: string) => Promise<AuthActionResult>;
  signupUser: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    city?: string
  ) => Promise<AuthActionResult>;
  logoutUser: () => Promise<void>;
  showToast: (msg: string) => void;
  cartTotal: number;
  cartCount: number;
  wishlistCount: number;
  wishlistProducts: Product[];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [zones, setZones] = useState<ShippingZoneInfo[]>(DEFAULT_ZONES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const syncStorageForUser = useCallback((email: string | null) => {
    try {
      localStorage.removeItem('jamila_wishlist');
      localStorage.removeItem('jamila_cart');
      if (!email) {
        setWishlist([]);
        setCart([]);
        return;
      }
      const normalized = email.toLowerCase();
      const savedWishlist = localStorage.getItem(`jamila_wishlist_${normalized}`);
      setWishlist(savedWishlist ? (JSON.parse(savedWishlist) as string[]) : []);
      const savedCart = localStorage.getItem(`jamila_cart_${normalized}`);
      setCart(savedCart ? (JSON.parse(savedCart) as CartItem[]) : []);
    } catch {
      setWishlist([]);
      setCart([]);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products as Product[]);
      }
    } catch (error) {
      console.error('Failed to fetch products from MongoDB:', error);
    }
  }, []);

  const fetchZones = useCallback(async () => {
    try {
      const res = await fetch('/api/zones', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.zones) && data.zones.length > 0) {
        setZones(data.zones as ShippingZoneInfo[]);
      }
    } catch (error) {
      console.error('Failed to fetch shipping zones:', error);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const profile = data.user as UserProfile;
          setUser(profile);
          syncStorageForUser(profile.email);
        } else {
          setUser(null);
          syncStorageForUser(null);
        }
      } else {
        setUser(null);
        syncStorageForUser(null);
      }
    } catch {
      setUser(null);
      syncStorageForUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, [syncStorageForUser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchProducts();
      void fetchZones();
      void fetchCurrentUser();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts, fetchZones, fetchCurrentUser]);

  useEffect(() => {
    if (!user?.email) return;
    try {
      localStorage.setItem(`jamila_cart_${user.email.toLowerCase()}`, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart, user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    try {
      localStorage.setItem(`jamila_wishlist_${user.email.toLowerCase()}`, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlist, user?.email]);

  const openDrawer = (drawer: DrawerType) => {
    setIsAuthModalOpen(false);
    setActiveDrawer(drawer);
  };

  const closeDrawer = () => setActiveDrawer(null);

  const openAuthModal = (tab: 'login' | 'signup' = 'login') => {
    setActiveDrawer(null);
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const addToCart = (product: Product, size: string = 'M', quantity: number = 1) => {
    const stock = typeof product.stock === 'number' ? product.stock : 10;
    if (stock <= 0) {
      showToast(`عذراً، نفذت كمية "${product.name}" حالياً (Sold Out)`);
      return;
    }

    const effectiveSize =
      product.sizes && product.sizes.length > 0 && !product.sizes.includes(size)
        ? product.sizes[0]
        : size;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === effectiveSize
      );
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const nextQty = Math.min(stock, currentQty + quantity);
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          product,
          quantity: nextQty,
        };
        return updated;
      }
      return [...prev, { product, size: effectiveSize, quantity: Math.min(stock, quantity) }];
    });
    showToast(`تمت إضافة "${product.name}" إلى حقيبة التسوق`);
    setActiveDrawer('cart');
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const maxStock =
              typeof item.product.stock === 'number' && item.product.stock > 0
                ? item.product.stock
                : 10;
            const newQty = Math.min(maxStock, item.quantity + delta);
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    if (!user) {
      showToast('يرجى تسجيل الدخول أولاً لحفظ القطع في قائمة المفضلة');
      router.push('/login');
      return;
    }
    const product = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        if (product) showToast(`تمت إزالة "${product.name}" من المفضلة`);
        return prev.filter((id) => id !== productId);
      } else {
        if (product) showToast(`تم حفظ "${product.name}" في قائمة المفضلة`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => Boolean(user) && wishlist.includes(productId);

  const loginUser = async (email: string, password: string): Promise<AuthActionResult> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const profile = data.user as UserProfile;
        setUser(profile);
        syncStorageForUser(profile.email);
        setIsAuthModalOpen(false);
        showToast(`أهلاً بكِ مجدداً يا ${profile.name}`);
        return { success: true, user: profile };
      } else {
        const msg = data.message || 'بيانات الدخول غير صحيحة';
        showToast(msg);
        return { success: false, message: msg };
      }
    } catch {
      const msg = 'حدث خطأ في الاتصال بالخادم';
      showToast(msg);
      return { success: false, message: msg };
    }
  };

  const signupUser = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    city?: string
  ): Promise<AuthActionResult> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, city }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const profile = data.user as UserProfile;
        setUser(profile);
        syncStorageForUser(profile.email);
        setIsAuthModalOpen(false);
        showToast(`مرحباً بكِ في دار جميلة، ${profile.name}`);
        return { success: true, user: profile };
      } else {
        const msg = data.message || 'فشل إنشاء الحساب';
        showToast(msg);
        return { success: false, message: msg };
      }
    } catch {
      const msg = 'حدث خطأ أثناء إنشاء الحساب';
      showToast(msg);
      return { success: false, message: msg };
    }
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    syncStorageForUser(null);
    showToast('تم تسجيل الخروج بنجاح');
  };

  const getZoneForLocation = useCallback(
    (location?: string): ShippingZoneInfo => {
      const activeZones = zones.filter((z) => z.isActive);
      const pool = activeZones.length > 0 ? activeZones : zones.length > 0 ? zones : DEFAULT_ZONES;
      if (!location || !location.trim()) {
        return pool[0];
      }
      const loc = location.trim();

      const byIdOrName = pool.find(
        (z) => z.id === loc || z.name === loc || z.name.includes(loc) || loc.includes(z.name)
      );
      if (byIdOrName) return byIdOrName;

      const byGovernorates = pool.find((z) => {
        if (z.governorates.includes(loc)) return true;
        const parts = z.governorates
          .split(/[،,\-–•]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        return parts.some((p) => p.includes(loc) || loc.includes(p));
      });

      return byGovernorates || pool[0];
    },
    [zones]
  );

  const getShippingFee = useCallback(
    (subtotal: number, location?: string): number => {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
      const matchedZone = getZoneForLocation(location);
      return matchedZone ? Number(matchedZone.shippingFee) : 65;
    },
    [getZoneForLocation]
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = user ? wishlist.length : 0;
  const wishlistProducts = user ? products.filter((p) => wishlist.includes(p.id)) : [];

  return (
    <ShopContext.Provider
      value={{
        products,
        refreshProducts: fetchProducts,
        zones,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        getZoneForLocation,
        getShippingFee,
        cart,
        wishlist,
        activeDrawer,
        isAuthModalOpen,
        authTab,
        user,
        isLoadingUser,
        toastMessage,
        openDrawer,
        closeDrawer,
        openAuthModal,
        closeAuthModal,
        setAuthTab,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        loginUser,
        signupUser,
        logoutUser,
        showToast,
        cartTotal,
        cartCount,
        wishlistCount,
        wishlistProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
