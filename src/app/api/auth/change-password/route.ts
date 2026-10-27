import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return NextResponse.json(
      { success: false, message: 'يجب تسجيل الدخول أولاً لتغيير كلمة المرور' },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const currentPassword = body?.currentPassword;
    const newPassword = body?.newPassword;

    if (typeof currentPassword !== 'string' || !currentPassword) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال كلمة المرور الحالية' },
        { status: 400 }
      );
    }

    if (
      typeof newPassword !== 'string' ||
      newPassword.length < 6 ||
      newPassword.length > 128
    ) {
      return NextResponse.json(
        { success: false, message: 'كلمة المرور الجديدة يجب أن تتراوح بين ٦ و ١٢٨ حرفاً' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(authUser.userId);
    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'كلمة المرور الحالية غير صحيحة' },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح في قاعدة البيانات',
    });
  } catch (error) {
    console.error('Change password API error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تغيير كلمة المرور' },
      { status: 500 }
    );
  }
}
