'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8f2e7] flex items-center justify-center font-cairo text-xs text-[#5c3d2e]">
      جاري التحويل إلى صفحة تسجيل الدخول الموحدة...
    </div>
  );
}
