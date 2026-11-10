import { FRAGEN, pruefen } from './fragen.js';

const SPALTEN = [
  'sprache', 'nutzung', 'rolle', 'land', 'stoert', 'gebracht', 'besser_netz',
  'wuensche', 'wechsel', 'mitmachen', 'freitext_stoert', 'freitext_wunsch',
];

// Bots fill hidden fields and submit instantly; humans need a few seconds for nine questions.
const MIN_SEKUNDEN = 8;

function json(daten, status = 200) {
  return new Response(JSON.stringify(daten), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function antwortSpeichern(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ fehler: 'Ungültige Daten. / Invalid data.' }, 400);
  }
  // Honeypot and timing: answer "ok" so bots learn nothing, but store nothing.
  const dauer = Number(body?._dauer);
  if (body?._website || !Number.isFinite(dauer) || dauer < MIN_SEKUNDEN) return json({ ok: true });

  const geprueft = pruefen(body, body?._sprache);
  if (!geprueft.ok) return json({ fehler: geprueft.fehler }, 400);

  const werte = SPALTEN.map((s) => geprueft.row[s] ?? null);
  await env.DB.prepare(
    `INSERT INTO antworten (${SPALTEN.join(', ')}) VALUES (${SPALTEN.map(() => '?').join(', ')})`,
  ).bind(...werte).run();
  return json({ ok: true });
}

// Public results: counts per option only. Free text is never published.
async function ergebnisse(env) {
  const { results } = await env.DB.prepare(
    `SELECT ${FRAGEN.map((f) => f.key).join(', ')} FROM antworten`,
  ).all();
  const auswertung = {};
  for (const f of FRAGEN) {
    const zaehler = Object.fromEntries(Object.keys(f.optionen).map((k) => [k, 0]));
    let beantwortet = 0;
    for (const zeile of results) {
      const wert = zeile[f.key];
      if (wert == null) continue;
      beantwortet++;
      const liste = f.typ === 'mehrere' ? JSON.parse(wert) : [wert];
      for (const w of liste) if (w in zaehler) zaehler[w]++;
    }
    auswertung[f.key] = { beantwortet, zaehler };
  }
  return json({ gesamt: results.length, auswertung });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/fragen' && request.method === 'GET') return json(FRAGEN);
    if (pathname === '/api/ergebnisse' && request.method === 'GET') return ergebnisse(env);
    if (pathname === '/api/antwort' && request.method === 'POST') return antwortSpeichern(request, env);
    if (pathname.startsWith('/api/')) return json({ fehler: 'Nicht gefunden.' }, 404);
    return env.ASSETS.fetch(request);
  },
};
