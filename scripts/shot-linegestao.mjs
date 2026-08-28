// Captura telas autenticadas do Linegestao LOCAL com anonimização no DOM.
// Pré-requisitos: API local na 5298 iniciada com env Jwt__Key=<KEY>, ng serve na 4200,
// o print sai com nomes de cliente/usuário, e-mails, telefones, CNPJ e ICCID trocados por valores fictícios.
// Uso: node scripts/shot-linegestao.mjs <rota-sem-barra> <saida.png>
// A lista de nomes a trocar é montada DENTRO do browser (fetch na API com o token) e nunca vai para o disco.
//   env: LG_JWT_KEY, LG_USER_ID, LG_USER_EMAIL, LG_USER_NAME, LG_ROLE, LG_TENANT
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [route, out] = process.argv.slice(2);
const env = process.env;
const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const payload = {
  sub: env.LG_USER_ID, email: env.LG_USER_EMAIL, name: env.LG_USER_NAME,
  tenantId: env.LG_TENANT,
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': env.LG_ROLE,
  exp: now + 6 * 3600, iss: 'LineGestao', aud: 'LineGestao',
};
const head = b64({ alg: 'HS256', typ: 'JWT' }) + '.' + b64(payload);
const jwt = head + '.' + createHmac('sha256', env.LG_JWT_KEY).update(head).digest('base64url');

const width = 1680, height = 1000;
const port = 9400 + Math.floor(Math.random() * 300);
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const udd = mkdtempSync(join(tmpdir(), 'cdp-lg-'));
const proc = spawn(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${udd}`, `--window-size=${width},${height}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 40; i++) {
    try { const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); const t = list.find(x => x.type === 'page'); if (t) return t; } catch {}
    await sleep(250);
  }
  throw new Error('chrome não subiu');
}
const t = await getTarget();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map();
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;

await send('Page.enable');
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:4200/login' });
await sleep(4000);
await evalJs(`localStorage.setItem('token', ${JSON.stringify(jwt)}); localStorage.setItem('tokenExpiresAt', String(Date.now() + 6*3600*1000)); 'ok'`);
await send('Page.navigate', { url: 'http://localhost:4200/' + route });
await sleep(+(env.LG_WAIT || 14000));

// ---- anonimização no DOM ----
const anonScript = readFileSync(new URL('./anon-dom.js', import.meta.url), 'utf-8');
const result = await evalJs(anonScript);
await sleep(600);
const title = await evalJs('document.title + " @ " + location.pathname');
const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log(`ok ${out} [${title}] anon: ${result}`);
ws.close(); proc.kill();
