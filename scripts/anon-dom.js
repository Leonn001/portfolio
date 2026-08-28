// Anonimiza o DOM da tela do Linegestao antes do screenshot. Avaliado dentro do browser via CDP.
(async () => {
  const token = localStorage.getItem('token');
  const h = { Authorization: 'Bearer ' + token };
  const clientes = new Set(), usuarios = new Set(), emails = new Set();
  const isC = k => /cliente|fantasia|razao|empresa|contato/i.test(k);
  const isU = k => /usuario|gestor|titular|responsavel|^nome$|^name$|nomeusuario/i.test(k);
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'string') {
        const t = v.trim();
        if (/@/.test(t)) { emails.add(t); continue; }
        if (t.length < 3 || /^\d[\d.\-\/ ]*$/.test(t)) continue;
        if (/cnpj|cpf|telefone|celular|iccid|linha|numero|status|estado|plano|operadora|modalidade|tipo|id$/i.test(k)) continue;
        if (isC(k)) clientes.add(t); else if (isU(k)) usuarios.add(t);
      } else if (v && typeof v === 'object') walk(v);
    }
  };
  for (const url of ['/api/clientes', '/api/lines', '/api/user-data', '/api/faturas', '/api/consumo']) {
    try { const r = await fetch('http://localhost:5298' + url, { headers: h }); if (r.ok) walk(await r.json()); } catch (e) {}
  }
  const esc = s => s.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
  const bySize = a => [...a].filter(Boolean).sort((a, b) => b.length - a.length);
  const mapC = new Map(); let ci = 0;
  const mapU = new Map(); let ui = 0;
  const reC = clientes.size ? new RegExp(bySize(clientes).map(esc).join('|'), 'gi') : null;
  const reU = usuarios.size ? new RegExp(bySize(usuarios).map(esc).join('|'), 'gi') : null;
  const rePhone = /\b(\d{2})\s?9?\s?\d{4}[- ]?\d{4}\b/g;
  const reCnpj = /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g;
  const reCpf = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g;
  const reIccid = /\b89\d{17,18}\b/g;
  const reEmailAny = /[\w.+-]+@[\w-]+\.[\w.]+/g;
  const fix = s => {
    if (reC) s = s.replace(reC, m => { const k = m.toLowerCase(); if (!mapC.has(k)) mapC.set(k, 'Cliente ' + String(++ci).padStart(2, '0')); return mapC.get(k); });
    if (reU) s = s.replace(reU, m => { const k = m.toLowerCase(); if (!mapU.has(k)) mapU.set(k, 'Usuário ' + String(++ui).padStart(2, '0')); return mapU.get(k); });
    s = s.replace(reEmailAny, 'contato@exemplo.com.br');
    s = s.replace(reCnpj, '00.000.000/0001-00').replace(reCpf, '000.000.000-00').replace(reIccid, m => m.slice(0, 6) + '•'.repeat(m.length - 10) + m.slice(-4));
    s = s.replace(rePhone, (m, ddd) => '(' + ddd + ') 9 0000-' + String(Math.floor(Math.random()*9000)+1000));
    return s;
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n, count = 0;
  while ((n = walker.nextNode())) { const v = n.nodeValue; if (v && v.trim()) { const f = fix(v); if (f !== v) { n.nodeValue = f; count++; } } }
  document.querySelectorAll('input, textarea').forEach(el => { const f = fix(el.value || ''); if (f !== el.value) el.value = f; });
  document.querySelectorAll('[title]').forEach(el => el.title = fix(el.title));
  return count + ' nós alterados; lista: clientes=' + clientes.size + ' usuarios=' + usuarios.size + ' emails=' + emails.size + '; trocados: C=' + mapC.size + ' U=' + mapU.size;
})()
