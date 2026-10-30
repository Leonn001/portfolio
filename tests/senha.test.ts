import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { senhaConfere } from '@/lib/senha';

const hash = execFileSync(process.execPath, ['scripts/hash-senha.mjs', 'senha-de-teste-123']).toString().trim();

describe('senhaConfere', () => {
  it('aceita a senha certa', () => {
    expect(senhaConfere('senha-de-teste-123', hash)).toBe(true);
  });
  it('recusa senha errada, vazia ou hash ausente', () => {
    expect(senhaConfere('senha-de-teste-124', hash)).toBe(false);
    expect(senhaConfere('', hash)).toBe(false);
    expect(senhaConfere('senha-de-teste-123', undefined)).toBe(false);
    expect(senhaConfere('senha-de-teste-123', 'lixo')).toBe(false);
  });
});
