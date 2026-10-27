import type { Metadata } from 'next';
import { Playfair_Display, Amiri, Cairo } from 'next/font/google';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import { AdminProvider } from '@/context/AdminContext';
import { StoreLayoutWrapper } from '@/components/layout/StoreLayoutWrapper';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JAMILA | جميلة — أزياء العباءات والإسدالات الفاخرة',
  description: 'دار جميلة للأزياء العربية الفاخرة — عبايات وإسدالات راقية بتصاميم تراثية وأقمشة طبيعية خالصة.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${playfair.variable} ${amiri.variable} ${cairo.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="bg-[#f8f2e7] text-[#3d2a1f] min-h-screen flex flex-col font-cairo antialiased selection:bg-[#5c3d2e] selection:text-[#f8f2e7]">
        <AdminProvider>
          <ShopProvider>
            <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
          </ShopProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
