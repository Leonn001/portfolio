// Screenshot de página inteira via CDP (Node >= 22, sem dependências).
// Uso: node scripts/shot.mjs <url> <largura> <altura> <saida.png> [dark]
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, wArg, hArg, out, dark] = process.argv.slice(2);
const width = +wArg || 1440, height = +hArg || 900;
const port = 9333 + Math.floor(Math.random() * 400);
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const udd = mkdtempSync(join(tmpdir(), 'cdp-'));
const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${udd}`, `--window-size=${width},${height}`];
if (dark === 'dark') args.push('--force-dark-mode', '--enable-features=WebContentsForceDark:inversion_method/cielab_based,image_behavior/none');
const proc = spawn(chrome, [...args, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json`);
      const list = await r.json();
      const t = list.find(x => x.type === 'page');
      if (t) return t;
    } catch {}
    await sleep(250);
  }
  throw new Error('chrome não subiu');
}

const t = await getTarget();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map();
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Page.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: dark === 'dark' ? 'dark' : 'light' }] });
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700 });
await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() });
await sleep(1500);
// rola em passos para disparar o IntersectionObserver, depois volta ao topo
const total = (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.value;
for (let y = 0; y < total; y += Math.floor(height * 0.7)) {
  await send('Runtime.evaluate', { expression: `window.scrollTo({top: ${y}, behavior: 'instant'})` });
  await sleep(120);
}
await send('Runtime.evaluate', { expression: 'window.scrollTo({top: 0, behavior: "instant"})' });
await sleep(900);
const overflow = (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollWidth + "x" + window.innerWidth + " reveal=" + document.querySelectorAll(".reveal.is-in").length + "/" + document.querySelectorAll(".reveal").length + " scrollY=" + window.scrollY', returnByValue: true })).result.value;
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log(`ok ${out} height=${total} scrollWidth/innerWidth=${overflow}`);
ws.close(); proc.kill();
