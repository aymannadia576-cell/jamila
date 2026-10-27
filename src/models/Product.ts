import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  tag: string;
  price: number;
  category: 'عبايات' | 'إسدالات';
  image: string;
  gallery: string[];
  fabric: string;
  description: string;
  bestSeller: boolean;
  svgVariant: string;
  sizes: string[];
  features: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    tag: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, enum: ['عبايات', 'إسدالات'], default: 'عبايات' },
    image: { type: String, default: '/products/product-1.png' },
    gallery: { type: [String], default: [] },
    fabric: { type: String, default: 'حرير طبيعي ١٠٠٪' },
    description: { type: String, default: '' },
    bestSeller: { type: Boolean, default: false },
    svgVariant: { type: String, default: 'qamar' },
    sizes: { type: [String], default: ['S', 'M', 'L', 'XL', '2XL', '3XL'] },
    features: { type: [String], default: [] },
    stock: { type: Number, default: 10, min: 0 },
  },
  {
    timestamps: true,
  }
);

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;
