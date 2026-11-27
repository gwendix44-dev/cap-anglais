'use strict';
/* Cap — appli d'anglais personnelle (PWA). Progrès enregistrés en local (localStorage). */
const D = window.DATA;
const $ = (s, e = document) => e.querySelector(s);
const el = (t, a = {}, ...c) => {
  const n = document.createElement(t);
  for (const [k, v] of Object.entries(a || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  c.flat(9).forEach(x => { if (x == null || x === false) return; n.append(x.nodeType ? x : document.createTextNode(x)); });
  return n;
};
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.random() * a.length | 0];
const dstr = d => d.toLocaleDateString('sv');
const today = () => dstr(new Date());
const ydate = (n = 1) => { const d = new Date(); d.setDate(d.getDate() - n); return dstr(d); };
const norm = s => String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?;:"«»]+/g, ' ').replace(/\s+/g, ' ').trim();

const ICONS = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  path: '<path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7.5A2.5 2.5 0 0 1 5 17.5z"/><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H18"/>',
  games: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  stats: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  speaker: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  send: '<path d="M4 12l16-8-6 16-3-6z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z"/>'
};
const ic = (n, cls = '') => el('span', { class: 'ic ' + cls, 'aria-hidden': 'true', html: `<svg viewBox="0 0 24 24">${ICONS[n]}</svg>` });

/* ---------- État ---------- */
const KEY = 'cap.v1';
const GOAL = 10;
const defState = () => ({ v: 1, level: null, history: [], streak: { n: 0, last: null, best: 0 }, xp: 0, days: {}, items: {}, errors: {}, chap: {}, fixes: [], best: {}, chatCount: 0, settings: { voice: true, provider: 'free', key: '', model: 'claude-haiku-5-5' } });
let S;
try { S = Object.assign(defState(), JSON.parse(localStorage.getItem(KEY) || '{}')); S.settings = Object.assign(defState().settings, S.settings); } catch { S = defState(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* stockage plein ou bloqué */ } };

/* ---------- Registre des exercices ---------- */
const ITEMS = {};
const reg = (it, id) => { it.id = id; ITEMS[id] = it; return it; };
D.test.forEach((q, i) => reg(q, 't.' + i));
D.chapters.forEach(c => {
  c.ex.forEach((it, i) => reg(it, `c${c.id}.${i}`));
  c.reading.q.forEach((it, i) => reg(it, `c${c.id}.r${i}`));
});
D.toeic.forEach((q, i) => reg(q, 'p5.' + i));
D.verbs.forEach(v => {
  reg({ type: 'type', tag: 'verbs', q: `Prétérit (passé simple) de « ${v.base} » (${v.fr})`, ans: v.past.split('/'), exp: `${v.base} – ${v.past} – ${v.pp}`, speak: v.base }, `v.${v.base}.p`);
  reg({ type: 'type', tag: 'verbs', q: `Participe passé de « ${v.base} » (${v.fr})`, ans: v.pp.split('/'), exp: `${v.base} – ${v.past} – ${v.pp}`, speak: v.base }, `v.${v.base}.pp`);
});
D.spell.forEach((s, i) => reg({ type: 'mcq', tag: 'spell', q: `Quelle est la bonne orthographe ? (${s.fr})`, opts: [s.ok, s.ko], exp: `Bonne orthographe : ${s.ok}`, speak: s.ok }, 's.' + i));
D.vocab.forEach((w, i) => ['en', 'fr'].forEach(dir => reg({ type: 'vocab', tag: 'vocab', w, dir }, `w.${i}.${dir}`)));
S.fixes.forEach(f => reg(f, f.id));

function prepare(it) {
  if (it.type === 'mcq') return { ...it, opts: shuffle(it.opts), right: it.opts[0] };
  if (it.type === 'vocab') {
    const w = it.w, ans = it.dir === 'en' ? w.fr : w.en;
    const others = shuffle(D.vocab.filter(v => v !== w)).slice(0, 3).map(v => it.dir === 'en' ? v.fr : v.en);
    return { ...it, type: 'mcq', q: it.dir === 'en' ? `« ${w.en} » veut dire…` : `Comment dit-on « ${w.fr} » en anglais ?`, opts: shuffle([ans, ...others]), right: ans, exp: `${w.en} = ${w.fr}`, speak: w.en };
  }
  return it;
}

/* ---------- Révision espacée (boîtes de Leitner) ---------- */
const BOX_DAYS = [0, 1, 3, 7, 16, 35];
function record(it, ok, mode = 'all') {
  if (it.noSR || !ITEMS[it.id]) return;
  if (mode === 'wrong' && ok) return;
  const r = S.items[it.id] || (S.items[it.id] = { box: 0, due: 0, ok: 0, ko: 0 });
  if (ok) { r.ok++; r.box = Math.min(5, r.box + 1); } else { r.ko++; r.box = 0; S.errors[it.tag || 'gram'] = (S.errors[it.tag || 'gram'] || 0) + 1; }
  r.due = Date.now() + BOX_DAYS[r.box] * 864e5;
}
const dueIds = () => Object.entries(S.items).filter(([id, r]) => ITEMS[id] && r.due <= Date.now() && !(ITEMS[id].lvl && r.box > 0)).sort((a, b) => a[1].due - b[1].due).map(e => e[0]);

/* ---------- Série de jours ---------- */
const streakNow = () => (S.streak.last === today() || S.streak.last === ydate()) ? S.streak.n : 0;
function touchStreak(ok) {
  const t = today(), d = S.days[t] || (S.days[t] = { n: 0, ok: 0 });
  d.n++; if (ok) d.ok++;
  if (d.n >= GOAL && S.streak.last !== t) {
    S.streak.n = S.streak.last === ydate() ? S.streak.n + 1 : 1;
    S.streak.last = t; S.streak.best = Math.max(S.streak.best, S.streak.n);
    return true;
  }
  return false;
}

/* ---------- Niveau / TOEIC ---------- */
const LV = ['A1', 'A2', 'B1', 'B2', 'C1'];
const levelOf = e => LV[Math.max(0, Math.min(4, Math.round(e) - 1))];
const PTS = [[1, 170], [2, 385], [3, 665], [4, 860], [5, 950]];
function toeicOf(e) {
  e = Math.max(1, Math.min(5, e));
  for (let i = 1; i < PTS.length; i++) if (e <= PTS[i][0]) { const a = PTS[i - 1], b = PTS[i]; return Math.round((a[1] + (e - a[0]) * (b[1] - a[1]) / (b[0] - a[0])) / 5) * 5; }
  return 950;
}
const startIdx = () => S.level ? Math.max(1, Math.min(5, Math.round(S.level.est) - 0)) : 1;
const isUnlocked = id => id === 1 || !!(S.chap[id - 1] && S.chap[id - 1].done) || id <= startIdx();
const currentChapter = () => D.chapters.find(c => isUnlocked(c.id) && !(S.chap[c.id] && S.chap[c.id].done)) || D.chapters[D.chapters.length - 1];
const TAGS = { gram: 'Grammaire', vocab: 'Vocabulaire', verbs: 'Verbes irréguliers', spell: 'Orthographe', read: 'Compréhension', toeic: 'TOEIC', chat: 'Chat' };

