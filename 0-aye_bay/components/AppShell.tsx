'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/lib/navigation';
import { getAuthFromCookie, clearAuth } from '@/lib/data';

const TAB_LABELS: Record<string, string> = {
  projects: 'projects',
  income: 'income',
  expense: 'expense',
  reports: 'reports',
  admin: 'admin',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const locale = useLocale();
  const [auth, setAuth] = useState<ReturnType<typeof getAuthFromCookie>>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const a = getAuthFromCookie();
    setAuth(a);
    if (!a) router.replace('/login');
  }, [router]);

  function handleLogout() {
    clearAuth();
    router.replace('/login');
  }

  const sectionTitle = tab && TAB_LABELS[tab] ? t(TAB_LABELS[tab] as 'projects') : t('dashboard');
  const userInitial = auth?.name?.trim().charAt(0).toUpperCase() || '?';

  if (!auth) {
    return (
      <div className="page-center">
        <div className="loading-spinner" aria-hidden />
        <p className="loading">Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Link href="/dashboard?tab=projects" className="sidebar-header sidebar-header-link">
          <i className="fas fa-chart-line" aria-hidden />
          <h2>Aye-Bay</h2>
        </Link>
        <nav className="sidebar-nav">
          <span className="nav-group-label">Main</span>
          <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' && !tab ? 'active' : ''}`}>
            <i className="fas fa-home" aria-hidden />
            <span>{t('dashboard')}</span>
          </Link>
          <Link href="/dashboard?tab=projects" className={`nav-link ${tab === 'projects' ? 'active' : ''}`}>
            <i className="fas fa-folder" aria-hidden />
            <span>{t('projects')}</span>
          </Link>
          <Link href="/dashboard?tab=income" className={`nav-link ${tab === 'income' ? 'active' : ''}`}>
            <i className="fas fa-money-bill-wave" aria-hidden />
            <span>{t('income')}</span>
          </Link>
          <Link href="/dashboard?tab=expense" className={`nav-link ${tab === 'expense' ? 'active' : ''}`}>
            <i className="fas fa-receipt" aria-hidden />
            <span>{t('expense')}</span>
          </Link>
          <Link href="/dashboard?tab=reports" className={`nav-link ${tab === 'reports' ? 'active' : ''}`}>
            <i className="fas fa-chart-bar" aria-hidden />
            <span>{t('reports')}</span>
          </Link>
          {auth.role === 'admin' && (
            <>
              <span className="nav-group-label">Admin</span>
              <Link href="/dashboard?tab=admin" className={`nav-link ${tab === 'admin' ? 'active' : ''}`}>
                <i className="fas fa-user-shield" aria-hidden />
                <span>{t('admin')}</span>
              </Link>
            </>
          )}
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="nav-link" onClick={handleLogout} style={{ width: '100%', textAlign: 'left' }}>
            <i className="fas fa-sign-out-alt" aria-hidden />
            <span>{tCommon('logout')}</span>
          </button>
          <div className="sidebar-lang sidebar-lang-pills">
            <Link href={pathname} locale="en" className={locale === 'en' ? 'active' : ''}>EN</Link>
            <Link href={pathname} locale="bn" className={locale === 'bn' ? 'active' : ''}>বাং</Link>
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="header">
          <button
            type="button"
            className="menu-btn"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Menu"
          >
            <i className="fas fa-bars" aria-hidden />
          </button>
          <h1 className="header-title">{sectionTitle}</h1>
          <div className="header-user">
            <span className="header-avatar" aria-hidden>{userInitial}</span>
            <span className="header-user-name">{auth.name}</span>
          </div>
        </header>
        <div className="tab-content-wrap">
          {children}
        </div>
      </main>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        aria-hidden={!sidebarOpen}
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  );
}
