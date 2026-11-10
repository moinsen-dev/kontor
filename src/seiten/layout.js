// Shared HTML shell for all pages, in German and English.
export const REPO = 'https://github.com/moinsen-dev/kontor';
export const BASIS = 'https://kontor.moinsen.dev';

export const ROUTEN = {
  start: { de: '/', en: '/en/' },
  umfrage: { de: '/umfrage', en: '/en/survey' },
  wuensche: { de: '/wuensche', en: '/en/wishes' },
  mitmachen: { de: '/mitmachen', en: '/en/join' },
  grundsaetze: { de: '/grundsaetze', en: '/en/principles' },
  impressum: { de: '/impressum', en: '/en/imprint' },
  datenschutz: { de: '/datenschutz', en: '/en/privacy' },
};

// Path -> { seite, sprache }
export function routeFinden(pfad) {
  const sauber = pfad.length > 1 ? pfad.replace(/\/+$/, '') : pfad;
  for (const [seite, wege] of Object.entries(ROUTEN)) {
    if (sauber === wege.de) return { seite, sprache: 'de' };
    if (sauber === wege.en || (seite === 'start' && sauber === '/en')) return { seite, sprache: 'en' };
  }
  return null;
}

export const esc = (s) => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const NAV = {
  umfrage: { de: 'Umfrage', en: 'Survey' },
  wuensche: { de: 'Wünsche', en: 'Wishes' },
  mitmachen: { de: 'Mitmachen', en: 'Join' },
  grundsaetze: { de: 'Grundsätze', en: 'Principles' },
};

const FUSS = {
  de: { projekt: 'Kontor · ein Projekt von Ulrich Diedrichsen, Hamburg', quelle: 'Quellcode auf GitHub', impressum: 'Impressum', datenschutz: 'Datenschutz', andere: 'English' },
  en: { projekt: 'Kontor · a project by Ulrich Diedrichsen, Hamburg', quelle: 'Source on GitHub', impressum: 'Imprint', datenschutz: 'Privacy', andere: 'Deutsch' },
};

const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23a3472f'/%3E%3Cpath d='M9 8v16M9 16l9-8M9 16l9 8M21 8v16' stroke='%23fff' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";

export function seite({ id, sprache, titel, beschreibung, ogTitel, inhalt, skript, noindex = false }) {
  const s = sprache;
  const andere = s === 'de' ? 'en' : 'de';
  const hier = ROUTEN[id][s];
  const dort = ROUTEN[id][andere];
  const nav = Object.entries(NAV).map(([k, v]) =>
    `<a href="${ROUTEN[k][s]}"${k === id ? ' aria-current="page"' : ''}>${v[s]}</a>`).join('');
  const f = FUSS[s];
  return `<!doctype html>
<html lang="${s}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschreibung)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website">
<meta property="og:url" content="${BASIS}${hier}">
<meta property="og:title" content="${esc(ogTitel || titel)}">
<meta property="og:description" content="${esc(beschreibung)}">
<meta property="og:locale" content="${s === 'de' ? 'de_DE' : 'en_GB'}">
<link rel="alternate" hreflang="de" href="${BASIS}${ROUTEN[id].de}">
<link rel="alternate" hreflang="en" href="${BASIS}${ROUTEN[id].en}">
<link rel="alternate" hreflang="x-default" href="${BASIS}${ROUTEN[id].de}">
<link rel="stylesheet" href="/static/styles.css">
<link rel="icon" href="${ICON}">
</head>
<body>
<a class="sprungmarke" href="#inhalt">${s === 'de' ? 'Zum Inhalt' : 'Skip to content'}</a>
<header class="kopf">
  <div class="breite kopf-zeile">
    <a class="marke" href="${ROUTEN.start[s]}"><span class="marke-zeichen" aria-hidden="true">K</span> Kontor</a>
    <nav aria-label="${s === 'de' ? 'Hauptnavigation' : 'Main navigation'}">${nav}<a class="sprache" href="${dort}" hreflang="${andere}" lang="${andere}">${andere.toUpperCase()}</a></nav>
  </div>
</header>
<main id="inhalt">
${inhalt}
</main>
<footer class="fuss">
  <div class="breite fuss-zeile">
    <span>${f.projekt}</span>
    <span><a href="${REPO}">${f.quelle}</a> · <a href="${ROUTEN.impressum[s]}">${f.impressum}</a> · <a href="${ROUTEN.datenschutz[s]}">${f.datenschutz}</a> · <a href="${dort}" hreflang="${andere}" lang="${andere}">${f.andere}</a></span>
  </div>
</footer>
${skript ? `<script type="module" src="/static/${skript}"></script>` : ''}
</body>
</html>`;
}
