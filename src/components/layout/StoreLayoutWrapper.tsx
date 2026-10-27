'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShopMenuDrawer } from '@/components/drawers/ShopMenuDrawer';
import { CartDrawer } from '@/components/drawers/CartDrawer';
import { WishlistDrawer } from '@/components/drawers/WishlistDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { useShop } from '@/context/ShopContext';

export const StoreLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const { toastMessage } = useShop();
  const isAdminRoute = pathname?.startsWith('/admin');

  const toastBanner = toastMessage ? (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#3d2a1f] text-[#f8f2e7] px-5 py-3 rounded-xs shadow-lg border border-[#c9a96e]/30 text-xs sm:text-sm font-cairo font-semibold">
      {toastMessage}
    </div>
  ) : null;

  if (isAdminRoute) {
    return (
      <>
        {children}
        {toastBanner}
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ShopMenuDrawer />
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
      {toastBanner}
    </>
  );
};
