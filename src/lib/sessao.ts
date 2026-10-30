import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE = 'admin_sessao';
const DURACAO_SEGUNDOS = 60 * 60 * 24 * 7;

function chave(): Uint8Array {
  const segredo = process.env.SESSION_SECRET;
  if (!segredo || segredo.length < 32) throw new Error('SESSION_SECRET ausente ou curto');
  return new TextEncoder().encode(segredo);
}

export async function abrirSessao(): Promise<void> {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_SEGUNDOS}s`)
    .sign(chave());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DURACAO_SEGUNDOS,
  });
}

export async function fecharSessao(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function estaLogado(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, chave(), { algorithms: ['HS256'] });
    return payload.admin === true;
  } catch {
    return false;
  }
}

/** Usar no topo de toda página e ação do admin. */
export async function exigirAdmin(): Promise<void> {
  if (!(await estaLogado())) redirect('/admin/login');
}

export async function ipDaRequisicao(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'local';
}
