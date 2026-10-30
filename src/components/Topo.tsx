'use client';

import Link from 'next/link';
import { useState } from 'react';
import { perfil } from '@/conteudo/perfil';

const itens = [
  { href: '/#lineai', texto: 'LineAI' },
  { href: '/#projetos', texto: 'Projetos' },
  { href: '/blog', texto: 'Blog' },
  { href: '/recomendacoes', texto: 'Recomendações' },
  { href: '/#trajetoria', texto: 'Trajetória' },
];

export function Topo() {
  const [aberto, setAberto] = useState(false);
  const fechar = () => setAberto(false);

  return (
    <header className="topo">
      <div className="wrap topo-in">
        <Link href="/" className="marca" onClick={fechar}>
          <span className="marca-logo">L</span>
          <span>{perfil.nomeCurto}</span>
        </Link>
        <button
          type="button"
          className="menu-botao"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
          onClick={() => setAberto(v => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {aberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <nav className={`nav${aberto ? ' aberto' : ''}`} aria-label="Principal">
          {itens.map(i => (
            <Link key={i.href} href={i.href} onClick={fechar}>
              {i.texto}
            </Link>
          ))}
          <Link href="/#contato" className="nav-cta" onClick={fechar}>
            Contato
          </Link>
        </nav>
      </div>
    </header>
  );
}
