import { HeroSection } from '@/components/home/HeroSection';
import { CategoryCardsSection } from '@/components/home/CategoryCardsSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { MagazineSection } from '@/components/home/MagazineSection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* 3 Category Cards */}
      <CategoryCardsSection />

      {/* Featured Products Grid */}
      <FeaturedProductsSection />

      {/* Magazine / Content Preview */}
      <MagazineSection />
    </div>
  );
}
