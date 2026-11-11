import { FRAGEN, pruefen } from './fragen.js';
import { ZUSAGEN, FAEHIGKEITEN, BETRAEGE, zusagePruefen, zusagenAuswerten, wilson, BROWSER_ID } from './beteiligung.js';
import { LAENDER } from './laender.js';
import { routeFinden } from './seiten/layout.js';
import { start } from './seiten/start.js';
import { umfrage, wuensche, mitmachen } from './seiten/mitwirken.js';
import { grundsaetze } from './seiten/grundsaetze.js';
import { impressum, datenschutz } from './seiten/recht.js';
import { neuigkeiten, rss } from './seiten/neuigkeiten.js';
import { roadmap } from './seiten/roadmap.js';
import { abos, resend } from './abo.js';

const SEITEN = { start, umfrage, wuensche, mitmachen, roadmap, grundsaetze, neuigkeiten, impressum, datenschutz };

const SPALTEN = [
  'sprache', 'nutzung', 'rolle', 'branche', 'land', 'stoert', 'gebracht', 'besser_netz',
  'wuensche', 'wechsel', 'mitmachen', 'freitext_stoert', 'freitext_wunsch',
];

// Bots fill hidden fields and submit instantly; humans need a few seconds.
const MIN_SEKUNDEN = 8;

function json(daten, status = 200) {
  return new Response(JSON.stringify(daten), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function html(text, status = 200) {
  return new Response(text, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
    },
  });
}

async function lesen(request) {
  try { return await request.json(); } catch { return null; }
}

// Cloudflare rate limiting by client IP; nothing is stored by us. Missing binding = no limit (local tests).
async function gebremst(request, env) {
  if (!env.LIMIT) return false;
  const ip = request.headers.get('cf-connecting-ip') || 'lokal';
  const { success } = await env.LIMIT.limit({ key: ip });
  return !success;
}

async function antwortSpeichern(request, env) {
  const body = await lesen(request);
  if (!body) return json({ fehler: 'Ungültige Daten. / Invalid data.' }, 400);
  const dauer = Number(body._dauer);
  if (body._website || !Number.isFinite(dauer) || dauer < MIN_SEKUNDEN) return json({ ok: true });
  const geprueft = pruefen(body, body._sprache);
  if (!geprueft.ok) return json({ fehler: geprueft.fehler }, 400);
  const werte = SPALTEN.map((s) => geprueft.row[s] ?? null);
  await env.DB.prepare(
    `INSERT INTO antworten (${SPALTEN.join(', ')}) VALUES (${SPALTEN.map(() => '?').join(', ')})`,
  ).bind(...werte).run();
  return json({ ok: true });
}

async function schrittZaehlen(request, env) {
  const body = await lesen(request);
  const n = Number(body?.schritt);
  if (!Number.isInteger(n) || n < 0 || n > FRAGEN.length + 1) return json({ fehler: 'schritt' }, 400);
  await env.DB.prepare(
    'INSERT INTO schritte (schritt, anzahl) VALUES (?, 1) ON CONFLICT(schritt) DO UPDATE SET anzahl = anzahl + 1',
  ).bind(n).run();
  return json({ ok: true });
}

// Public results: counts per option only. Free text is never published.
async function ergebnisse(env) {
  const { results } = await env.DB.prepare(`SELECT ${FRAGEN.map((f) => f.key).join(', ')} FROM antworten`).all();
  const auswertung = {};
  for (const f of FRAGEN) {
    const zaehler = Object.fromEntries(Object.keys(f.optionen).map((k) => [k, 0]));
    let beantwortet = 0;
    for (const zeile of results) {
      const wert = zeile[f.key];
      if (wert == null) continue;
      beantwortet++;
      const liste = f.typ === 'mehrere' ? JSON.parse(wert) : [wert];
      for (const w of liste) if (w in zaehler || f.typ === 'land') zaehler[w] = (zaehler[w] || 0) + 1;
    }
    auswertung[f.key] = { beantwortet, zaehler };
  }
  return json({ gesamt: results.length, auswertung });
}

