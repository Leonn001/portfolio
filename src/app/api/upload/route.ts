import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';
import { estaLogado } from '@/lib/sessao';

const TIPOS: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'application/pdf': 'pdf' };
const MAX_BYTES = 5 * 1024 * 1024;
const PASTAS = ['blog', 'certificados'];

/** Imagens dos posts e arquivos dos certificados. Na Vercel vão para o Blob; no computador, para public/uploads. */
export async function POST(req: Request) {
  if (!(await estaLogado())) return Response.json({ erro: 'Entre no painel de novo.' }, { status: 401 });

  const dados = await req.formData();
  const arquivo = dados.get('arquivo');
  const pasta = PASTAS.includes(String(dados.get('pasta'))) ? String(dados.get('pasta')) : 'blog';
  if (!(arquivo instanceof File)) return Response.json({ erro: 'Escolha uma imagem.' }, { status: 400 });
  const extensao = TIPOS[arquivo.type];
  if (!extensao || (extensao === 'pdf' && pasta !== 'certificados')) {
    return Response.json({ erro: pasta === 'certificados' ? 'Use PDF, PNG, JPG ou WEBP.' : 'Use PNG, JPG, WEBP ou GIF.' }, { status: 400 });
  }
  if (arquivo.size > MAX_BYTES) return Response.json({ erro: 'A imagem passa de 5 MB.' }, { status: 400 });

  const nome = `${pasta}/${randomUUID()}.${extensao}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(nome, arquivo, { access: 'public', contentType: arquivo.type });
    return Response.json({ url: blob.url });
  }

  if (process.env.NODE_ENV === 'production') {
    return Response.json({ erro: 'O armazenamento de imagens não está configurado.' }, { status: 503 });
  }
  const destino = path.join(process.cwd(), 'public', 'uploads', nome);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, Buffer.from(await arquivo.arrayBuffer()));
  return Response.json({ url: `/uploads/${nome}` });
}
