// Gera o ADMIN_PASSWORD_HASH para o .env. Uso: node scripts/hash-senha.mjs "minha senha"
import { randomBytes, scryptSync } from 'node:crypto';

const senha = process.argv[2];
if (!senha || senha.length < 10) { console.error('Passe uma senha com pelo menos 10 caracteres.'); process.exit(1); }
const sal = randomBytes(16).toString('hex');
console.log(`${sal}:${scryptSync(senha, sal, 64).toString('hex')}`);
