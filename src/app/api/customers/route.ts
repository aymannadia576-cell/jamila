import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import UserModel from '@/models/User';
import OrderModel, { IOrder } from '@/models/Order';

export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(phone?: string): string {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/\D/g, '').replace(/^20/, '0');
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    await connectToDatabase();
    const [customersDocs, activeOrders] = await Promise.all([
      UserModel.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 }),
      OrderModel.find({ status: { $ne: 'cancelled' } }).lean<Array<Partial<IOrder>>>(),
    ]);

    const customers = customersDocs.map((custDoc) => {
      const cust = custDoc.toObject();
      const custId = String(cust._id);
      const custEmail = (cust.email || '').toLowerCase().trim();
      const custPhone = normalizePhone(cust.phone);

      const matchedOrders = activeOrders.filter((ord) => {
        if (ord.userId && String(ord.userId) === custId) return true;
        if (
          ord.customerEmail &&
          custEmail &&
          String(ord.customerEmail).toLowerCase().trim() === custEmail
        ) {
          return true;
        }
        const ordPhone = normalizePhone(ord.customerPhone);
        if (ordPhone && custPhone && ordPhone === custPhone) return true;
        return false;
      });

      const computedOrdersCount = matchedOrders.length;
      const computedSpent = matchedOrders.reduce(
        (sum: number, o) => sum + (Number(o.total) || 0),
        0
      );

      return {
        ...cust,
        totalOrders: Math.max(cust.totalOrders || 0, computedOrdersCount),
        totalSpent: Math.max(cust.totalSpent || 0, computedSpent),
      };
    });

    return NextResponse.json(
      { success: true, customers },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('GET /api/customers error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل جلب العميلات' },
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

    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 100) : '';
    const email = typeof body?.email === 'string' ? body.email.toLowerCase().trim() : '';

    if (!name || !email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال اسم العميلة وبريد إلكتروني صحيح' },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل' },
        { status: 400 }
      );
    }

    const rawPassword =
      typeof body?.password === 'string' && body.password.length >= 6 && body.password.length <= 128
        ? body.password
        : crypto.randomBytes(24).toString('hex');
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newCustomer = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone: typeof body?.phone === 'string' ? body.phone.trim().slice(0, 30) : '',
      city: typeof body?.city === 'string' && body.city.trim() ? body.city.trim().slice(0, 60) : 'القاهرة',
      address: typeof body?.address === 'string' ? body.address.trim().slice(0, 250) : '',
      role: 'customer',
      totalOrders: Math.max(0, Number(body?.totalOrders) || 0),
      totalSpent: Math.max(0, Number(body?.totalSpent) || 0),
    });

    return NextResponse.json({
      success: true,
      message: 'تم إضافة العميلة بنجاح',
      customer: {
        id: newCustomer._id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        city: newCustomer.city,
        totalOrders: newCustomer.totalOrders,
        totalSpent: newCustomer.totalSpent,
      },
    });
  } catch (error) {
    console.error('POST /api/customers error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل إضافة العميلة' },
      { status: 500 }
    );
  }
}
