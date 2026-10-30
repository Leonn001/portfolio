import 'server-only';
import postgres from 'postgres';

const globalParaDev = globalThis as unknown as { sql?: postgres.Sql };

// Uma conexão por instância; no dev o hot reload reaproveita a mesma.
export const sql =
  globalParaDev.sql ??
  postgres(process.env.DATABASE_URL ?? '', {
    max: 5,
    idle_timeout: 20,
    prepare: false, // pooler do Neon não aceita prepared statements
    onnotice: () => {},
  });

if (process.env.NODE_ENV !== 'production') globalParaDev.sql = sql;
