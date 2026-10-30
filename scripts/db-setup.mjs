// Cria as tabelas no banco de DATABASE_URL. Uso: npm run db:setup
import { readFileSync } from 'node:fs';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) { console.error('Defina DATABASE_URL (veja .env.example).'); process.exit(1); }

const sql = postgres(url, { max: 1, onnotice: () => {} });
await sql.unsafe(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'));
await sql.end();
console.log('Banco pronto.');
