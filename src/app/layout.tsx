import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { perfil } from '@/conteudo/perfil';
import './globals.css';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leon-moreira.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${perfil.nome} · Engenheiro de Software`, template: `%s · ${perfil.nomeCurto}` },
  description: perfil.frase,
  icons: { icon: '/assets/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: `${perfil.nome} · Engenheiro de Software`,
    description: perfil.frase,
    images: ['/assets/og.jpg'],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
