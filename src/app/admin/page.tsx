import Link from 'next/link';
import { listarTodos } from '@/lib/posts';
import { contarPendentes } from '@/lib/recomendacoes';
import { exigirAdmin } from '@/lib/sessao';
import { dataCurta } from '@/lib/texto';
import { Barra } from './Barra';

export default async function AdminPage() {
  await exigirAdmin();
  const [posts, pendentes] = await Promise.all([listarTodos(), contarPendentes()]);

  return (
    <>
      <Barra pendentes={pendentes} />
      <main className="wrap" style={{ padding: '40px 20px 80px' }}>
        {pendentes > 0 && (
          <Link href="/admin/recomendacoes" className="aviso" style={{ display: 'block', marginBottom: 24 }}>
            {pendentes === 1 ? 'Chegou 1 recomendação nova' : `Chegaram ${pendentes} recomendações novas`} esperando você aprovar →
          </Link>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 650, letterSpacing: '-0.02em' }}>Posts</h1>
          <Link className="botao botao-primario" href="/admin/posts/novo">Novo post</Link>
        </div>
        {posts.length === 0 ? (
          <div className="cartao" style={{ textAlign: 'center', padding: 40 }}>
            <h3>Nenhum post ainda</h3>
            <p>Que tal começar contando como foi construir a LineAI?</p>
          </div>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {posts.map(p => (
              <li key={p.id}>
                <Link href={`/admin/posts/${p.id}`} className="cartao" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.titulo}</strong>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--texto-3)' }}>
                      /blog/{p.slug} · {p.publicadoEm ? `publicado em ${dataCurta(p.publicadoEm)}` : `editado em ${dataCurta(p.atualizadoEm)}`}
                    </span>
                  </span>
                  <span className={`chip chip-ponto${p.publicado ? '' : ' chip-cinza'}`}>{p.publicado ? 'Publicado' : 'Rascunho'}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
