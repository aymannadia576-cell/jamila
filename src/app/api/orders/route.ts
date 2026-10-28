import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import UserModel from '@/models/User';
import ProductModel from '@/models/Product';
import ZoneModel, { IZone } from '@/models/Zone';

export const dynamic = 'force-dynamic';

const FREE_SHIPPING_THRESHOLD = 4000;
const ALLOWED_PAYMENT_METHODS = ['cod', 'visa', 'instapay'] as const;
type PaymentMethod = (typeof ALLOWED_PAYMENT_METHODS)[number];

function isPaymentMethod(val: unknown): val is PaymentMethod {
  return typeof val === 'string' && (ALLOWED_PAYMENT_METHODS as readonly string[]).includes(val);
}

function matchShippingFee(city: string, zones: Array<Partial<IZone>>): number {
  const activeZones = zones.filter((z) => z.isActive !== false);
  const pool = activeZones.length > 0 ? activeZones : zones;
  if (pool.length === 0) return 65;

  const loc = city.trim();
  if (!loc) return Number(pool[0].shippingFee) || 65;

  const byIdOrName = pool.find(
    (z) =>
      z.id === loc ||
      z.name === loc ||
      (typeof z.name === 'string' && (z.name.includes(loc) || loc.includes(z.name)))
  );
  if (byIdOrName) return Math.max(0, Number(byIdOrName.shippingFee) || 0);

  const byGov = pool.find((z) => {
    if (typeof z.governorates !== 'string') return false;
    if (z.governorates.includes(loc)) return true;
    const parts = z.governorates
      .split(/[،,\-–•]+/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    return parts.some((p: string) => p.includes(loc) || loc.includes(p));
  });

  return Math.max(0, Number((byGov || pool[0]).shippingFee) || 65);
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    await connectToDatabase();
    const orders = await OrderModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, orders },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل جلب الطلبات' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = (await req.json()) as Record<string, unknown>;
    const authUser = getAuthUser(req);

    const customerName =
      typeof body?.customerName === 'string' ? body.customerName.trim().slice(0, 100) : '';
    const customerPhone =
      typeof body?.customerPhone === 'string' ? body.customerPhone.trim().slice(0, 30) : '';
    const city = typeof body?.city === 'string' ? body.city.trim().slice(0, 80) : '';
    const address = typeof body?.address === 'string' ? body.address.trim().slice(0, 300) : '';
    const notes = typeof body?.notes === 'string' ? body.notes.trim().slice(0, 500) : '';
    const paymentMethod: PaymentMethod = isPaymentMethod(body?.paymentMethod)
      ? body.paymentMethod
      : 'cod';

    if (!customerName || !customerPhone || !city || !address) {
      return NextResponse.json(
        { success: false, message: 'يرجى استكمال كافة بيانات الاسم ورقم الهاتف والعنوان' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body?.items) || body.items.length === 0 || body.items.length > 50) {
      return NextResponse.json(
        { success: false, message: 'حقيبة التسوق فارغة أو غير صالحة' },
        { status: 400 }
      );
    }

    const validatedItems: Array<{
      productId: string;
      name: string;
      image: string;
      size: string;
      price: number;
      quantity: number;
    }> = [];
    const decrementedItems: Array<{ productId: string; quantity: number }> = [];

    for (const rawItem of body.items as Array<Record<string, unknown>>) {
      const productId =
        typeof rawItem?.productId === 'string' ? rawItem.productId.trim() : '';
      const size =
        typeof rawItem?.size === 'string' && rawItem.size.trim()
          ? rawItem.size.trim().slice(0, 20)
          : 'M';
      const quantity = Math.floor(Number(rawItem?.quantity));

      if (!productId || !Number.isFinite(quantity) || quantity < 1 || quantity > 50) {
        for (const dec of decrementedItems) {
          await ProductModel.updateOne({ id: dec.productId }, { $inc: { stock: dec.quantity } });
        }
        return NextResponse.json(
          { success: false, message: 'بيانات المنتجات أو الكميات المطلوبة غير صالحة' },
          { status: 400 }
        );
      }

      // Ensure legacy products without a numeric stock field are initialized to 10 once
      await ProductModel.updateOne(
        {
          id: productId,
          $or: [{ stock: { $exists: false } }, { stock: null }],
        },
        { $set: { stock: 10 } }
      );

      // Atomically decrement stock only if sufficient stock exists (standard update object, no pipeline array)
      const updatedProduct = await ProductModel.findOneAndUpdate(
        {
          id: productId,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
        },
        { new: true }
      );

      if (!updatedProduct) {
        for (const dec of decrementedItems) {
          await ProductModel.updateOne({ id: dec.productId }, { $inc: { stock: dec.quantity } });
        }
        return NextResponse.json(
          {
            success: false,
            message: 'عذراً، أحد المنتجات المطلوبة نفذت كميته أو غير متوفر بالكمية المطلوبة حالياً',
          },
          { status: 400 }
        );
      }

      decrementedItems.push({ productId, quantity });
      validatedItems.push({
        productId: updatedProduct.id,
        name: updatedProduct.name,
        image: updatedProduct.image || '/products/product-1.png',
        size,
        price: Number(updatedProduct.price),
        quantity,
      });
    }

    const subtotal = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const zones = (await ZoneModel.find({}).lean()) as Array<Partial<IZone>>;
    const shippingFee =
      subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : matchShippingFee(city, zones);
    const orderTotal = subtotal + shippingFee;

    let requestedId =
      typeof body?.id === 'string' && /^JM-EG-\d{6}$/.test(body.id)
        ? body.id
        : `JM-EG-${Math.floor(100000 + Math.random() * 900000)}`;

    const existingOrderWithId = await OrderModel.exists({ id: requestedId });
    if (existingOrderWithId) {
      requestedId = `JM-EG-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const userId = authUser?.userId || '';
    const customerEmail = (
      authUser?.email ||
      (typeof body?.customerEmail === 'string' ? body.customerEmail : '')
    )
      .toLowerCase()
      .trim();

    const newOrder = await OrderModel.create({
      id: requestedId,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      city,
      address,
      paymentMethod,
      status: 'pending',
      items: validatedItems,
      total: orderTotal,
      notes,
    });

    try {
      const orConditions: Array<Record<string, string>> = [];
      if (userId && userId.length === 24) {
        orConditions.push({ _id: userId });
      }
      if (customerEmail) {
        orConditions.push({ email: customerEmail });
      }
      if (customerPhone) {
        orConditions.push({ phone: customerPhone });
      }

      if (orConditions.length > 0) {
        await UserModel.findOneAndUpdate(
          { role: 'customer', $or: orConditions },
          {
            $inc: { totalOrders: 1, totalSpent: orderTotal },
            ...(city ? { $set: { city } } : {}),
          }
        );
      }
    } catch (syncErr) {
      console.error('Error syncing customer order stats:', syncErr);
    }

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الطلب بنجاح',
      order: newOrder,
    });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل حفظ الطلب' },
      { status: 500 }
    );
  }
}
