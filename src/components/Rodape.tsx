import { perfil } from '@/conteudo/perfil';

export function Rodape() {
  return (
    <footer style={{ borderTop: '1px solid var(--borda)', padding: '32px 0 40px' }}>
      <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 13, color: 'var(--texto-3)' }}>
          {perfil.nome} · {perfil.local}
        </span>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 14, color: 'var(--texto-2)' }} aria-label="Contato">
          <a href={perfil.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <a href={perfil.github} target="_blank" rel="noopener">GitHub</a>
          <a href={perfil.whatsapp} target="_blank" rel="noopener">WhatsApp</a>
          <a href={`mailto:${perfil.email}`}>{perfil.email}</a>
        </nav>
      </div>
    </footer>
  );
}
