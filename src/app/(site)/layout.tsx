import { Topo } from '@/components/Topo';
import { Rodape } from '@/components/Rodape';

export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only">Pular para o conteúdo</a>
      <Topo />
      <main id="conteudo">{children}</main>
      <Rodape />
    </>
  );
}
