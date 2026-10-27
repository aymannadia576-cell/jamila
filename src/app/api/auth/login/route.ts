import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAuthToken, getAuthCookieOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = (await req.json()) as Record<string, unknown>;
    const email = body?.email;
    const password = body?.password;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد أو كلمة المرور' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد أو كلمة المرور' },
        { status: 401 }
      );
    }

    const token = signAuthToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          city: user.city,
          address: user.address,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      ...getAuthCookieOptions(),
      value: token,
    });

    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
