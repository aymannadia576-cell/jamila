import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import UserModel from '@/models/User';
import SettingModel from '@/models/Setting';
import ZoneModel from '@/models/Zone';
import { products as initialProducts } from '@/data/products';

function isAuthorizedSeedRequest(req: NextRequest): boolean {
  const seedSecret = process.env.SEED_SECRET?.trim();
  const providedSecret = req.headers.get('x-seed-secret')?.trim();
  if (seedSecret && seedSecret.length >= 16 && providedSecret === seedSecret) {
    return true;
  }
  const denied = requireAdmin(req);
  return denied === null;
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedSeedRequest(req)) {
    return NextResponse.json(
      { success: false, message: 'غير مصرح لك بتشغيل تهيئة قاعدة البيانات' },
      { status: 403 }
    );
  }

  try {
    await connectToDatabase();

    // 1. Seed Initial Admin Account ONLY if INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD env vars are explicitly set
    let adminSeeded = false;
    const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL?.toLowerCase().trim();
    const initialAdminPassword = process.env.INITIAL_ADMIN_PASSWORD;

    if (
      initialAdminEmail &&
      initialAdminPassword &&
      initialAdminPassword.length >= 8
    ) {
      const existingAdmin = await UserModel.findOne({ email: initialAdminEmail });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(initialAdminPassword, 10);
        await UserModel.create({
          name: 'مديرة دار جميلة',
          email: initialAdminEmail,
          password: hashedPassword,
          role: 'admin',
          phone: '01012345678',
          city: 'القاهرة',
        });
        adminSeeded = true;
      }
    }

    // 2. Seed Products if empty
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      await ProductModel.insertMany(initialProducts);
    }

    // 3. Seed Shipping Zones if empty
    const zoneCount = await ZoneModel.countDocuments();
    if (zoneCount === 0) {
      await ZoneModel.insertMany([
        {
          id: 'zone-01',
          name: 'القاهرة الكبرى والجيزة',
          governorates: 'القاهرة، الجيزة، التجمع، الشيخ زايد، 6 أكتوبر، المعادي، مصر الجديدة',
          shippingFee: 50,
          estimatedDays: '٢٤ - ٤٨ ساعة',
          isActive: true,
        },
        {
          id: 'zone-02',
          name: 'الإسكندرية والساحل الشمالي',
          governorates: 'الإسكندرية، برج العرب، الساحل الشمالي، العلمين',
          shippingFee: 65,
          estimatedDays: '٢ - ٣ أيام',
          isActive: true,
        },
        {
          id: 'zone-03',
          name: 'محافظات الدلتا والوجه البحري',
          governorates:
            'الدقهلية (المنصورة)، الغربية (طنطا)، المنوفية، القليوبية، الشرقية، البحيرة، كفر الشيخ، دمياط',
          shippingFee: 75,
          estimatedDays: '٢ - ٤ أيام',
          isActive: true,
        },
        {
          id: 'zone-04',
          name: 'مدن القناة وسيناء',
          governorates: 'بورسعيد، الإسماعيلية، السويس، جنوب سيناء (شرم الشيخ)',
          shippingFee: 85,
          estimatedDays: '٣ - ٤ أيام',
          isActive: true,
        },
        {
          id: 'zone-05',
          name: 'محافظات الصعيد والوجه القبلي',
          governorates: 'الفيوم، بني سويف، المنيا، أسيوط، سوهاج، قنا، الأقصر، أسوان',
          shippingFee: 95,
          estimatedDays: '٣ - ٥ أيام',
          isActive: true,
        },
        {
          id: 'zone-06',
          name: 'محافظات البحر الأحمر والمناطق النائية',
          governorates: 'الغردقة، الجونة، سفاجا، مرسى علم، الوادي الجديد، مطروح',
          shippingFee: 120,
          estimatedDays: '٤ - ٦ أيام',
          isActive: true,
        },
      ]);
    }

    // 4. Seed Store Settings if empty
    const existingSettings = await SettingModel.findOne({ key: 'store_settings' });
    if (!existingSettings) {
      await SettingModel.create({
        key: 'store_settings',
        freeShippingThreshold: 4000,
        standardDeliveryFee: 65,
        announcementText:
          'توصيل سريع لكافة محافظات مصر | شحن مجاني للطلبات فوق ٤,٠٠٠ ج.م',
        isCodEnabled: true,
        isInstaPayEnabled: true,
        isCardEnabled: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تمت تهيئة قاعدة البيانات الأولية بنجاح',
      adminSeeded,
    });
  } catch (error) {
    console.error('Database Seed Error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل تهيئة قاعدة البيانات' },
      { status: 500 }
    );
  }
}
