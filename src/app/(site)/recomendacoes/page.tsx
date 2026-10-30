import type { Metadata } from 'next';
import Link from 'next/link';
import { CartaoRecomendacao } from '@/components/Cartoes';
import { listarAprovadas } from '@/lib/recomendacoes';

export const metadata: Metadata = {
  title: 'Recomendações',
  description: 'O que colegas, gestores e clientes dizem de trabalhar com o Leon.',
};

export default async function RecomendacoesPage() {
  const todas = await listarAprovadas();
  return (
    <section className="secao" style={{ paddingTop: 72 }}>
      <div className="wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 40 }}>
          <header className="secao-cabeca" style={{ marginBottom: 0 }}>
            <span className="rotulo">mural</span>
            <h1 className="titulo-secao" style={{ fontSize: 'clamp(34px, 5vw, 52px)' }}>O que dizem de trabalhar comigo</h1>
          </header>
          <Link className="botao botao-primario" href="/recomendar">Deixar uma recomendação</Link>
        </div>
        {todas.length > 0 ? (
          <div className="mural">
            {todas.map((r, i) => <CartaoRecomendacao key={r.id} r={r} i={Math.min(i, 8)} />)}
          </div>
        ) : (
          <div className="cartao" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h3>O mural está começando</h3>
            <p>Trabalhou ou estudou comigo? Sua recomendação vai ser a primeira daqui.</p>
          </div>
        )}
      </div>
    </section>
  );
}
