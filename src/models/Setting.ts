import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  announcementText: string;
  isCodEnabled: boolean;
  isInstaPayEnabled: boolean;
  isCardEnabled: boolean;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, default: 'store_settings', unique: true },
    freeShippingThreshold: { type: Number, default: 4000 },
    standardDeliveryFee: { type: Number, default: 65 },
    announcementText: {
      type: String,
      default: 'توصيل سريع لكافة محافظات مصر | شحن مجاني للطلبات فوق ٤,٠٠٠ ج.م',
    },
    isCodEnabled: { type: Boolean, default: true },
    isInstaPayEnabled: { type: Boolean, default: true },
    isCardEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const SettingModel: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

export default SettingModel;