/* ---------- Voix ---------- */
function speak(t) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t); u.lang = 'en-GB'; u.rate = .95;
  const vs = speechSynthesis.getVoices();
  const v = vs.find(v => /^en[-_]GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
function listen(onText, onEnd) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR(); r.lang = 'en-GB'; r.interimResults = true; r.continuous = false;
  r.onresult = e => onText([...e.results].map(x => x[0].transcript).join(' '));
  r.onend = onEnd; r.onerror = onEnd;
  try { r.start(); } catch { return null; }
  return r;
}
const speakBtn = t => el('button', { class: 'icon-btn small', 'aria-label': 'Écouter', onclick: e => { e.stopPropagation(); speak(t); } }, ic('speaker'));

/* ---------- Petits composants ---------- */
function toast(msg) {
  const t = el('div', { class: 'toast', role: 'status' }, msg); document.body.append(t);
  setTimeout(() => t.classList.add('out'), 2600); setTimeout(() => t.remove(), 3000);
}
function sheet(msg, buttons) {
  const bg = el('div', { class: 'sheet-bg' });
  const box = el('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true' }, el('p', {}, msg),
    el('div', { class: 'sheet-btns' }, buttons.map(b => el('button', { class: 'btn ' + (b.primary ? 'primary' : 'ghost'), onclick: () => { bg.remove(); b.fn && b.fn(); } }, b.label))));
  bg.append(box); document.body.append(bg);
}
const promptNodes = q => String(q).split(/(_{3,})/).map(p => /^_{3,}$/.test(p) ? el('span', { class: 'blank' }) : p);

/* ---------- Moteur de quiz (plein écran) ---------- */
function runQuiz(o) {
  const { next, total = 0, lives = 0, time = 0, feedback = true, record: recMode = 'all', onAnswer } = o;
  return new Promise(resolve => {
    const root = $('#play'); root.hidden = false; root.className = 'play'; document.body.classList.add('playing'); root.innerHTML = '';
    const bar = el('i'), lv = el('span', { class: 'lives', 'aria-label': 'Vies' }), tm = el('span', { class: 'timer' });
    const head = el('header', { class: 'play-head' }, el('button', { class: 'icon-btn', 'aria-label': 'Quitter', onclick: () => sheet('Quitter la séance ? Tes réponses déjà données sont conservées.', [{ label: 'Continuer', primary: true }, { label: 'Quitter', fn: () => finish('quit') }]) }, ic('x')), el('div', { class: 'bar' }, bar), lv, tm);
    const stage = el('main', { class: 'stage' }), dock = el('footer', { class: 'dock' });
    root.append(head, stage, dock);
    let answers = [], ended = false, livesLeft = lives, tleft = time, timer = null, cur = null;
    const drawLives = () => { if (lives) lv.replaceChildren(...Array.from({ length: lives }, (_, i) => el('b', { class: i < livesLeft ? 'on' : '' }))); };
    const drawBar = () => { const p = time ? tleft / time : total ? answers.length / total : 0; bar.style.width = Math.max(0, Math.min(1, p)) * 100 + '%'; if (time) tm.textContent = Math.max(0, Math.ceil(tleft)) + ' s'; else if (!total) tm.textContent = answers.filter(a => a.ok).length + ' ✓'; };
    drawLives(); drawBar();
    if (time) timer = setInterval(() => { tleft -= .25; drawBar(); if (tleft <= 0) finish('time'); }, 250);
    function finish(reason) {
      if (ended) return; ended = true; clearInterval(timer);
      resolve({ answers, reason, n: answers.length, ok: answers.filter(a => a.ok).length });
    }
    function submit(ok, correctText) {
      if (ended) return;
      answers.push({ item: cur, ok });
      record(cur, ok, recMode);
      S.xp += ok ? 10 : 2;
      const goal = touchStreak(ok);
      if (goal) setTimeout(() => toast(`Objectif du jour atteint · série de ${S.streak.n} jour${S.streak.n > 1 ? 's' : ''}`), 400);
      if (!ok && lives) { livesLeft--; drawLives(); }
      save(); drawBar();
      if (onAnswer) onAnswer(cur, ok);
      if (!feedback) { setTimeout(go, 160); return; }
      const msg = ok ? pick(['Bien joué', 'Exact', 'Parfait', 'Correct']) : 'À retenir';
      dock.className = 'dock show ' + (ok ? 'ok' : 'ko');
      dock.replaceChildren(el('div', { class: 'fb' }, el('div', { class: 'fb-title' }, ic(ok ? 'check' : 'x'), msg),
        !ok && correctText ? el('p', {}, 'Réponse : ', el('b', {}, correctText)) : null,
        cur.exp ? el('p', { class: 'exp' }, cur.exp) : null),
        el('div', { class: 'fb-actions' }, cur.speak ? speakBtn(cur.speak) : null, el('button', { class: 'btn primary', id: 'cont', onclick: cont }, 'Continuer')));
      const b = $('#cont'); b && b.focus({ preventScroll: true });
    }
    function cont() { if (lives && livesLeft <= 0) finish('lives'); else go(); }
    function go() {
      if (ended) return;
      dock.className = 'dock'; dock.replaceChildren();
      const it = next(); if (!it) return finish('done');
      cur = it; stage.replaceChildren(renderItem(it, submit)); stage.scrollTop = 0;
    }
    go();
  });
}