async function wunschListe(request, env) {
  const browser = new URL(request.url).searchParams.get('browser') || '';
  const { results } = await env.DB.prepare(`
    SELECT w.id, w.titel_de, w.titel_en, w.text_de, w.text_en, w.quelle, w.reihenfolge,
           COALESCE(SUM(s.richtung = 1), 0) AS hoch, COALESCE(SUM(s.richtung = -1), 0) AS runter,
           MAX(CASE WHEN s.browser = ?1 THEN s.richtung END) AS meine
    FROM wuensche w LEFT JOIN stimmen s ON s.wunsch_id = w.id
    WHERE w.freigegeben = 1
    GROUP BY w.id`).bind(BROWSER_ID.test(browser) ? browser : '').all();
  const liste = results
    .map((w) => ({ ...w, wert: wilson(w.hoch, w.runter) }))
    .sort((a, b) => b.wert - a.wert || (b.hoch - b.runter) - (a.hoch - a.runter) || a.reihenfolge - b.reihenfolge);
  return json(liste);
}

async function stimmeAbgeben(request, env) {
  const body = await lesen(request);
  const richtung = Number(body?.richtung);
  if (!BROWSER_ID.test(body?.browser || '') || ![-1, 0, 1].includes(richtung) || typeof body?.wunsch !== 'string') {
    return json({ fehler: 'Ungültige Stimme. / Invalid vote.' }, 400);
  }
  const wunsch = await env.DB.prepare('SELECT id FROM wuensche WHERE id = ? AND freigegeben = 1').bind(body.wunsch).first();
  if (!wunsch) return json({ fehler: 'Unbekannter Wunsch. / Unknown wish.' }, 404);
  if (richtung === 0) {
    await env.DB.prepare('DELETE FROM stimmen WHERE wunsch_id = ? AND browser = ?').bind(body.wunsch, body.browser).run();
  } else {
    await env.DB.prepare(`INSERT INTO stimmen (wunsch_id, browser, richtung) VALUES (?, ?, ?)
      ON CONFLICT(wunsch_id, browser) DO UPDATE SET richtung = excluded.richtung`).bind(body.wunsch, body.browser, richtung).run();
  }
  return json({ ok: true });
}

async function vorschlagSpeichern(request, env) {
  const body = await lesen(request);
  const en = body?._sprache === 'en';
  const text = typeof body?.text === 'string' ? body.text.trim().replace(/\s+/g, ' ') : '';
  if (body?._website) return json({ ok: true });
  if (text.length < 10 || text.length > 280) {
    return json({ fehler: en ? 'Please write between 10 and 280 characters.' : 'Bitte schreib zwischen 10 und 280 Zeichen.' }, 400);
  }
  const id = `v_${crypto.randomUUID().slice(0, 8)}`;
  await env.DB.prepare(`INSERT INTO wuensche (id, ${en ? 'titel_en' : 'titel_de'}, quelle, freigegeben, reihenfolge)
    VALUES (?, ?, 'vorschlag', 0, 500)`).bind(id, text).run();
  return json({ ok: true });
}

async function zusagenStand(request, env) {
  const browser = new URL(request.url).searchParams.get('browser') || '';
  const { results } = await env.DB.prepare('SELECT art, details, browser FROM zusagen').all();
  const meine = BROWSER_ID.test(browser) ? results.filter((z) => z.browser === browser).map((z) => z.art) : [];
  return json({ stand: zusagenAuswerten(results), meine, konfig: { zusagen: ZUSAGEN, faehigkeiten: FAEHIGKEITEN, betraege: BETRAEGE } });
}

async function zusageSpeichern(request, env) {
  const body = await lesen(request);
  if (!body) return json({ fehler: 'Ungültige Daten. / Invalid data.' }, 400);
  if (body._website) return json({ ok: true });
  if (body.zurueck === true && BROWSER_ID.test(body.browser || '') && body.art in ZUSAGEN) {
    await env.DB.prepare('DELETE FROM zusagen WHERE art = ? AND browser = ?').bind(body.art, body.browser).run();
    return json({ ok: true });
  }
  const geprueft = zusagePruefen(body, body._sprache);
  if (!geprueft.ok) return json({ fehler: geprueft.fehler }, 400);
  const z = geprueft.row;
  await env.DB.prepare(`INSERT INTO zusagen (art, browser, details, email, sprache) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(art, browser) DO UPDATE SET details = excluded.details, email = COALESCE(excluded.email, zusagen.email), sprache = excluded.sprache`)
    .bind(z.art, z.browser, z.details, z.email, z.sprache).run();
  return json({ ok: true });
}

