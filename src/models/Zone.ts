import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IZone extends Document {
  id: string;
  name: string;
  governorates: string;
  shippingFee: number;
  estimatedDays: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ZoneSchema = new Schema<IZone>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    governorates: { type: String, required: true },
    shippingFee: { type: Number, required: true },
    estimatedDays: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ZoneModel: Model<IZone> =
  mongoose.models.Zone || mongoose.model<IZone>('Zone', ZoneSchema);

export default ZoneModel;