function renderItem(it, submit) {
  const wrap = el('div', { class: 'item' });
  const label = { mcq: 'Choisis la bonne réponse', type: 'Écris la réponse', order: 'Remets les mots dans l\'ordre', match: 'Relie les paires' }[it.type];
  wrap.append(el('p', { class: 'instr' }, label));
  if (it.type === 'mcq') {
    if (it.ctx) wrap.append(el('blockquote', { class: 'ctx' }, it.ctx, speakBtn(it.ctx)));
    wrap.append(el('p', { class: 'prompt' }, promptNodes(it.q)));
    const btns = it.opts.map(o => el('button', { class: 'opt', onclick: e => {
      btns.forEach(b => b.disabled = true);
      const ok = o === it.right; e.currentTarget.classList.add(ok ? 'ok' : 'ko');
      if (!ok) btns.find(b => b.textContent === it.right).classList.add('ok');
      submit(ok, it.right);
    } }, o));
    wrap.append(el('div', { class: 'opts' }, btns));
  }
  if (it.type === 'type') {
    wrap.append(el('p', { class: 'prompt' }, promptNodes(it.q)));
    const inp = el('input', { class: 'field', type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', 'aria-label': 'Ta réponse', placeholder: 'Écris en anglais' });
    const go = el('button', { class: 'btn primary wide', disabled: true }, 'Vérifier');
    const check = () => {
      if (inp.disabled || !inp.value.trim()) return; inp.disabled = true; go.disabled = true;
      const ok = it.ans.some(a => norm(a) === norm(inp.value)); inp.classList.add(ok ? 'ok' : 'ko'); submit(ok, it.ans.join(' / '));
    };
    inp.addEventListener('input', () => go.disabled = !inp.value.trim());
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    go.addEventListener('click', check);
    wrap.append(inp, go); setTimeout(() => inp.focus({ preventScroll: true }), 60);
  }
  if (it.type === 'order') {
    wrap.append(el('p', { class: 'prompt' }, it.fr));
    const words = it.en.split(' ').map((w, i) => ({ w, i }));
    let pool = shuffle(words); if (words.length > 1) for (let k = 0; k < 6 && pool.map(c => c.w).join(' ') === it.en; k++) pool = shuffle(words);
    const line = el('div', { class: 'line', 'aria-label': 'Ta phrase' }), tray = el('div', { class: 'tray' }), ans = [];
    const chk = el('button', { class: 'btn primary wide', disabled: true }, 'Vérifier');
    let done = false;
    const chip = (c, fn) => el('button', { class: 'chip-w', onclick: () => !done && fn() }, c.w);
    const draw = () => {
      line.replaceChildren(...ans.map(c => chip(c, () => { ans.splice(ans.indexOf(c), 1); pool.push(c); draw(); })));
      tray.replaceChildren(...pool.map(c => chip(c, () => { pool.splice(pool.indexOf(c), 1); ans.push(c); draw(); })));
      chk.disabled = !ans.length;
    };
    chk.addEventListener('click', () => {
      if (done) return; done = true; chk.disabled = true;
      const ok = norm(ans.map(c => c.w).join(' ')) === norm(it.en); line.classList.add(ok ? 'ok' : 'ko'); submit(ok, it.en);
    });
    draw(); wrap.append(line, tray, chk);
  }
  if (it.type === 'match') {
    const L = shuffle(it.pairs.map((p, i) => ({ t: p[0], i }))), Rr = shuffle(it.pairs.map((p, i) => ({ t: p[1], i })));
    let selL = null, selR = null, doneN = 0, mistakes = 0;
    const mk = (x, side) => el('button', { class: 'opt m', onclick: e => {
      const b = e.currentTarget; if (b.disabled) return;
      if (side === 'L') { selL && selL.b.classList.remove('sel'); selL = { x, b }; } else { selR && selR.b.classList.remove('sel'); selR = { x, b }; }
      b.classList.add('sel');
      if (selL && selR) {
        const a = selL, c = selR; selL = selR = null;
        if (a.x.i === c.x.i) { [a.b, c.b].forEach(k => { k.classList.remove('sel'); k.classList.add('ok'); k.disabled = true; }); if (++doneN === it.pairs.length) submit(mistakes <= 1, ''); }
        else { mistakes++; [a.b, c.b].forEach(k => { k.classList.add('shake'); setTimeout(() => k.classList.remove('shake', 'sel'), 380); }); }
      }
    } }, x.t);
    wrap.append(el('div', { class: 'cols' }, el('div', { class: 'col' }, L.map(x => mk(x, 'L'))), el('div', { class: 'col' }, Rr.map(x => mk(x, 'R')))));
  }
  return wrap;
}

function closePlay() { const r = $('#play'); r.hidden = true; r.innerHTML = ''; document.body.classList.remove('playing'); if ('speechSynthesis' in window) speechSynthesis.cancel(); render(); }
function screen(cls, ...nodes) { const r = $('#play'); r.hidden = false; r.className = 'play screen ' + cls; document.body.classList.add('playing'); r.replaceChildren(...nodes); }
const ring = (ratio, text) => { const r = 52, c = 2 * Math.PI * r; return el('div', { class: 'ring', role: 'img', 'aria-label': text, html: `<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="${r}" class="ring-bg"/><circle cx="60" cy="60" r="${r}" class="ring-fg" style="--c:${c.toFixed(1)};--o:${(c * (1 - Math.max(0, Math.min(1, ratio)))).toFixed(1)}"/></svg>` }, el('b', {}, text)); };
function resultScreen({ title, big, ratio, sub, rows = [], actions = [] }) {
  screen('result', el('div', { class: 'result-in' }, el('h2', {}, title), ratio !== undefined ? ring(ratio, String(big)) : big ? el('div', { class: 'big' }, big) : null, sub ? el('p', { class: 'lead' }, sub) : null,
    rows.length ? el('dl', { class: 'rows' }, rows.map(([k, v]) => [el('dt', {}, k), el('dd', {}, v)])) : null,
    el('div', { class: 'stack' }, actions.map(a => el('button', { class: 'btn ' + (a.primary ? 'primary' : 'ghost') + ' wide', onclick: a.fn || closePlay }, a.label)))));
}
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const playList = (list, o = {}) => { const q = [...list]; return runQuiz({ total: q.length, next: () => q.length ? prepare(q.shift()) : null, ...o }); };

/* ---------- Test de niveau adaptatif ---------- */
function levelTest() {
  screen('intro', el('div', { class: 'result-in' }, el('h2', {}, 'Test de niveau'),
    el('p', { class: 'lead' }, '30 questions, environ 8 minutes. Les questions s\'adaptent à tes réponses : si tu réussis, elles deviennent plus difficiles.'),
    el('p', { class: 'muted' }, 'Pas de correction pendant le test. Si tu hésites, choisis la réponse qui te semble la plus naturelle. Les erreurs seront reprises dans tes séances.'),
    el('div', { class: 'stack' }, el('button', { class: 'btn primary wide', onclick: startTest }, 'Commencer le test'), el('button', { class: 'btn ghost wide', onclick: closePlay }, 'Plus tard'))));
}
async function startTest() {
  const N = 30, pool = D.test; let theta = 2, step = .9, n = 0, last = null; const used = new Set(), hist = [];
  const res = await runQuiz({
    total: N, feedback: false, record: 'wrong',
    next: () => {
      if (n >= N) return null;
      const c = pool.filter(q => !used.has(q.id)).map(q => ({ q, s: Math.abs(q.lvl - theta) + (q.skill === last ? .35 : 0) + Math.random() * .5 })).sort((a, b) => a.s - b.s)[0];
      if (!c) return null; used.add(c.q.id); last = c.q.skill; return prepare(c.q);
    },
    onAnswer: (it, ok) => { hist.push({ lvl: it.lvl, ok, skill: it.skill }); theta = Math.max(.8, Math.min(5.4, theta + (ok ? step : -step))); step = Math.max(.22, step * .88); n++; }
  });
  if (res.reason === 'quit' && hist.length < 10) return closePlay();
  const lastN = hist.slice(-12), acc = lastN.filter(h => h.ok).length / (lastN.length || 1);
  const est = Math.max(1, Math.min(5.3, lastN.reduce((s, h) => s + h.lvl, 0) / (lastN.length || 1) + (acc - .5) * 1.2));
  const toeic = toeicOf(est), level = levelOf(est);
  S.level = { est, level, toeic, date: today() }; S.history.push({ date: today(), est, toeic, level }); save();
  const skills = ['gram', 'vocab', 'read'].map(k => { const h = hist.filter(x => x.skill === k); return [{ gram: 'Grammaire', vocab: 'Vocabulaire', read: 'Compréhension' }[k], `${h.filter(x => x.ok).length} / ${h.length}`]; });
  resultScreen({ title: 'Ton niveau estimé', big: level, sub: `Score TOEIC approximatif : environ ${toeic} (entre ${Math.max(10, toeic - 50)} et ${Math.min(990, toeic + 50)}). C'est une estimation : le test mesure surtout grammaire, vocabulaire et lecture.`,
    rows: skills, actions: [{ label: 'Voir mon parcours', primary: true, fn: () => { nav.tab = 'path'; nav.sub = null; closePlay(); } }, { label: 'Fermer', fn: closePlay }] });
}

/* ---------- Séance du jour ---------- */
function buildSession(size = 12) {
  const out = [], seen = new Set();
  const add = id => { const it = ITEMS[id]; if (it && !seen.has(id) && out.length < size) { seen.add(id); out.push(it); } };
  dueIds().slice(0, 4).forEach(add);
  S.fixes.filter(f => ((S.items[f.id] || {}).box || 0) < 3).slice(-2).forEach(f => add(f.id));
  const vids = D.verbs.flatMap(v => [`v.${v.base}.p`, `v.${v.base}.pp`]).filter(id => !seen.has(id) && (!S.items[id] || S.items[id].due <= Date.now()));
  shuffle(vids).slice(0, 3).forEach(add);
  const ch = currentChapter();
  shuffle([...ch.ex.map(x => x.id), ...ch.reading.q.map(x => x.id)]).sort((a, b) => ((S.items[a] || {}).box || 0) - ((S.items[b] || {}).box || 0)).slice(0, 4).forEach(add);
  const extra = shuffle([...D.toeic.map(x => x.id), ...D.vocab.map((_, i) => `w.${i}.${Math.random() < .5 ? 'en' : 'fr'}`), ...D.spell.map((_, i) => 's.' + i)]);
  extra.forEach(add);
  return shuffle(out);
}
async function startSession() {
  const list = buildSession(12); const res = await playList(list);
  if (res.reason === 'quit' && !res.n) return closePlay();
  const gained = res.ok * 10 + (res.n - res.ok) * 2, done = (S.days[today()] || { n: 0 }).n >= GOAL;
  resultScreen({ title: done ? 'Séance terminée' : 'Séance interrompue', big: `${res.ok} / ${res.n}`, ratio: res.ok / Math.max(1, res.n), sub: done ? `Objectif du jour atteint. Série en cours : ${streakNow()} jour${streakNow() > 1 ? 's' : ''}.` : `Encore ${Math.max(0, GOAL - (S.days[today()] || { n: 0 }).n)} exercices pour valider ta journée.`,
    rows: [['Réussite', pct(res.ok, res.n) + ' %'], ['Points gagnés', '+' + gained]],
    actions: [{ label: 'Terminer', primary: true }, { label: 'Refaire une séance', fn: startSession }] });
}

/* ---------- Jeux ---------- */
const bestKey = (k, v) => { const prev = S.best[k] || 0; if (v > prev) { S.best[k] = v; save(); return true; } return false; };
async function chrono(key, label, ids, secs = 60) {
  let pool = shuffle(ids), i = 0;
  const res = await runQuiz({ time: secs, feedback: false, next: () => { if (i >= pool.length) { pool = shuffle(ids); i = 0; } return prepare(ITEMS[pool[i++]]); } });
  if (!res.n) return closePlay();
  const rec = bestKey(key, res.ok);
  resultScreen({ title: label, big: res.ok, sub: `bonne${res.ok > 1 ? 's' : ''} réponse${res.ok > 1 ? 's' : ''} en ${secs} secondes sur ${res.n} tentative${res.n > 1 ? 's' : ''}.`, rows: [['Record', S.best[key] + (rec ? ' (nouveau)' : '')], ['Réussite', pct(res.ok, res.n) + ' %']], actions: [{ label: 'Rejouer', primary: true, fn: () => chrono(key, label, ids, secs) }, { label: 'Terminer' }] });
}
async function noFault(key, label, ids) {
  let pool = shuffle(ids), i = 0, streak = 0;
  const res = await runQuiz({ lives: 1, feedback: true, next: () => { if (i >= pool.length) { pool = shuffle(ids); i = 0; } return prepare(ITEMS[pool[i++]]); }, onAnswer: (it, ok) => { if (ok) streak++; } });
  const rec = bestKey(key, streak);
  resultScreen({ title: label, big: streak, sub: `réponse${streak > 1 ? 's' : ''} correcte${streak > 1 ? 's' : ''} d'affilée.`, rows: [['Record', S.best[key] + (rec ? ' (nouveau)' : '')]], actions: [{ label: 'Rejouer', primary: true, fn: () => noFault(key, label, ids) }, { label: 'Terminer' }] });
}
async function simpleSet(label, list, extra = {}) {
  const res = await playList(list, extra);
  if (!res.n) return closePlay();
  resultScreen({ title: label, big: `${res.ok} / ${res.n}`, ratio: res.ok / Math.max(1, res.n), sub: pct(res.ok, res.n) >= 80 ? 'Très bien. Les erreurs reviendront dans tes séances.' : 'Les erreurs reviendront dans tes séances pour les fixer.', actions: [{ label: 'Rejouer', primary: true, fn: () => simpleSet(label, list.map(x => x), extra) }, { label: 'Terminer' }] });
}
const verbIds = () => D.verbs.flatMap(v => [`v.${v.base}.p`, `v.${v.base}.pp`]);
const GAMES = [
  { title: 'Verbes irréguliers', sub: 'Forme du passé et participe passé', modes: [
    { label: 'Chrono 60 s', note: () => S.best['vb.chrono'] ? 'Record ' + S.best['vb.chrono'] : '', fn: () => chrono('vb.chrono', 'Verbes : chrono', verbIds()) },
    { label: 'Sans faute', note: () => S.best['vb.nf'] ? 'Record ' + S.best['vb.nf'] : '', fn: () => noFault('vb.nf', 'Verbes : sans faute', verbIds()) },
    { label: 'Révision espacée', note: () => dueIds().filter(i => i.startsWith('v.')).length + ' à revoir', fn: () => { let ids = dueIds().filter(i => i.startsWith('v.')); if (ids.length < 12) ids = ids.concat(shuffle(verbIds().filter(i => !S.items[i])).slice(0, 12 - ids.length)); simpleSet('Verbes : révision', ids.slice(0, 15).map(i => ITEMS[i])); } }] },
  { title: 'Orthographe', sub: 'Les fautes les plus courantes', modes: [
    { label: 'Chrono 60 s', note: () => S.best['sp.chrono'] ? 'Record ' + S.best['sp.chrono'] : '', fn: () => chrono('sp.chrono', 'Orthographe : chrono', D.spell.map((_, i) => 's.' + i)) },
    { label: 'Série de 15', fn: () => simpleSet('Orthographe', shuffle(D.spell.map((_, i) => ITEMS['s.' + i])).slice(0, 15)) }] },
  { title: 'Vocabulaire TOEIC', sub: 'Mots du bureau, du voyage et de l\'aviation', modes: [
    { label: 'QCM 15 mots', fn: () => simpleSet('Vocabulaire', shuffle(D.vocab.map((_, i) => ITEMS[`w.${i}.${Math.random() < .5 ? 'en' : 'fr'}`])).slice(0, 15)) },
    { label: 'Relier les paires', fn: () => simpleSet('Vocabulaire : paires', [0, 1, 2].map(() => ({ type: 'match', tag: 'vocab', noSR: true, id: 'm.' + Math.random(), pairs: shuffle(D.vocab).slice(0, 5).map(v => [v.en, v.fr]) }))) }] },
  { title: 'TOEIC : phrases à compléter', sub: 'Format de la partie 5', modes: [{ label: '10 questions', fn: () => simpleSet('TOEIC partie 5', shuffle(D.toeic.map(q => q)).slice(0, 10)) }] },
  { title: 'Compréhension écrite', sub: 'Un court texte, trois questions', modes: [{ label: 'Lire un texte', fn: () => { const c = pick(D.chapters); simpleSet('Compréhension : ' + c.reading.title, c.reading.q); } }] }
];

/* ---------- Chapitres ---------- */
const CH = id => S.chap[id] || (S.chap[id] = { lesson: false, practice: 0, reading: false, final: 0, done: false });
function stepsOf(c) {
  const st = CH(c.id);
  return [
    { k: 'lesson', label: 'Leçon et phrases utiles', note: 'Quelques minutes', done: st.lesson, open: true, fn: () => { nav.sub = { lesson: c.id }; render(); } },
    { k: 'practice', label: 'Exercices', note: st.practice ? `Meilleur score : ${st.practice} %` : '10 exercices', done: st.practice >= 60, open: st.lesson, fn: () => chapterPractice(c) },
    { k: 'reading', label: 'Compréhension', note: 'Un texte, 3 questions', done: st.reading, open: st.practice >= 60, fn: () => chapterReading(c) },
    { k: 'final', label: 'Défi final', note: st.final ? `Meilleur score : ${st.final} %` : '8 questions, 3 vies', done: st.done, open: st.practice >= 60 && st.reading, fn: () => chapterFinal(c) }
  ];
}
async function chapterPractice(c) {
  const res = await playList(c.ex), p = pct(res.ok, res.n), st = CH(c.id);
  if (!res.n) return closePlay();
  if (res.reason === 'done') st.practice = Math.max(st.practice, p); save();
  resultScreen({ title: 'Exercices terminés', big: `${res.ok} / ${res.n}`, ratio: res.ok / Math.max(1, res.n), sub: p >= 60 ? 'Étape validée.' : 'Il faut au moins 60 % pour valider. Réessaie, c\'est plus simple la deuxième fois.', actions: [{ label: p >= 60 ? 'Continuer' : 'Réessayer', primary: true, fn: () => { p >= 60 ? (nav.sub = { chap: c.id }, closePlay()) : chapterPractice(c); } }, { label: 'Retour', fn: () => { nav.sub = { chap: c.id }; closePlay(); } }] });
}
async function chapterReading(c) {
  const res = await playList(c.reading.q), st = CH(c.id);
  if (!res.n) return closePlay();
  const ok = res.ok >= 2; if (ok) st.reading = true; save();
  resultScreen({ title: 'Compréhension', big: `${res.ok} / ${res.n}`, ratio: res.ok / Math.max(1, res.n), sub: ok ? 'Étape validée.' : 'Relis le texte attentivement, il faut 2 bonnes réponses sur 3.', actions: [{ label: ok ? 'Continuer' : 'Réessayer', primary: true, fn: () => { ok ? (nav.sub = { chap: c.id }, closePlay()) : chapterReading(c); } }, { label: 'Retour', fn: () => { nav.sub = { chap: c.id }; closePlay(); } }] });
}
async function chapterFinal(c) {
  const list = shuffle([...c.ex.filter(x => x.type !== 'match'), ...c.reading.q]).slice(0, 8), st = CH(c.id);
  const res = await playList(list, { lives: 3 });
  if (!res.n) return closePlay();
  const p = pct(res.ok, 8); st.final = Math.max(st.final, res.reason === 'done' ? p : 0);
  const pass = res.reason === 'done' && res.ok >= 6; if (pass) st.done = true; save();
  const next = D.chapters.find(x => x.id === c.id + 1);
  resultScreen({ title: pass ? 'Chapitre réussi' : 'Défi manqué', big: `${res.ok} / 8`, ratio: res.ok / 8, sub: pass ? (next ? `Le chapitre « ${next.title} » est débloqué.` : 'Tu as terminé tout le parcours. Continue avec les jeux et le chat.') : 'Il faut 6 bonnes réponses sur 8 sans perdre les 3 vies. Relis la leçon si besoin.',
    actions: [{ label: pass ? 'Voir le parcours' : 'Réessayer', primary: true, fn: () => { if (pass) { nav.sub = null; closePlay(); } else chapterFinal(c); } }, { label: 'Retour', fn: () => { nav.sub = { chap: c.id }; closePlay(); } }] });
}

/* ---------- Chat avec correction ---------- */
const SCN = [
  { id: 'tourist', title: 'Discuter avec un touriste', sub: 'Voyage, aéroport, se repérer', role: 'a friendly tourist the user meets in an airport lounge. You are travelling and curious about the user.', first: "Hi there! Is this seat taken? I'm waiting for my flight to Edinburgh. Where are you headed?" },
  { id: 'interview', title: 'Entretien d\'embauche', sub: 'Poste d\'agent d\'accueil en aviation d\'affaires', role: 'a recruiter interviewing the user for a customer service agent job at a private aviation terminal (FBO) at Le Bourget. Ask ONE question at a time: motivation, experience, languages, handling difficult customers.', first: 'Good morning, and thank you for coming. Please have a seat. Could you start by telling me a little about yourself?' },
  { id: 'fbo', title: 'Accueillir un client de FBO', sub: 'Retard, voiture, demande de dernière minute', role: 'a polite but demanding business jet passenger arriving at an FBO. The user plays the FBO customer service agent. Create realistic situations one at a time: asking about your car, a delay, a last-minute catering or hotel request.', first: "Good afternoon. I'm Mr Berger, I have a flight to Nice at four o'clock. Is my aircraft ready?" },
  { id: 'free', title: 'Conversation libre', sub: 'Le sujet que tu veux', role: 'a friendly English conversation partner. Pick up on what the user says and ask follow-up questions.', first: 'Hi! What would you like to talk about today?' }
];
function sysPrompt(s) {
  const lvl = S.level ? S.level.level : 'A2';
  return `You are ${s.role} Speak natural English at CEFR ${lvl} level: short, clear sentences. Keep your reply to 1-3 sentences and end with a question when it fits.
The user is a French speaker learning English. Check ONLY the user's last message for mistakes (grammar, spelling, wrong word, unnatural phrasing). Ignore capital letters at the start and missing final punctuation.
Answer with ONLY a JSON object, no markdown: {"reply": string, "corrections": [{"wrong": string, "right": string, "why": string}], "better": string}
"wrong" = the faulty fragment copied from the user's message; "right" = the corrected fragment; "why" = one short explanation written in French. "better" = the user's whole message rewritten correctly, or "" if there is no mistake (then corrections is []).`;
}
async function askAI(scn, history, opts) {
  const msgs = history.map(m => ({ role: m.role, content: m.text }));
  if (msgs[0] && msgs[0].role === 'assistant') msgs.unshift({ role: 'user', content: '(Start the conversation.)' });
  const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 30000);
  try {
    let text;
    if (S.settings.provider === 'anthropic' && S.settings.key) {
      const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', signal: ctl.signal, headers: { 'content-type': 'application/json', 'x-api-key': S.settings.key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' }, body: JSON.stringify({ model: S.settings.model || 'claude-haiku-5-5', max_tokens: 600, system: sysPrompt(scn), messages: msgs }) });
      if (!r.ok) throw new Error('API ' + r.status);
      const j = await r.json(); text = (j.content || []).map(c => c.text || '').join('');
    } else {
      const call = () => fetch('https://text.pollinations.ai/openai', { method: 'POST', signal: ctl.signal, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model: 'openai', private: true, messages: [{ role: 'system', content: sysPrompt(scn) }, ...msgs] }) });
      let r = await call();
      if (r.status === 402) { // mode gratuit : 1 réponse toutes les 45 s
        const wait = Math.min(50, +((await r.text()).match(/Retry after (\d+)s/) || [])[1] || 45);
        if (opts && opts.onWait) opts.onWait(wait);
        await new Promise(res => setTimeout(res, (wait + 1) * 1000)); r = await call();
      }
      if (!r.ok) throw new Error('API ' + r.status);
      const j = await r.json(), m = (j.choices && j.choices[0] && j.choices[0].message) || {};
      text = m.content || (m.tool_calls && m.tool_calls[0] && m.tool_calls[0].function && m.tool_calls[0].function.arguments) || '';
    }
    return parseAI(text || '');
  } finally { clearTimeout(to); }
}
function parseAI(t) {
  const m = t.replace(/```json|```/g, '').match(/\{[\s\S]*\}/);
  if (m) { try { const j = JSON.parse(m[0]); return { reply: String(j.reply || '').trim() || '…', corrections: Array.isArray(j.corrections) ? j.corrections.filter(c => c && c.wrong && c.right) : [], better: String(j.better || '') }; } catch { /* texte brut */ } }
  return { reply: t.trim() || '…', corrections: [], better: '' };
}
function addFix(userText, c, better) {
  const sentence = (better || '').trim(); const words = sentence.split(/\s+/).filter(Boolean);
  const id = 'f.' + (sentence || c.right).toLowerCase().replace(/[^a-z]/g, '').slice(0, 40);
  if (ITEMS[id] || S.fixes.length > 80) return;
  const exp = `${c.wrong} → ${c.right}. ${c.why || ''}`.trim();
  const uw = new Set(userText.toLowerCase().match(/[a-z']+/g) || []), bw = sentence.toLowerCase().match(/[a-z']+/g) || [];
  const close = bw.length && bw.filter(w => uw.has(w)).length / bw.length >= .6; // la phrase corrigée doit rester proche du message
  const it = close && words.length >= 3 && words.length <= 12 ? { type: 'order', tag: 'chat', fr: 'Remets ta phrase corrigée dans l\'ordre.', en: sentence.replace(/[.!?]+$/, ''), exp } : { type: 'mcq', tag: 'chat', q: 'Quelle version est correcte ?', opts: [c.right, c.wrong], exp };
  it.id = id; S.fixes.push(it); reg(it, id);
}
function openChat(scn) {
  const hist = [{ role: 'assistant', text: scn.first }];
  const list = el('div', { class: 'msgs', 'aria-live': 'polite' });
  const ta = el('textarea', { class: 'field chat-in', rows: 1, placeholder: 'Écris en anglais…', 'aria-label': 'Ton message', autocapitalize: 'sentences' });
  const send = el('button', { class: 'icon-btn primary', 'aria-label': 'Envoyer' }, ic('send'));
  let mic = null, rec = null;
  const SRok = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  if (SRok) mic = el('button', { class: 'icon-btn', 'aria-label': 'Dicter en anglais', onclick: () => {
    if (rec) { rec.stop(); return; }
    mic.classList.add('live'); const base = ta.value ? ta.value + ' ' : '';
    rec = listen(t => { ta.value = base + t; }, () => { rec = null; mic.classList.remove('live'); });
    if (!rec) mic.classList.remove('live');
  } }, ic('mic'));
  const bubble = (role, text) => { const b = el('div', { class: 'bubble ' + role }, el('span', {}, text), role === 'assistant' ? speakBtn(text) : null); list.append(b); list.scrollTop = list.scrollHeight; return b; };
  const hdr = el('header', { class: 'play-head chat-head' }, el('button', { class: 'icon-btn', 'aria-label': 'Retour', onclick: () => { if (rec) rec.stop(); closePlay(); } }, ic('back')), el('div', { class: 'chat-title' }, el('b', {}, scn.title), el('span', {}, 'Corrections après chaque message')));
  const comp = el('div', { class: 'composer' }, mic, ta, send);
  screen('chat', hdr, list, comp);
  bubble('assistant', scn.first); if (S.settings.voice) speak(scn.first);
  let busy = false;
  ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight) + 'px'; });
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 700) { e.preventDefault(); go(); } });
  send.addEventListener('click', go);
  async function go() {
    const text = ta.value.trim(); if (!text || busy) return;
    if (!navigator.onLine) return toast('Le chat a besoin d\'une connexion Internet.');
    if (rec) rec.stop();
    busy = true; ta.value = ''; ta.style.height = 'auto';
    const ub = bubble('user', text); hist.push({ role: 'user', text });
    const typing = el('div', { class: 'bubble assistant typing', 'aria-label': 'Réponse en cours' }, el('i'), el('i'), el('i')); list.append(typing); list.scrollTop = list.scrollHeight;
    try {
      const out = await askAI(scn, hist.slice(-14), { onWait: s => { typing.setAttribute('aria-label', 'Attente'); list.append(el('p', { class: 'note wait' }, `Le mode gratuit accepte un message toutes les 45 secondes. Réponse dans ${s} s environ.`)); list.scrollTop = list.scrollHeight; } });
      list.querySelectorAll('.wait').forEach(n => n.remove());
      typing.remove(); S.chatCount++;
      const card = el('div', { class: 'corr' });
      if (out.corrections.length) {
        card.append(el('p', { class: 'corr-t' }, `${out.corrections.length} correction${out.corrections.length > 1 ? 's' : ''}`));
        out.corrections.forEach(c => { card.append(el('div', { class: 'corr-i' }, el('p', {}, el('s', {}, c.wrong), ' → ', el('b', {}, c.right)), c.why ? el('p', { class: 'why' }, c.why) : null)); addFix(text, c, out.better); S.errors.chat = (S.errors.chat || 0) + 1; });
        if (out.better) card.append(el('p', { class: 'better' }, 'Version corrigée : ', el('b', {}, out.better), speakBtn(out.better)));
      } else card.append(el('p', { class: 'corr-ok' }, ic('check'), 'Aucune faute dans ce message.'));
      ub.after(card); save();
      hist.push({ role: 'assistant', text: out.reply }); bubble('assistant', out.reply); if (S.settings.voice) speak(out.reply);
    } catch (e) {
      typing.remove(); hist.pop(); ta.value = text;
      list.append(el('div', { class: 'corr err' }, el('p', {}, S.settings.provider === 'anthropic' ? 'La réponse n\'est pas arrivée. Vérifie ta clé dans Progrès > Réglages, puis réessaie.' : 'La réponse n\'est pas arrivée. Vérifie ta connexion et réessaie dans un instant.')));
      list.scrollTop = list.scrollHeight;
    }
    busy = false;
  }
}

