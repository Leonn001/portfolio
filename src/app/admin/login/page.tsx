import { redirect } from 'next/navigation';
import { estaLogado } from '@/lib/sessao';
import { FormLogin } from './FormLogin';

export default async function LoginPage() {
  if (await estaLogado()) redirect('/admin');
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div className="cartao" style={{ width: '100%', maxWidth: 380, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="marca-logo">L</span>
          <strong>Painel do portfólio</strong>
        </div>
        <FormLogin />
      </div>
    </main>
  );
}
