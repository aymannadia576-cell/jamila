import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import SettingModel from '@/models/Setting';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SettingModel.findOne({ key: 'store_settings' });

    if (!settings) {
      settings = await SettingModel.create({
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

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل جلب إعدادات المتجر' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    await connectToDatabase();
    const body = (await req.json()) as Record<string, unknown>;

    const allowedUpdates: Record<string, unknown> = {};
    if (
      body?.freeShippingThreshold !== undefined &&
      Number.isFinite(Number(body.freeShippingThreshold)) &&
      Number(body.freeShippingThreshold) >= 0
    ) {
      allowedUpdates.freeShippingThreshold = Number(body.freeShippingThreshold);
    }
    if (
      body?.standardDeliveryFee !== undefined &&
      Number.isFinite(Number(body.standardDeliveryFee)) &&
      Number(body.standardDeliveryFee) >= 0
    ) {
      allowedUpdates.standardDeliveryFee = Number(body.standardDeliveryFee);
    }
    if (typeof body?.announcementText === 'string') {
      allowedUpdates.announcementText = body.announcementText.trim().slice(0, 300);
    }
    if (typeof body?.isCodEnabled === 'boolean') {
      allowedUpdates.isCodEnabled = body.isCodEnabled;
    }
    if (typeof body?.isInstaPayEnabled === 'boolean') {
      allowedUpdates.isInstaPayEnabled = body.isInstaPayEnabled;
    }
    if (typeof body?.isCardEnabled === 'boolean') {
      allowedUpdates.isCardEnabled = body.isCardEnabled;
    }

    const updated = await SettingModel.findOneAndUpdate(
      { key: 'store_settings' },
      { $set: allowedUpdates },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات المتجر بنجاح',
      settings: updated,
    });
  } catch (error) {
    console.error('PUT /api/settings error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل تحديث إعدادات المتجر' },
      { status: 500 }
    );
  }
}