/* ---------- Vues ---------- */
const nav = { tab: 'home', sub: null };
const TABS = [['home', 'Aujourd\'hui'], ['path', 'Parcours'], ['games', 'Jeux'], ['chat', 'Chat'], ['stats', 'Progrès']];
function render() {
  const v = $('#view'); v.replaceChildren();
  const f = { home: viewHome, path: viewPath, games: viewGames, chat: viewChat, stats: viewStats }[nav.tab];
  v.append(f()); window.scrollTo(0, 0);
  $('#tabs').replaceChildren(...TABS.map(([k, l]) => el('button', { class: k === nav.tab ? 'on' : '', 'aria-current': k === nav.tab ? 'page' : false, onclick: () => { nav.tab = k; nav.sub = null; render(); } }, el('span', { class: 'pill' }, ic(k)), el('span', {}, l))));
}
const head = (t, sub, back) => el('header', { class: 'vhead' }, back ? el('button', { class: 'icon-btn', 'aria-label': 'Retour', onclick: back }, ic('back')) : null, el('div', {}, el('h1', {}, t), sub ? el('p', { class: 'muted' }, sub) : null));
const section = (...c) => el('section', { class: 'enter' }, ...c);
const rowBtn = (title, sub, fn, extra) => el('button', { class: 'row', onclick: fn }, el('div', { class: 'row-t' }, el('b', {}, title), sub ? el('span', {}, sub) : null), extra || null, ic('chevron', 'chev'));

