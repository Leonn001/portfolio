import type { Metadata } from 'next';
import Image from 'next/image';
import { perfil } from '@/conteudo/perfil';
import { FormRecomendacao } from './FormRecomendacao';

export const metadata: Metadata = {
  title: 'Deixar uma recomendação',
  description: 'Trabalhou ou estudou com o Leon? Deixe sua recomendação no mural.',
};

export default function RecomendarPage() {
  return (
    <section className="secao" style={{ paddingTop: 64 }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <header style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
          <Image src="/assets/foto.webp" alt="" width={72} height={72} style={{ borderRadius: '50%', border: '2px solid var(--violeta)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 240 }}>
            <span className="rotulo">mural de recomendações</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1.15, letterSpacing: '-0.03em', fontWeight: 650 }}>
              Escreve umas linhas sobre trabalhar comigo?
            </h1>
          </div>
        </header>
        <p className="subtitulo" style={{ marginBottom: 32 }}>
          Oi, aqui é o {perfil.nome.split(' ')[0]}. Estou montando um mural com quem já trabalhou ou estudou comigo. Sua recomendação aparece no meu
          portfólio depois que eu der uma olhada. Obrigado de verdade por tirar um minutinho para isso.
        </p>
        <div className="cartao" style={{ padding: 28 }}>
          <FormRecomendacao />
        </div>
      </div>
    </section>
  );
}
