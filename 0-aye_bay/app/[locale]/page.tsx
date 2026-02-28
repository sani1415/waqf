import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { LandingRedirect } from '@/components/LandingRedirect';

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('common');
  return (
    <div className="landing">
      <LandingRedirect locale={params.locale} />
      <div className="landing-inner">
        <div className="logo-area">
          <i className="fas fa-chart-line" aria-hidden />
        </div>
        <div className="lang-switch">
          <Link href="/" locale="en">English</Link>
          <span> | </span>
          <Link href="/" locale="bn">বাংলা</Link>
        </div>
        <h1 className="app-title">{t('app_name')}</h1>
        <p className="subtitle">Income, expense & project manager</p>
      </div>
      <div className="landing-actions">
        <Link href="/login" className="role-card teacher-card">
          <div className="card-icon">
            <i className="fas fa-sign-in-alt" aria-hidden />
          </div>
          <h2>Sign in</h2>
          <p>Login to manage projects, income and expense</p>
          <div className="card-arrow">
            <i className="fas fa-arrow-right" aria-hidden />
          </div>
        </Link>
      </div>
    </div>
  );
}
