import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  city: string;
  address: string;
  paymentMethod: 'cod' | 'visa' | 'instapay';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: IOrderItem[];
  total: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, default: '/products/product-1.png' },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, default: '' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['cod', 'visa', 'instapay'],
      default: 'cod',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;
