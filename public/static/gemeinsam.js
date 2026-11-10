// Small helpers shared by all page scripts.
export const SPRACHE = document.documentElement.lang === 'en' ? 'en' : 'de';
export const ZAHL = SPRACHE === 'en' ? 'en-GB' : 'de-DE';

export const $ = (sel, wurzel = document) => wurzel.querySelector(sel);

export function lesen(schluessel) {
  try { return localStorage.getItem(schluessel); } catch { return null; }
}
export function schreiben(schluessel, wert) {
  try { localStorage.setItem(schluessel, wert); } catch { /* private mode: fine */ }
}

// Random, anonymous id so one browser has one vote per wish and one pledge per kind.
export function browserId() {
  let id = lesen('kontor-id');
  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    id = crypto.randomUUID();
    schreiben('kontor-id', id);
  }
  return id;
}

export function el(tag, attrs = {}, ...kinder) {
  const knoten = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') knoten.textContent = v;
    else if (k.startsWith('on')) knoten.addEventListener(k.slice(2), v);
    else if (v === true) knoten.setAttribute(k, '');
    else if (v !== false && v != null) knoten.setAttribute(k, v);
  }
  knoten.append(...kinder.filter((k) => k != null));
  return knoten;
}

export async function holen(pfad) {
  const antwort = await fetch(pfad);
  if (!antwort.ok) throw new Error(String(antwort.status));
  return antwort.json();
}

export async function senden(pfad, daten) {
  const antwort = await fetch(pfad, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...daten, _sprache: SPRACHE }),
  });
  const ergebnis = await antwort.json().catch(() => ({}));
  if (!antwort.ok) throw new Error(ergebnis.fehler || (SPRACHE === 'en' ? 'Something went wrong.' : 'Etwas ist schiefgegangen.'));
  return ergebnis;
}

export const zahl = (n) => Number(n).toLocaleString(ZAHL);

// Progress bars towards the thresholds (start page and join page).
export function schwellenZeichnen(ziel, stand, konfig) {
  const reihen = Object.entries(konfig.zusagen).map(([art, z]) => {
    const s = stand[art];
    const ist = art === 'spenden' ? s.summe : s.anzahl;
    const anteil = Math.min(100, Math.round((ist / z.schwelle) * 100));
    const wert = art === 'spenden'
      ? (SPRACHE === 'en' ? `€${zahl(ist)} / €${zahl(z.schwelle)} a month · ${zahl(s.anzahl)} pledges` : `${zahl(ist)} € / ${zahl(z.schwelle)} € im Monat · ${zahl(s.anzahl)} Zusagen`)
      : `${zahl(ist)} / ${zahl(z.schwelle)}`;
    return el('div', { class: 'schwelle' },
      el('div', { class: 'schwelle-kopf' }, el('strong', { text: z.titel[SPRACHE] }), el('span', { text: wert })),
      el('div', { class: 'balken', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(anteil), 'aria-label': z.titel[SPRACHE] },
        el('span', { style: `width:${anteil}%` })),
      el('p', { class: 'schwelle-text', text: z.schwelleText[SPRACHE].replace('{n}', zahl(z.schwelle)) }));
  });
  ziel.replaceChildren(...reihen);
}
