import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAuthToken, getAuthCookieOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = (await req.json()) as Record<string, unknown>;
    const { name, email, password, phone, city, address } = body || {};

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال الاسم والبريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      );
    }

    if (password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { success: false, message: 'كلمة المرور يجب أن تتراوح بين ٦ و ١٢٨ حرفاً' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال بريد إلكتروني صحيح' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل مسبقاً' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim().slice(0, 100),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'customer',
      phone: typeof phone === 'string' ? phone.trim().slice(0, 30) : '',
      city: typeof city === 'string' && city.trim() ? city.trim().slice(0, 60) : 'القاهرة',
      address: typeof address === 'string' ? address.trim().slice(0, 250) : '',
      totalOrders: 0,
      totalSpent: 0,
      wishlist: [],
    });

    const token = signAuthToken({
      userId: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: 'customer',
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          city: newUser.city,
          address: newUser.address,
        },
      },
      { status: 201 }
    );

    response.cookies.set({
      ...getAuthCookieOptions(),
      value: token,
    });

    return response;
  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
}
