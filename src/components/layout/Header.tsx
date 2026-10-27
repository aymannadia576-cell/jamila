'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { BrandWordmark } from '@/components/common/BrandWordmark';
import { Menu, Search, User, Heart, ShoppingBag, X, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { openDrawer, user, cartCount, wishlistCount } = useShop();

  const [searchActive, setSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchActive(false);
      setSearchInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f8f2e7]/95 backdrop-blur-md border-b border-[rgba(92,61,46,0.12)] transition-all">
      {/* Announcement Bar (خاص بجمهورية مصر العربية) */}
      <div className="bg-[#5c3d2e] text-[#f8f2e7] text-[11px] sm:text-xs py-1.5 px-4 tracking-wider text-center font-cairo">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-1.5 text-[#f8f2e7]/90 text-[11px]">
            <MapPin size={13} className="text-[#f8f2e7]" />
            <span className="font-semibold">مصر / Egypt</span>
          </div>

          <div className="mx-auto md:mx-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span className="font-bold">
              توصيل سريع لجميع محافظات مصر • شحن مجاني للطلبات فوق 4,000 ج.م
            </span>
            <span className="hidden xl:inline text-[#f8f2e7]/75 text-[10px] font-playfair">
              (Fast Delivery Across Egypt • Free shipping on orders over 4,000 EGP)
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[#f8f2e7]/90 text-[11px]">
            <span>الدفع عند الاستلام متاح</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Start (Right in RTL): Hamburger, Location & Search */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-start">
            <button
              onClick={() => openDrawer('menu')}
              className="p-2 text-[#5c3d2e] hover:text-[#3d2a1f] hover:bg-[#5c3d2e]/5 rounded-sm transition-colors flex items-center gap-1.5"
              aria-label="افتح قائمة المتجر"
            >
              <Menu size={22} strokeWidth={1.75} />
              <span className="hidden sm:inline text-xs font-cairo font-semibold text-[#5c3d2e] tracking-wider">
                المتجر
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-1 text-[11px] font-cairo text-[#5c3d2e] bg-[#fcfaf5] border border-[rgba(92,61,46,0.2)] px-2.5 py-1 rounded-xs">
              <MapPin size={12} className="text-[#5c3d2e]" />
              <span>
                التوصيل: <strong>مصر / Egypt</strong>
              </span>
            </div>

            <button
              onClick={() => setSearchActive(!searchActive)}
              className="p-2 text-[#5c3d2e] hover:text-[#3d2a1f] hover:bg-[#5c3d2e]/5 rounded-sm transition-colors"
              aria-label="بحث في المنتجات"
            >
              {searchActive ? (
                <X size={20} strokeWidth={1.75} />
              ) : (
                <Search size={20} strokeWidth={1.75} />
              )}
            </button>
          </div>

          {/* Center: Logo Wordmark */}
          <div className="flex-shrink-0 flex items-center justify-center py-2">
            <BrandWordmark size="default" showArabicSubtitle={true} />
          </div>

          {/* End (Left in RTL): Account, Wishlist & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-[#5c3d2e] text-[#f8f2e7] text-[11px] sm:text-xs font-semibold rounded-xs hover:bg-[#3d2a1f] transition-colors shadow-2xs shrink-0"
                title="الانتقال إلى لوحة الإدارة"
              >
                <span>لوحة الإدارة 👑</span>
              </Link>
            )}

            <Link
              href={user?.role === 'admin' ? '/admin' : '/login'}
              prefetch
              className="p-2 text-[#5c3d2e] hover:text-[#3d2a1f] hover:bg-[#5c3d2e]/5 rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
              aria-label={user ? `حساب ${user.name}` : 'تسجيل الدخول'}
              title={user ? user.name : 'تسجيل الدخول / إنشاء حساب'}
            >
              <User size={20} strokeWidth={1.75} />
              {user && (
                <span className="hidden lg:inline text-xs font-medium font-cairo text-[#5c3d2e] max-w-[80px] truncate">
                  {user.name}
                </span>
              )}
            </Link>

            <button
              onClick={() => openDrawer('wishlist')}
              className="relative p-2 text-[#5c3d2e] hover:text-[#3d2a1f] hover:bg-[#5c3d2e]/5 rounded-sm transition-colors"
              aria-label="المفضلة"
            >
              <Heart size={20} strokeWidth={1.75} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 end-1 bg-[#5c3d2e] text-[#f8f2e7] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => openDrawer('cart')}
              className="relative p-2 text-[#5c3d2e] hover:text-[#3d2a1f] hover:bg-[#5c3d2e]/5 rounded-sm transition-colors flex items-center gap-1.5"
              aria-label="حقيبة التسوق"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              <span className="hidden sm:inline text-xs font-cairo font-semibold">السلة</span>
              {cartCount > 0 && (
                <span className="absolute top-1 end-1 sm:relative sm:top-auto sm:end-auto bg-[#5c3d2e] text-[#f8f2e7] text-[10px] w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchActive && (
          <form
            onSubmit={handleSearchSubmit}
            className="pb-3 pt-1 border-t border-[rgba(92,61,46,0.12)] flex items-center gap-2 animate-fade-in"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ابحثي عن اسم العباية، نوع الحرير، أو القصة..."
                className="w-full py-2 px-3 ps-8 bg-[#fcfaf5] border border-[rgba(92,61,46,0.25)] text-xs font-cairo text-[#3d2a1f] placeholder-[#8a6b57]/70 focus:outline-none focus:border-[#5c3d2e]"
                autoFocus
              />
              <Search
                size={15}
                className="absolute top-1/2 -translate-y-1/2 start-2.5 text-[#8a6b57]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-cairo font-semibold hover:bg-[#3d2a1f] transition-colors"
            >
              بحث
            </button>
          </form>
        )}
      </div>
    </header>
  );
};
