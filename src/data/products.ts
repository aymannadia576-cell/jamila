export interface Product {
  id: string;
  name: string;
  category: 'عبايات' | 'إسدالات';
  price: number;
  tag: string;
  bestSeller: boolean;
  image: string;
  gallery: string[];
  svgVariant: 'qamar' | 'andalusian' | 'najd' | 'mirage' | 'yaqout' | 'rawda' | 'dunes' | 'cordoba';
  description: string;
  fabric: string;
  sizes: string[];
  features: string[];
  stock?: number;
}

// Default products list is empty — products are managed exclusively via the Admin Dashboard and stored in MongoDB.
export const products: Product[] = [];
