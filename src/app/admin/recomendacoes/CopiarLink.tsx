'use client';

import { useState } from 'react';

export function CopiarLink({ link }: { link: string }) {
  const [copiado, setCopiado] = useState(false);
  const mensagem = `Oi! Estou montando um mural de recomendações no meu portfólio. Se puder escrever umas linhas sobre trabalhar comigo, ajuda demais: ${link}`;

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      prompt('Copie o link:', texto);
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button type="button" className="botao botao-pequeno" onClick={() => copiar(link)}>{copiado ? 'Copiado!' : 'Copiar link'}</button>
      <button type="button" className="botao botao-pequeno" onClick={() => copiar(mensagem)}>Copiar mensagem pronta</button>
      <a className="botao botao-pequeno" href={`https://wa.me/?text=${encodeURIComponent(mensagem)}`} target="_blank" rel="noopener">Mandar no WhatsApp</a>
    </div>
  );
}