// Mail delivery: Resend in production; MAILS=konsole prints mails to the dev console (local tests only).
function mailer(env) {
  if (env.RESEND_API_KEY) return resend(env.RESEND_API_KEY);
  if (env.MAILS === 'konsole') return async (mail) => { console.log(`MAIL an ${mail.to}: ${mail.subject}\n${mail.text}`); };
  return null;
}

function aboDienst(request, env) {
  const senden = mailer(env);
  return senden ? abos({ db: env.DB, senden, ursprung: new URL(request.url).origin }) : null;
}

async function aboAnmelden(request, env) {
  const body = await lesen(request);
  const dienst = aboDienst(request, env);
  const en = body?._sprache === 'en';
  if (!dienst) return json({ fehler: en ? 'E-mail updates are not available yet.' : 'E-Mail-Updates sind noch nicht eingerichtet.' }, 503);
  let ergebnis;
  try {
    ergebnis = await dienst.anmelden({ email: body?.email, einwilligung: body?.einwilligung === true, sprache: body?._sprache, website: body?._website || '' });
  } catch {
    return json({ fehler: en ? 'The confirmation e-mail could not be sent. Please try again later.' : 'Die Bestätigungsmail konnte nicht gesendet werden. Bitte versuch es später noch einmal.' }, 502);
  }
  if (ergebnis.status === 'ungueltig') return json({ fehler: en ? 'Please enter a valid e-mail address and tick the consent box.' : 'Bitte gib eine gültige E-Mail-Adresse an und setze den Haken bei der Einwilligung.' }, 400);
  if (ergebnis.status === 'ausgelastet') return json({ fehler: en ? 'Too many sign-ups right now. Please try again in an hour.' : 'Gerade sind es zu viele Anmeldungen. Bitte versuch es in einer Stunde noch einmal.' }, 429);
  return json({ ok: true });
}

async function aboBestaetigen(request, env) {
  const body = await lesen(request);
  const dienst = aboDienst(request, env);
  if (!dienst) return json({ status: 'ungueltig' }, 503);
  const ergebnis = await dienst.bestaetigen(body?.token);
  return json(ergebnis, ergebnis.status === 'bestaetigt' ? 200 : 400);
}

// Also the one-click target of the List-Unsubscribe header (token in the query string).
async function aboAbmelden(request, env) {
  const body = await lesen(request);
  const token = new URL(request.url).searchParams.get('token') || body?.token;
  const ergebnis = await abos({ db: env.DB, senden: async () => {}, ursprung: '' }).abmelden(token);
  return json(ergebnis, ergebnis.status === 'abgemeldet' ? 200 : 400);
}

const API = {
  'GET /api/fragen': () => json(FRAGEN.map((f) => (f.typ === 'land' ? { ...f, laender: LAENDER } : f))),
  'GET /api/ergebnisse': (r, env) => ergebnisse(env),
  'POST /api/antwort': antwortSpeichern,
  'POST /api/schritt': schrittZaehlen,
  'GET /api/wuensche': wunschListe,
  'POST /api/stimme': stimmeAbgeben,
  'POST /api/vorschlag': vorschlagSpeichern,
  'GET /api/zusagen': zusagenStand,
  'POST /api/zusage': zusageSpeichern,
  'POST /api/abo': aboAnmelden,
  'POST /api/abo/bestaetigen': aboBestaetigen,
  'POST /api/abo/abmelden': aboAbmelden,
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const handler = API[`${request.method} ${url.pathname}`];
      if (!handler) return json({ fehler: 'Nicht gefunden. / Not found.' }, 404);
      if (request.method === 'POST' && await gebremst(request, env)) {
        return json({ fehler: 'Zu viele Anfragen, bitte kurz warten. / Too many requests, please wait a moment.' }, 429);
      }
      return handler(request, env);
    }
    if (url.pathname === '/neuigkeiten.xml' || url.pathname === '/en/updates.xml') {
      return new Response(rss(url.pathname.startsWith('/en/') ? 'en' : 'de'), {
        headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=900' },
      });
    }
    const route = routeFinden(url.pathname);
    if (route) return html(SEITEN[route.seite](route.sprache));
    if (url.pathname === '/index.html') return Response.redirect(new URL('/', url), 301);
    return env.ASSETS.fetch(request);
  },

  // Daily: deletes addresses that were never confirmed, as promised in the mail and the privacy policy.
  async scheduled(_ereignis, env) {
    await abos({ db: env.DB, senden: async () => {}, ursprung: '' }).aufraeumen();
  },
};