function viewHome() {
  const t = S.days[today()] || { n: 0 }, done = t.n >= GOAL, sn = streakNow();
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); const k = dstr(d); return { k, on: (S.days[k] || { n: 0 }).n >= GOAL, today: i === 6, l: 'DLMMJVS'[d.getDay()] }; });
  const ch = currentChapter(), st = S.chap[ch.id];
  const hero = el('div', { class: 'pass' },
    el('div', { class: 'pass-main' },
      el('p', { class: 'kicker' }, done ? 'Objectif du jour atteint' : 'Séance du jour'),
      el('h2', {}, '12 exercices'),
      el('p', { class: 'pass-sub' }, 'Environ 12 minutes : révisions, verbes irréguliers et ton chapitre en cours.'),
      el('button', { class: 'btn light', onclick: startSession }, done ? 'Refaire une séance' : 'Commencer')),
    el('div', { class: 'pass-stub' },
      el('div', { class: 'streak' }, ic('flame'), el('b', {}, sn)),
      el('span', { class: 'streak-l' }, sn > 1 ? 'jours de suite' : 'jour de suite'),
      el('div', { class: 'week', 'aria-label': 'Les 7 derniers jours' }, week.map(w => el('span', { class: (w.on ? 'on ' : '') + (w.today ? 'today' : ''), title: w.k }, el('i'), el('em', {}, w.l)))),
      el('small', {}, `${Math.min(t.n, GOAL)} sur ${GOAL} aujourd'hui`)));
  return section(head('Aujourd\'hui', new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })),
    !S.level ? el('button', { class: 'banner', onclick: levelTest }, el('div', {}, el('b', {}, 'Commence par le test de niveau'), el('span', {}, '30 questions qui s\'adaptent à toi, pour régler ton parcours et estimer ton score TOEIC.')), ic('chevron', 'chev')) : null,
    hero,
    el('div', { class: 'panel' },
      rowBtn(`${ch.id}. ${ch.title}`, 'Chapitre en cours · ' + (st && st.practice ? `exercices ${st.practice} %` : ch.sub), () => { nav.tab = 'path'; nav.sub = { chap: ch.id }; render(); }),
      S.level ? el('div', { class: 'kv' }, el('div', {}, el('span', {}, 'Niveau estimé'), el('b', {}, S.level.level)), el('div', {}, el('span', {}, 'Score TOEIC estimé'), el('b', {}, '≈ ' + S.level.toeic))) : null));
}

