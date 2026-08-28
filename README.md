# Portfólio — Leon Nascimento Moreira

Site estático (HTML/CSS/JS, sem build) + currículo em PDF gerado do mesmo conteúdo.

- `index.html` — página única · `css/style.css` · `js/main.js`
- `cv.html` → `scripts/gerar-pdf.ps1` → `cv/leon-nascimento-moreira.pdf`
- `scripts/shot.mjs` — screenshot de página inteira via CDP (verificação visual)
- `scripts/shot-linegestao.mjs` + `anon-dom.js` — prints anonimizados do Linegestao local (ver cabeçalho do script)

Preview local: `python -m http.server 8765` na raiz. Deploy: `npx vercel --cwd . --prod`.
