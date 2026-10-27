import React from 'react';
import Link from 'next/link';

interface BrandWordmarkProps {
  size?: 'small' | 'default' | 'large';
  className?: string;
  showArabicSubtitle?: boolean;
  variant?: 'dark' | 'light';
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  size = 'default',
  className = '',
  showArabicSubtitle = true,
  variant = 'dark',
}) => {
  const getImageSizeClass = () => {
    switch (size) {
      case 'small':
        return 'h-10 sm:h-12';
      case 'large':
        return 'h-18 sm:h-22 md:h-24';
      default:
        // Noticeably larger, prominent, and crystal clear in the Navbar
        return 'h-13 sm:h-15 md:h-16';
    }
  };

  const logoSrc = variant === 'light' ? '/jamila-logo-light.png' : '/jamila-logo-dark.png';
  const subtitleColor = variant === 'light' ? 'text-[#f8f2e7]/90' : 'text-[#5c3d2e]';

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center justify-center text-center select-none ${className}`}
      aria-label="JAMILA جميلة — الصفحة الرئيسية"
    >
      {/* Brand Monogram & Wordmark Image - 100% Transparent Background, Solid, Clear (No white box, no hover fading) */}
      <div className={`relative ${getImageSizeClass()} flex items-center justify-center`}>
        <img
          src={logoSrc}
          alt="JAMILA جميلة"
          className="h-full w-auto max-w-[220px] sm:max-w-[260px] md:max-w-[300px] object-contain opacity-100"
          style={{ opacity: 1, filter: 'none' }}
          loading="eager"
        />
      </div>

      {showArabicSubtitle && (
        <span className={`text-[10px] sm:text-[11px] tracking-[0.25em] font-amiri font-bold ${subtitleColor} select-none -mt-0.5`}>
          أزياء عربية راقية
        </span>
      )}
    </Link>
  );
};