function viewPath() {
  if (nav.sub && nav.sub.lesson) return viewLesson(D.chapters.find(c => c.id === nav.sub.lesson));
  if (nav.sub && nav.sub.chap) return viewChapter(D.chapters.find(c => c.id === nav.sub.chap));
  const cur = currentChapter();
  return section(head('Parcours', 'Six chapitres, du quotidien au travail en FBO.'),
    el('ol', { class: 'route' }, D.chapters.map(c => {
      const open = isUnlocked(c.id), done = !!(S.chap[c.id] && S.chap[c.id].done), n = stepsOf(c).filter(s => s.done).length;
      return el('li', { class: 'stop ' + (done ? 'done' : open ? (c.id === cur.id ? 'current' : 'open') : 'locked') },
        el('span', { class: 'node' }, done ? ic('check') : open ? String(c.id) : ic('lock')),
        el('button', { class: 'stop-card', onclick: () => open ? (nav.sub = { chap: c.id }, render()) : toast('Réussis le défi final du chapitre précédent pour débloquer celui-ci.') },
          el('div', { class: 'stop-top' }, el('h3', {}, c.title), el('span', { class: 'lvl' }, c.lvl)), el('p', { class: 'muted' }, c.sub),
          open ? el('div', { class: 'meter', 'aria-label': `${n} étapes sur 4` }, el('i', { style: `width:${n * 25}%` })) : null));
    })));
}
function viewChapter(c) {
  return section(head(`${c.id}. ${c.title}`, c.sub, () => { nav.sub = null; render(); }),
    el('div', { class: 'panel' }, stepsOf(c).map(s => el('button', { class: 'row step ' + (s.done ? 'done' : ''), disabled: !s.open, onclick: s.fn },
      el('span', { class: 'sicon' }, s.done ? ic('check') : s.open ? null : ic('lock')),
      el('div', { class: 'row-t' }, el('b', {}, s.label), el('span', {}, s.open ? s.note : 'Termine l\'étape précédente')), s.open ? ic('chevron', 'chev') : null))));
}
function viewLesson(c) {
  return section(head('Leçon', `${c.id}. ${c.title}`, () => { nav.sub = { chap: c.id }; render(); }),
    el('div', { class: 'panel pad prose' }, el('h3', {}, 'À retenir'), el('ul', {}, c.lesson.points.map(p => el('li', {}, p)))),
    el('div', { class: 'panel pad' }, el('h3', {}, 'Phrases utiles à dire à voix haute'), el('ul', { class: 'phr' }, c.lesson.phrases.map(([en, fr]) => el('li', {}, el('div', {}, el('b', {}, en), el('p', { class: 'muted' }, fr)), speakBtn(en))))),
    el('button', { class: 'btn primary wide', onclick: () => { CH(c.id).lesson = true; save(); nav.sub = { chap: c.id }; render(); } }, 'J\'ai compris, continuer'));
}

