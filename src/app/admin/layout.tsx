import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Painel', robots: { index: false, follow: false } };

// As páginas do painel leem o cookie de sessão; o Suspense aqui cobre todas elas.
export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <Suspense fallback={<p className="wrap" style={{ padding: '80px 20px', color: 'var(--texto-3)' }}>Carregando…</p>}>
      {children}
    </Suspense>
  );
}
