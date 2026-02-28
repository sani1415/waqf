import { Suspense } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { AppShell } from '@/components/AppShell';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="page-center"><p className="loading">Loading...</p></div>}>
      <AppShell>
        <Dashboard />
      </AppShell>
    </Suspense>
  );
}
