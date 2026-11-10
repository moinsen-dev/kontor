// Wishes with up/down votes. One vote per wish and browser; a second click on the same arrow takes it back.
import { $, el, holen, senden, browserId, zahl, SPRACHE } from './gemeinsam.js';

const T = {
  de: {
    hoch: 'Dafür stimmen', runter: 'Dagegen stimmen', zurueck: 'Stimme zurücknehmen',
    stimmen: (h, r) => `${zahl(h)} dafür · ${zahl(r)} dagegen`, vorschlag: 'Vorschlag aus der Gemeinschaft',
    ladeFehler: 'Die Wünsche konnten nicht geladen werden.', danke: 'Danke! Dein Vorschlag erscheint nach der Prüfung.',
    kurz: 'Bitte schreib zwischen 10 und 280 Zeichen.',
  },
  en: {
    hoch: 'Vote for', runter: 'Vote against', zurueck: 'Take your vote back',
    stimmen: (h, r) => `${zahl(h)} for · ${zahl(r)} against`, vorschlag: 'Suggested by the community',
    ladeFehler: 'The wishes could not be loaded.', danke: 'Thank you! Your suggestion will appear after review.',
    kurz: 'Please write between 10 and 280 characters.',
  },
}[SPRACHE];

const browser = browserId();
const liste = $('#wunsch-liste');

function titel(w) { return w[`titel_${SPRACHE}`] || w.titel_de || w.titel_en; }
function text(w) { return w[`text_${SPRACHE}`] || w.text_de || w.text_en || ''; }

function knopf(w, richtung) {
  const aktiv = w.meine === richtung;
  return el('button', {
    type: 'button', class: `stimme stimme-${richtung > 0 ? 'hoch' : 'runter'}${aktiv ? ' aktiv' : ''}`,
    'aria-pressed': aktiv ? 'true' : 'false',
    'aria-label': `${aktiv ? T.zurueck : richtung > 0 ? T.hoch : T.runter}: ${titel(w)}`,
    text: richtung > 0 ? '▲' : '▼',
    onclick: () => abstimmen(w, aktiv ? 0 : richtung),
  });
}

function zeichnen(wuensche) {
  liste.replaceChildren(...wuensche.map((w) => el('li', { class: 'wunsch' },
    el('div', { class: 'wunsch-stimmen' },
      knopf(w, 1),
      el('span', { class: 'wunsch-saldo', text: String(w.hoch - w.runter) }),
      knopf(w, -1)),
    el('div', { class: 'wunsch-inhalt' },
      el('h2', { class: 'wunsch-titel', text: titel(w) }),
      text(w) ? el('p', { text: text(w) }) : null,
      el('p', { class: 'wunsch-meta', text: T.stimmen(w.hoch, w.runter) + (w.quelle === 'vorschlag' ? ` · ${T.vorschlag}` : '') })))));
}

async function laden() {
  try {
    zeichnen(await holen(`/api/wuensche?browser=${browser}`));
  } catch {
    liste.textContent = T.ladeFehler;
  }
}

async function abstimmen(w, richtung) {
  try {
    await senden('/api/stimme', { wunsch: w.id, richtung, browser });
    await laden();
  } catch (e) {
    alert(e.message);
  }
}

const formular = $('#vorschlag');
formular.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fehler = $('.fehler', formular);
  const daten = new FormData(formular);
  const textWert = (daten.get('text') || '').trim();
  if (textWert.length < 10 || textWert.length > 280) { fehler.textContent = T.kurz; fehler.hidden = false; return; }
  try {
    await senden('/api/vorschlag', { text: textWert, _website: daten.get('_website') || '' });
    formular.replaceChildren(el('p', { class: 'danke', text: T.danke }));
  } catch (err) {
    fehler.textContent = err.message;
    fehler.hidden = false;
  }
});

laden();
