import { NextResponse } from 'next/server';
import { getAuthCookieOptions } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: 'تم تسجيل الخروج بنجاح' },
    { status: 200 }
  );

  response.cookies.set({
    ...getAuthCookieOptions(0),
    value: '',
    expires: new Date(0),
  });

  return response;
}
