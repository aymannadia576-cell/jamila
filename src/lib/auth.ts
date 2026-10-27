import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const AUTH_COOKIE_NAME = 'jamila_auth_token';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error(
      'Server configuration error: JWT_SECRET environment variable is missing or too short.'
    );
  }
  return secret;
}

export interface AuthPayload {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export function signAuthToken(payload: AuthPayload): string {
  return jwt.sign(
    {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
}

export function getAuthCookieOptions(maxAgeSeconds: number = 60 * 60 * 24 * 7) {
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

/** Reads and verifies the JWT from the auth cookie (or Bearer header). */
export function getAuthUser(req: NextRequest): AuthPayload | null {
  const token =
    req.cookies.get(AUTH_COOKIE_NAME)?.value ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as Partial<AuthPayload>;
    if (
      !decoded ||
      typeof decoded.userId !== 'string' ||
      typeof decoded.email !== 'string' ||
      (decoded.role !== 'admin' && decoded.role !== 'customer')
    ) {
      return null;
    }
    return {
      userId: decoded.userId,
      name: typeof decoded.name === 'string' ? decoded.name : '',
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

/**
 * Guards admin-only API routes.
 * Returns a 401/403 response when the caller is not an admin, otherwise null.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'يجب تسجيل الدخول أولاً' },
      { status: 401 }
    );
  }
  if (user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'غير مصرح لكِ بالوصول إلى هذه البيانات' },
      { status: 403 }
    );
  }
  return null;
}
