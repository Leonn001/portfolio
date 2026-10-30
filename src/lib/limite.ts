import 'server-only';
import { sql } from './db';

/** Registra a tentativa e diz se o IP passou de `maximo` dentro de `minutos`. */
export async function passouDoLimite(tipo: string, ip: string, maximo: number, minutos: number): Promise<boolean> {
  const [{ total }] = await sql<{ total: number }[]>`
    select count(*)::int as total from tentativas
    where tipo = ${tipo} and ip = ${ip} and criado_em > now() - make_interval(mins => ${minutos})`;
  if (total >= maximo) return true;
  await sql`insert into tentativas (tipo, ip) values (${tipo}, ${ip})`;
  // limpeza oportunista
  await sql`delete from tentativas where criado_em < now() - interval '2 days'`;
  return false;
}
