import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import ZoneModel from '@/models/Zone';

export const dynamic = 'force-dynamic';

const initialEgyptianZones = [
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
    governorates: 'الدقهلية (المنصورة)، الغربية (طنطا)، المنوفية، القليوبية، الشرقية، البحيرة، كفر الشيخ، دمياط',
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
];

export async function GET() {
  try {
    await connectToDatabase();
    let zones = await ZoneModel.find({}).sort({ shippingFee: 1 });

    if (!zones || zones.length === 0) {
      try {
        await ZoneModel.insertMany(initialEgyptianZones, { ordered: false });
      } catch (seedErr: unknown) {
        const code = (seedErr as { code?: number })?.code;
        if (code !== 11000) {
          console.warn('Initial zones seed warning in GET /api/zones:', seedErr);
        }
      }
      zones = await ZoneModel.find({}).sort({ shippingFee: 1 });
    }

    return NextResponse.json(
      { success: true, zones },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('GET /api/zones error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل جلب مناطق التوصيل' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    await connectToDatabase();
    const body = (await req.json()) as Record<string, unknown>;

    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const governorates =
      typeof body?.governorates === 'string' ? body.governorates.trim().slice(0, 500) : '';
    const shippingFee = Number(body?.shippingFee);

    if (!name || !governorates || !Number.isFinite(shippingFee) || shippingFee < 0) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال اسم المنطقة والمحافظات وسعر شحن صالح' },
        { status: 400 }
      );
    }

    const zoneId =
      typeof body?.id === 'string' && /^[a-zA-Z0-9_-]{2,40}$/.test(body.id)
        ? body.id
        : `zone-${Date.now().toString().slice(-4)}`;

    const newZone = await ZoneModel.create({
      id: zoneId,
      name,
      governorates,
      shippingFee,
      estimatedDays:
        typeof body?.estimatedDays === 'string' && body.estimatedDays.trim()
          ? body.estimatedDays.trim().slice(0, 60)
          : '2-4 أيام عمل',
      isActive: body?.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    return NextResponse.json({
      success: true,
      message: 'تم إضافة منطقة التوصيل بنجاح',
      zone: newZone,
    });
  } catch (error) {
    console.error('POST /api/zones error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل إضافة منطقة التوصيل' },
      { status: 500 }
    );
  }
}
