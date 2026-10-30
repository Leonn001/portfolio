# Portfólio — Leon Nascimento Moreira

Next.js 16 (App Router, Cache Components) + Postgres. Site, blog com painel e mural de recomendações.

- `src/conteudo/perfil.ts` — todo o texto fixo do site
- `src/app/(site)` — páginas públicas: início, `/blog`, `/recomendacoes`, `/recomendar`
- `src/app/admin` — painel (`/admin`): escrever posts em Markdown e aprovar recomendações
- `db/schema.sql` — tabelas (`npm run db:setup` cria/atualiza)
- `cv.html` → `scripts/gerar-pdf.ps1` → `public/cv/leon-nascimento-moreira.pdf`

## Rodar local

1. `docker run -d --name portfolio-pg-local -e POSTGRES_PASSWORD=portfolio -e POSTGRES_DB=portfolio -p 5447:5432 postgres:17-alpine`
2. `cp .env.example .env.local` e preencher (senha: `node scripts/hash-senha.mjs "sua senha"`)
3. `npm install && npm run db:setup && npm run dev`

## Testes

- `npm test` — unidade (texto, validação, senha)
- `node scripts/e2e.mjs http://localhost:3000 "senha"` — navegador de ponta a ponta (recomendação, login, post, aprovação); limpa o que cria

## Publicar (Vercel)

Variáveis no projeto: `DATABASE_URL` (Storage → Neon), `BLOB_READ_WRITE_TOKEN` (Storage → Blob),
`ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`. Depois `npm run db:setup` apontando para o Neon.