function viewGames() {
  return section(head('Jeux', 'Des séries courtes pour fixer ce qui compte.'),
    GAMES.map(g => el('div', { class: 'panel game' }, el('div', { class: 'panel-h' }, el('h3', {}, g.title), el('p', { class: 'muted' }, g.sub)),
      g.modes.map(m => el('button', { class: 'row', onclick: m.fn }, el('div', { class: 'row-t' }, el('b', {}, m.label)), m.note && m.note() ? el('span', { class: 'tag' }, m.note()) : null, ic('chevron', 'chev'))))));
}

function viewChat() {
  return section(head('Chat', 'Discute en anglais. Chaque faute est repérée et expliquée en français.'),
    el('div', { class: 'panel' }, SCN.map(s => rowBtn(s.title, s.sub, () => openChat(s)))),
    el('p', { class: 'note' }, 'Le chat est la seule partie qui demande une connexion. Tes erreurs reviennent ensuite dans les séances.'));
}

function viewStats() {
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { l: d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''), n: (S.days[dstr(d)] || { n: 0 }).n }; });
  const mx = Math.max(GOAL, ...days.map(d => d.n)), tot = Object.values(S.days).reduce((a, d) => ({ n: a.n + d.n, ok: a.ok + d.ok }), { n: 0, ok: 0 });
  const mastered = Object.entries(S.items).filter(([id, r]) => /^(v|w)\./.test(id) && r.box >= 3).length;
  const errs = Object.entries(S.errors).sort((a, b) => b[1] - a[1]).slice(0, 5), me = errs.length ? errs[0][1] : 1;
  const hist = S.history.slice(-8);
  const spark = hist.length > 1 ? (() => { const w = 260, h = 56, lo = Math.min(...hist.map(x => x.toeic)) - 20, hi = Math.max(...hist.map(x => x.toeic)) + 20; const pts = hist.map((x, i) => `${(i / (hist.length - 1) * w).toFixed(1)},${(h - (x.toeic - lo) / (hi - lo) * h).toFixed(1)}`).join(' '); return el('div', { html: `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Évolution du score TOEIC estimé"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>` }); })() : null;
  const set = S.settings;
  const keyIn = el('input', { class: 'field', type: 'password', placeholder: 'Clé API Anthropic', value: set.key, autocomplete: 'off', 'aria-label': 'Clé API Anthropic', onchange: e => { set.key = e.target.value.trim(); save(); } });
  const metric = (l, v, s) => el('div', { class: 'metric' }, el('span', {}, l), el('b', {}, v), s ? el('small', {}, s) : null);
  return section(head('Progrès'),
    el('div', { class: 'panel pad level' }, S.level ? [el('div', {}, el('span', { class: 'cap' }, 'Niveau estimé'), el('b', { class: 'huge' }, S.level.level), el('small', {}, 'Test du ' + new Date(S.level.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }))), el('div', {}, el('span', { class: 'cap' }, 'Score TOEIC estimé'), el('b', { class: 'huge' }, '≈ ' + S.level.toeic), spark)] : el('div', {}, el('h3', {}, 'Pas encore de test'), el('p', { class: 'muted' }, 'Le test donne ton niveau et ton score TOEIC estimé.'))),
    el('button', { class: 'btn ghost wide', onclick: levelTest }, S.level ? 'Refaire le test de niveau' : 'Passer le test de niveau'),
    el('div', { class: 'panel grid4' }, metric('Série en cours', streakNow(), `Record : ${S.streak.best}`), metric('Taux de réussite', tot.n ? pct(tot.ok, tot.n) + ' %' : '–', `${tot.n} réponses`), metric('Mots maîtrisés', mastered), metric('Messages au chat', S.chatCount)),
    el('div', { class: 'panel pad' }, el('h3', {}, '7 derniers jours'), el('div', { class: 'bars' }, days.map(d => el('div', {}, el('i', { style: `height:${Math.max(4, d.n / mx * 100)}%`, class: d.n >= GOAL ? 'on' : '' }), el('span', {}, d.l))))),
    el('div', { class: 'panel pad' }, el('h3', {}, 'Erreurs fréquentes'), errs.length ? errs.map(([k, v]) => el('div', { class: 'erow' }, el('span', {}, TAGS[k] || k), el('div', { class: 'meter' }, el('i', { style: `width:${v / me * 100}%` })), el('b', {}, v))) : el('p', { class: 'muted' }, 'Rien pour l\'instant. Les erreurs apparaîtront ici.')),
    el('div', { class: 'panel pad' }, el('h3', {}, 'Réglages'),
      el('label', { class: 'switch' }, el('input', { type: 'checkbox', checked: set.voice, onchange: e => { set.voice = e.target.checked; save(); } }), el('span', {}, 'Lire les réponses du chat à voix haute')),
      el('p', { class: 'muted' }, 'Le chat gratuit ne demande aucun compte, mais il est limité à un message toutes les 45 secondes. Avec une clé API Anthropic, les réponses sont rapides et plus fiables.'),
      el('div', { class: 'seg' }, ['free', 'anthropic'].map(p => el('button', { class: 'btn ' + (set.provider === p ? 'primary' : 'ghost'), onclick: () => { set.provider = p; save(); render(); } }, p === 'free' ? 'Gratuit' : 'Clé Anthropic'))),
      set.provider === 'anthropic' ? keyIn : null,
      el('div', { class: 'seg' }, el('button', { class: 'btn ghost', onclick: exportData }, 'Exporter mes données'), el('button', { class: 'btn ghost danger', onclick: () => sheet('Effacer tous tes progrès sur cet appareil ? Cette action est définitive.', [{ label: 'Annuler', primary: true }, { label: 'Tout effacer', fn: () => { S = defState(); save(); location.reload(); } }]) }, 'Réinitialiser'))));
}
function exportData() {
  const a = el('a', { href: URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' })), download: 'cap-progres-' + today() + '.json' });
  document.body.append(a); a.click(); a.remove();
}

/* ---------- Démarrage ---------- */
render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { });
document.addEventListener('visibilitychange', () => { if (!document.hidden && $('#play').hidden && nav.tab === 'home') render(); });
