import { scryptSync, timingSafeEqual } from 'node:crypto';

/** Confere a senha contra "sal:hash" gerado por scripts/hash-senha.mjs. */
export function senhaConfere(senha: string, salvo: string | undefined): boolean {
  if (!salvo || !senha) return false;
  const [sal, hash] = salvo.split(':');
  if (!sal || !hash) return false;
  const esperado = Buffer.from(hash, 'hex');
  const calculado = scryptSync(senha, sal, esperado.length);
  return calculado.length === esperado.length && timingSafeEqual(calculado, esperado);
}
