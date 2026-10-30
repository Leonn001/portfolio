import { headers } from 'next/headers';
import { listarParaAdmin } from '@/lib/recomendacoes';
import { exigirAdmin } from '@/lib/sessao';
import { dataCurta } from '@/lib/texto';
import { moderarRecomendacao } from '../actions';
import { Barra } from '../Barra';
import { CopiarLink } from './CopiarLink';

const rotulos = { pendente: 'Esperando aprovação', aprovada: 'No mural', oculta: 'Oculta' } as const;

export default async function RecomendacoesAdminPage() {
  await exigirAdmin();
  const todas = await listarParaAdmin();
  const pendentes = todas.filter(r => r.status === 'pendente').length;
  const h = await headers();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${h.get('host')}`;

  return (
    <>
      <Barra pendentes={pendentes} />
      <main className="wrap" style={{ padding: '40px 20px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 28, fontWeight: 650, letterSpacing: '-0.02em' }}>Recomendações</h1>
          <CopiarLink link={`${base}/recomendar`} />
        </div>

        {todas.length === 0 ? (
          <div className="cartao" style={{ textAlign: 'center', padding: 40 }}>
            <h3>Nenhuma recomendação ainda</h3>
            <p>Copie o link e mande para quem já trabalhou com você.</p>
          </div>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {todas.map(r => (
              <li key={r.id} className="cartao" style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: r.status === 'oculta' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <span>
                    <strong>{r.nome}</strong>
                    <span style={{ color: 'var(--texto-2)' }}> · {[r.cargo, r.empresa].filter(Boolean).join(' · ')}</span>
                    <span className="mono" style={{ display: 'block', fontSize: 12, color: 'var(--texto-3)' }}>
                      {r.relacao} · {dataCurta(r.criadaEm)}
                      {r.linkedin && <> · <a href={r.linkedin} target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>LinkedIn</a></>}
                    </span>
                  </span>
                  <span className={`chip chip-ponto${r.status === 'pendente' ? ' chip-ambar' : r.status === 'oculta' ? ' chip-cinza' : ''}`}>{rotulos[r.status]}</span>
                </div>
                <p style={{ whiteSpace: 'pre-line', color: '#d6d6e2' }}>{r.texto}</p>
                <form action={moderarRecomendacao} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input type="hidden" name="id" value={r.id} />
                  {r.status !== 'aprovada' && <button className="botao botao-pequeno botao-primario" name="acao" value="aprovar">Aprovar e mostrar no mural</button>}
                  {r.status === 'aprovada' && <button className="botao botao-pequeno" name="acao" value="ocultar">Tirar do mural</button>}
                  {r.status === 'pendente' && <button className="botao botao-pequeno" name="acao" value="ocultar">Não mostrar</button>}
                  <button className="botao botao-pequeno botao-perigo" name="acao" value="excluir">Excluir</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
