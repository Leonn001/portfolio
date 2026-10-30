// Teste de ponta a ponta no navegador (Chrome headless via CDP, sem dependências).
// Precisa do site rodando e do banco local. Uso:
//   node scripts/e2e.mjs http://localhost:3100 "senha do admin"
// Percorre: enviar recomendação → entrar no painel → publicar post → aprovar recomendação →
// conferir que os dois aparecem no site → limpar o que criou.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [base, senha] = process.argv.slice(2);
if (!base || !senha) { console.error('uso: node scripts/e2e.mjs <url> <senha>'); process.exit(1); }

const marca = `e2e-${Date.now()}`;
const port = 9333 + Math.floor(Math.random() * 400);
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const proc = spawn(chrome, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cdp-'))}`, '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

let alvo;
for (let i = 0; i < 40 && !alvo; i++) {
  try { alvo = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(x => x.type === 'page'); } catch { /* subindo */ }
  if (!alvo) await sleep(250);
}
const ws = new WebSocket(alvo.webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let seq = 0;
const pendentes = new Map();
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pendentes.has(m.id)) { pendentes.get(m.id)(m); pendentes.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++seq; pendentes.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const avaliar = async expr => {
  const r = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? 'erro no navegador');
  return r.result?.result?.value;
};
const ir = async url => { await send('Page.navigate', { url: base + url }); await sleep(1800); };
const esperar = async (cond, descricao, ms = 10000) => {
  for (let t = 0; t < ms; t += 250) { if (await avaliar(`return !!(${cond})`)) return; await sleep(250); }
  throw new Error(`não aconteceu: ${descricao}`);
};
// Preenche campo controlado pelo React (precisa do setter nativo + evento)
const preencher = (seletor, valor) => avaliar(`
  const el = document.querySelector(${JSON.stringify(seletor)});
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(valor)});
  el.dispatchEvent(new Event(el instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }));`);
const clicar = texto => avaliar(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(texto)}).click()`);
const texto = () => avaliar('return document.body.innerText');

let falhas = 0;
const passo = async (nome, fn) => {
  try { await fn(); console.log(`ok   ${nome}`); } catch (e) { falhas++; console.log(`FAIL ${nome}: ${e.message}`); }
};

await send('Page.enable');
await send('Runtime.enable');

await passo('formulário recusa recomendação curta', async () => {
  await ir('/recomendar');
  await preencher('#nome', 'Teste');
  await clicar('Enviar recomendação');
  await esperar(`document.body.innerText.includes('Escreva seu cargo.')`, 'erro de cargo');
});

await passo('envia recomendação válida', async () => {
  await ir('/recomendar');
  await preencher('#nome', `Pessoa ${marca}`);
  await preencher('#cargo', 'Analista');
  await preencher('#empresa', 'Empresa Teste');
  await preencher('#relacao', 'Trabalhamos juntos');
  await preencher('#texto', `Recomendação de teste ${marca}. Trabalhar com ele foi ótimo, entrega com cuidado.`);
  await clicar('Enviar recomendação');
  await esperar(`document.body.innerText.includes('Valeu demais')`, 'confirmação de envio');
});

await passo('recomendação pendente não aparece no mural', async () => {
  await ir('/recomendacoes');
  if ((await texto()).includes(marca)) throw new Error('apareceu antes de aprovar');
});

await passo('painel exige login', async () => {
  await ir('/admin');
  await esperar(`location.pathname === '/admin/login'`, 'redirecionar para o login');
});

await passo('senha errada é recusada', async () => {
  await preencher('#senha', 'senha-errada-123');
  await clicar('Entrar');
  await esperar(`document.body.innerText.includes('Senha incorreta.')`, 'mensagem de senha incorreta');
});

await passo('entra no painel', async () => {
  await preencher('#senha', senha);
  await clicar('Entrar');
  await esperar(`location.pathname === '/admin'`, 'chegar no painel');
});

await passo('cria e publica post', async () => {
  await ir('/admin/posts/novo');
  await preencher('#titulo', `Post ${marca}`);
  await preencher('textarea[aria-label="Texto do post"]', `## Olá\n\nTexto de teste ${marca} com **negrito** e conteúdo suficiente para publicar o post sem erro.`);
  await clicar('Publicar');
  await esperar(`/^\\/admin\\/posts\\/[0-9a-f-]{36}$/.test(location.pathname)`, 'ir para a página do post salvo');
  await esperar(`document.body.innerText.includes('Publicado')`, 'status publicado');
});

await passo('post aparece no blog e na página do post', async () => {
  await ir('/blog');
  if (!(await texto()).includes(`Post ${marca}`)) throw new Error('post não apareceu na lista');
  await ir(`/blog/post-${marca}`);
  await esperar(`document.querySelector('.prosa strong')?.textContent === 'negrito'`, 'markdown renderizado');
});

await passo('aprova recomendação e ela aparece no mural', async () => {
  await ir('/admin/recomendacoes');
  await avaliar(`
    const card = [...document.querySelectorAll('li')].find(li => li.innerText.includes(${JSON.stringify(marca)}));
    [...card.querySelectorAll('button')].find(b => b.textContent.startsWith('Aprovar')).click();`);
  await sleep(2000);
  await ir('/');
  if (!(await texto()).includes(marca)) throw new Error('não apareceu no mural da página inicial');
});

await passo('upload recusa quem não está logado', async () => {
  const r = await fetch(`${base}/api/upload`, { method: 'POST', body: new FormData() });
  if (r.status !== 401) throw new Error(`status ${r.status}`);
});

await passo('limpa: exclui recomendação e post de teste', async () => {
  await ir('/admin/recomendacoes');
  await avaliar(`
    const card = [...document.querySelectorAll('li')].find(li => li.innerText.includes(${JSON.stringify(marca)}));
    [...card.querySelectorAll('button')].find(b => b.textContent === 'Excluir').click();`);
  await sleep(2000);
  await ir('/admin');
  await avaliar(`[...document.querySelectorAll('a')].find(a => a.innerText.includes(${JSON.stringify(`Post ${marca}`)})).click()`);
  await sleep(2000);
  await send('Page.setInterceptFileChooserDialog', { enabled: false });
  await avaliar(`window.confirm = () => true; [...document.querySelectorAll('button')].find(b => b.textContent === 'Excluir post').click()`);
  await esperar(`location.pathname === '/admin'`, 'voltar ao painel');
  await ir('/');
  if ((await texto()).includes(marca)) throw new Error('ainda aparece no site');
});

ws.close();
proc.kill();
console.log(falhas ? `\n${falhas} falha(s)` : '\ntudo certo');
process.exit(falhas ? 1 : 0);
