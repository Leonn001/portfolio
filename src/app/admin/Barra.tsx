import Link from 'next/link';
import { sair } from './actions';

export function Barra({ pendentes }: { pendentes?: number }) {
  return (
    <header className="topo">
      <div className="wrap topo-in">
        <Link href="/admin" className="marca">
          <span className="marca-logo">L</span>
          <span>Painel</span>
        </Link>
        <nav style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link className="botao botao-pequeno" href="/admin">Posts</Link>
          <Link className="botao botao-pequeno" href="/admin/recomendacoes">
            Recomendações{pendentes ? <span className="chip chip-ponto chip-ambar" style={{ height: 20, marginLeft: 4 }}>{pendentes}</span> : null}
          </Link>
          <Link className="botao botao-pequeno" href="/" target="_blank">Ver site ↗</Link>
          <form action={sair}>
            <button className="botao botao-pequeno" type="submit">Sair</button>
          </form>
        </nav>
      </div>
    </header>
  );
}
