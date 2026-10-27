import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  phone?: string;
  city?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String, default: '' },
    city: { type: String, default: 'القاهرة' },
    address: { type: String, default: '' },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    wishlist: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;