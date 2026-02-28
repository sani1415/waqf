import { getTranslations } from 'next-intl/server';
import { Auth } from '@/components/Auth';

export default async function LoginPage() {
  const t = await getTranslations('auth');
  return (
    <div className="page-center">
      <div className="card login-card">
        <h1>{t('login_title')}</h1>
        <Auth />
      </div>
    </div>
  );
}
