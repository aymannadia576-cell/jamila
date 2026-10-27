import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'غير مسجل الدخول' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(authUser.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          city: user.city,
          address: user.address,
          totalOrders: user.totalOrders,
          totalSpent: user.totalSpent,
          wishlist: user.wishlist,
        },
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'انتهت صلاحية الجلسة' },
      { status: 401 }
    );
  }
}
