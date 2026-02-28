'use client';
import { useEffect } from 'react';
import { useRouter } from '@/lib/navigation';
import { getAuthFromCookie } from '@/lib/data';

export function LandingRedirect({ locale }: { locale: string }) {
  const router = useRouter();
  useEffect(() => {
    const auth = getAuthFromCookie();
    if (auth) router.replace(`/dashboard`);
  }, [router, locale]);
  return null;
}
