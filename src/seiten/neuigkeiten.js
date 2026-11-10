import { seite, ROUTEN, BASIS, esc } from './layout.js';
import { NEUIGKEITEN, absaetze } from '../neuigkeiten.js';
import { EINWILLIGUNG } from '../abo.js';

const TEXT = {
  de: {
    titel: 'Neuigkeiten – Kontor', beschreibung: 'Der Fortschritt von Kontor: Zwischenstand der Zusagen, Neuigkeiten und Updates per E-Mail oder RSS.',
    h1: 'Neuigkeiten und Fortschritt',
    einleitung: 'Hier siehst du, wie weit wir sind. Wenn du nichts verpassen willst, abonniere die Updates per E-Mail oder per RSS.',
    stand: 'Zwischenstand', aboTitel: 'Updates per E-Mail', email: 'E-Mail-Adresse', abonnieren: 'Abonnieren',
    aboHinweis: 'Du bekommst zuerst eine Mail mit einem Bestätigungslink (Double-Opt-In). Ohne Bestätigung löschen wir die Adresse nach sieben Tagen.',
    rss: 'Lieber ohne E-Mail? Abonniere den RSS-Feed', alle: 'Bisherige Neuigkeiten',
    datum: (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }),
  },
  en: {
    titel: 'Updates – Kontor', beschreibung: 'Kontor’s progress: pledges so far, news and updates by e-mail or RSS.',
    h1: 'News and progress',
    einleitung: 'This is where we are. If you don’t want to miss anything, subscribe to updates by e-mail or RSS.',
    stand: 'Progress so far', aboTitel: 'Updates by e-mail', email: 'E-mail address', abonnieren: 'Subscribe',
    aboHinweis: 'You will first get an e-mail with a confirmation link (double opt-in). Without confirmation we delete the address after seven days.',
    rss: 'Rather without e-mail? Subscribe to the RSS feed', alle: 'Past updates',
    datum: (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  },
};

const FEED = { de: '/neuigkeiten.xml', en: '/en/updates.xml' };
const verlinken = (text) => esc(text).replace(/https:\/\/[^\s)]+/g, (u) => `<a href="${u}">${u.replace('https://', '')}</a>`);

export function neuigkeiten(s) {
  const x = TEXT[s];
  const liste = NEUIGKEITEN.map((n) => `
    <article class="neuigkeit" id="n-${n.id}">
      <p class="vorzeile"><time datetime="${n.datum}">${x.datum(n.datum)}</time></p>
      <h3>${esc(n.titel[s])}</h3>
      ${absaetze(n.text[s]).map((a) => `<p>${verlinken(a)}</p>`).join('')}
    </article>`).join('');
  const inhalt = `
<section class="abschnitt">
  <div class="breite schmal">
    <h1>${x.h1}</h1>
    <p class="einleitung">${x.einleitung}</p>
    <div id="abo-ergebnis" class="danke" hidden></div>
    <h2>${x.stand}</h2>
    <div id="schwellen" class="schwellen"></div>
  </div>
</section>
<section class="abschnitt abschnitt-getoent" id="abonnieren">
  <div class="breite schmal">
    <h2>${x.aboTitel}</h2>
    <form id="abo-formular" class="abo-formular" novalidate>
      <label class="feld"><span class="feld-titel">${x.email}</span><input class="eingabe" type="email" name="email" autocomplete="email" required></label>
      <label class="einwilligung"><input type="checkbox" name="einwilligung" required><span>${esc(EINWILLIGUNG[s])}</span></label>
      <div class="falle" aria-hidden="true"><label>Website <input type="text" name="_website" tabindex="-1" autocomplete="off"></label></div>
      <p class="fehler" role="alert" hidden></p>
      <button class="knopf" type="submit">${x.abonnieren}</button>
    </form>
    <p class="hinweis">${x.aboHinweis} <a href="${ROUTEN.datenschutz[s]}">${s === 'de' ? 'Datenschutz' : 'Privacy'}</a></p>
    <p><a href="${FEED[s]}">${x.rss}</a></p>
  </div>
</section>
<section class="abschnitt">
  <div class="breite schmal">
    <h2>${x.alle}</h2>
    ${liste}
  </div>
</section>`;
  return seite({ id: 'neuigkeiten', sprache: s, titel: x.titel, beschreibung: x.beschreibung, inhalt, skript: 'neuigkeiten.js',
    kopfZusatz: `<link rel="alternate" type="application/rss+xml" title="Kontor" href="${BASIS}${FEED[s]}">` });
}

export function rss(s) {
  const x = TEXT[s];
  const xml = (v) => esc(v).replaceAll("'", '&apos;');
  const eintraege = NEUIGKEITEN.map((n) => `
  <item>
    <title>${xml(n.titel[s])}</title>
    <link>${BASIS}${ROUTEN.neuigkeiten[s]}#n-${n.id}</link>
    <guid isPermaLink="false">kontor-${n.id}-${s}</guid>
    <pubDate>${new Date(`${n.datum}T08:00:00Z`).toUTCString()}</pubDate>
    <description>${xml(absaetze(n.text[s]).join('\n\n'))}</description>
  </item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Kontor – ${xml(x.h1)}</title>
  <link>${BASIS}${ROUTEN.neuigkeiten[s]}</link>
  <description>${xml(x.beschreibung)}</description>
  <language>${s}</language>${eintraege}
</channel>
</rss>`;
}
