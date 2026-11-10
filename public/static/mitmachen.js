// Join page: first choose what you want to do, then only that form appears.
// One pledge per kind and browser; it can be taken back. "Updates" subscribes by e-mail (double opt-in).
import { $, el, holen, senden, browserId, schwellenZeichnen, SPRACHE } from './gemeinsam.js';

const T = {
  de: {
    frage: 'Was möchtest du tun?', hinweisWahl: 'Wähle eine Möglichkeit – du kannst später weitere hinzufügen.',
    email: 'E-Mail (freiwillig)', emailPflicht: 'E-Mail (für die Einladung)',
    einwilligung: 'Ihr dürft mich unter dieser Adresse benachrichtigen, wenn eine Schwelle erreicht ist oder die Gründung ansteht. Widerruf jederzeit per E-Mail.',
    gebiete: 'Wobei kannst du helfen?', betrag: 'Wie viel würdest du geben?',
    zugesagt: 'Du hast zugesagt. Danke!', zuruecknehmen: 'Zusage zurücknehmen', ladeFehler: 'Der Stand konnte nicht geladen werden.',
    standTitel: 'Zwischenstand', erledigt: 'zugesagt',
    weiter: 'Was noch?', weiterText: 'Danke! Magst du noch etwas tun?',
    updates: { titel: 'Auf dem Laufenden bleiben', kurz: 'Updates per E-Mail, etwa einmal im Monat.', text: 'Wir schreiben dir, wenn sich etwas tut: Schwellen erreicht, Verein gegründet, erste Version online. Etwa einmal im Monat, jederzeit abbestellbar.' },
    aboEinwilligung: 'Ja, schickt mir Neuigkeiten zum Fortschritt von Kontor per E-Mail (höchstens etwa einmal im Monat). Keine Werbung, keine Weitergabe. Abmelden geht jederzeit mit einem Klick.',
    abonnieren: 'Updates abonnieren', aboGesendet: 'Fast geschafft: Bitte bestätige die Anmeldung über den Link in der Mail, die wir dir gerade geschickt haben.',
    aboHaken: 'Bitte setze den Haken bei der Einwilligung.', emailFeld: 'E-Mail-Adresse',
    kurz: { mitkommen: 'Profil anlegen, sobald es losgeht.', mitbauen: 'Zeit und Können einbringen.', spenden: 'Unverbindlich Geld zusagen.', gruenden: 'Den Verein mitgründen.' },
  },
  en: {
    frage: 'What would you like to do?', hinweisWahl: 'Pick one – you can add more later.',
    email: 'E-mail (optional)', emailPflicht: 'E-mail (for the invitation)',
    einwilligung: 'You may notify me at this address when a threshold is reached or the founding is coming up. I can withdraw this at any time by e-mail.',
    gebiete: 'Where can you help?', betrag: 'How much would you give?',
    zugesagt: 'You have pledged. Thank you!', zuruecknehmen: 'Take pledge back', ladeFehler: 'Progress could not be loaded.',
    standTitel: 'Progress so far', erledigt: 'pledged',
    weiter: 'Anything else?', weiterText: 'Thank you! Would you like to do anything else?',
    updates: { titel: 'Stay in the loop', kurz: 'Updates by e-mail, about once a month.', text: 'We’ll write when something happens: thresholds reached, association founded, first version online. About once a month, unsubscribe any time.' },
    aboEinwilligung: 'Yes, send me news about Kontor’s progress by e-mail (about once a month at most). No advertising, never passed on. Unsubscribe at any time with one click.',
    abonnieren: 'Subscribe to updates', aboGesendet: 'Almost done: please confirm via the link in the e-mail we just sent you.',
    aboHaken: 'Please tick the consent box.', emailFeld: 'E-mail address',
    kurz: { mitkommen: 'Create a profile once it starts.', mitbauen: 'Contribute time and skills.', spenden: 'Pledge money, non-binding.', gruenden: 'Co-found the association.' },
  },
}[SPRACHE];

const ICON = { mitkommen: '→', mitbauen: '⚒', spenden: '€', gruenden: '§', updates: '✉' };
const browser = browserId();
const wurzel = $('#zusagen');
let daten = null;
let gewaehlt = location.hash.slice(1) || null;

function auswahl(name, typ, optionen) {
  return el('div', { class: 'optionen kompakt' }, ...Object.entries(optionen).map(([wert, text]) =>
    el('label', { class: 'option' }, el('input', { type: typ, name, value: wert }), el('span', { text: text[SPRACHE] ?? text.text[SPRACHE] }))));
}

const falle = () => el('div', { class: 'falle', 'aria-hidden': 'true' }, el('input', { type: 'text', name: '_website', tabindex: '-1', autocomplete: 'off' }));

function zusageFormular(art, z) {
  const { konfig, meine } = daten;
  const kopf = [el('h2', { class: 'zusage-titel', tabindex: '-1', text: z.titel[SPRACHE] }), el('p', { text: z.text[SPRACHE] })];
  if (meine.includes(art)) {
    return el('article', { class: 'zusage zugesagt' }, ...kopf,
      el('p', { class: 'zusage-ok', text: `✓ ${T.zugesagt}` }),
      el('button', { type: 'button', class: 'knopf knopf-leise', text: T.zuruecknehmen,
        onclick: async () => { await senden('/api/zusage', { art, browser, zurueck: true }); laden(); } }));
  }
  const formular = el('form', { class: 'zusage-formular', novalidate: true });
  if (art === 'mitbauen') formular.append(el('p', { class: 'feld-titel', text: T.gebiete }), auswahl('faehigkeiten', 'checkbox', konfig.faehigkeiten));
  if (art === 'spenden') formular.append(el('p', { class: 'feld-titel', text: T.betrag }), auswahl('betrag', 'radio', konfig.betraege));
  const email = el('input', { type: 'email', name: 'email', autocomplete: 'email', class: 'eingabe', required: z.emailPflicht || false });
  const zustimmung = el('label', { class: 'einwilligung', hidden: !z.emailPflicht },
    el('input', { type: 'checkbox', name: 'einwilligung' }), el('span', { text: T.einwilligung }));
  email.addEventListener('input', () => { zustimmung.hidden = !z.emailPflicht && !email.value.trim(); });
  formular.append(
    el('label', { class: 'feld' }, el('span', { class: 'feld-titel', text: z.emailPflicht ? T.emailPflicht : T.email }), email),
    zustimmung, falle(),
    el('p', { class: 'fehler', role: 'alert', hidden: true }),
    el('button', { type: 'submit', class: 'knopf', text: z.titel[SPRACHE] }));
  formular.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(formular);
    const fehler = $('.fehler', formular);
    try {
      await senden('/api/zusage', {
        art, browser,
        faehigkeiten: d.getAll('faehigkeiten'),
        betrag: d.get('betrag') || undefined,
        email: d.get('email') || '',
        einwilligung: d.get('einwilligung') === 'on',
        _website: d.get('_website') || '',
      });
      await laden(true);
    } catch (err) {
      fehler.textContent = err.message;
      fehler.hidden = false;
    }
  });
  return el('article', { class: 'zusage' }, ...kopf, formular);
}

function updatesFormular() {
  const formular = el('form', { class: 'zusage-formular', novalidate: true },
    el('label', { class: 'feld' }, el('span', { class: 'feld-titel', text: T.emailFeld }),
      el('input', { type: 'email', name: 'email', autocomplete: 'email', class: 'eingabe', required: true })),
    el('label', { class: 'einwilligung' }, el('input', { type: 'checkbox', name: 'einwilligung' }), el('span', { text: T.aboEinwilligung })),
    falle(),
    el('p', { class: 'fehler', role: 'alert', hidden: true }),
    el('button', { type: 'submit', class: 'knopf', text: T.abonnieren }));
  formular.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(formular);
    const fehler = $('.fehler', formular);
    if (d.get('einwilligung') !== 'on') { fehler.textContent = T.aboHaken; fehler.hidden = false; return; }
    try {
      await senden('/api/abo', { email: d.get('email'), einwilligung: true, _website: d.get('_website') || '' });
      formular.replaceChildren(el('p', { class: 'zusage-ok', text: `✉ ${T.aboGesendet}` }));
    } catch (err) {
      fehler.textContent = err.message;
      fehler.hidden = false;
    }
  });
  return el('article', { class: 'zusage' },
    el('h2', { class: 'zusage-titel', tabindex: '-1', text: T.updates.titel }), el('p', { text: T.updates.text }), formular);
}

function wahlKachel(art, titel, kurz) {
  const erledigt = daten.meine.includes(art);
  return el('button', {
    type: 'button', class: `wahl${gewaehlt === art ? ' gewaehlt' : ''}${erledigt ? ' erledigt' : ''}`,
    'aria-pressed': gewaehlt === art ? 'true' : 'false', 'aria-controls': 'zusage-panel',
    onclick: () => waehlen(art),
  },
  el('span', { class: 'wahl-icon', 'aria-hidden': 'true', text: ICON[art] }),
  el('span', { class: 'wahl-titel', text: titel }),
  el('span', { class: 'wahl-kurz', text: erledigt ? `✓ ${T.erledigt}` : kurz }));
}

function zeichnen(fokus = false) {
  const { stand, konfig } = daten;
  const schwellen = el('div', { class: 'schwellen' });
  schwellenZeichnen(schwellen, stand, konfig);
  const kacheln = [
    ...Object.entries(konfig.zusagen).map(([art, z]) => wahlKachel(art, z.titel[SPRACHE], T.kurz[art])),
    wahlKachel('updates', T.updates.titel, T.updates.kurz),
  ];
  let panel = null;
  if (gewaehlt === 'updates') panel = updatesFormular();
  else if (gewaehlt && konfig.zusagen[gewaehlt]) panel = zusageFormular(gewaehlt, konfig.zusagen[gewaehlt]);
  wurzel.replaceChildren(
    el('div', { class: 'zusage-stand' }, el('h2', { text: T.standTitel }), schwellen),
    el('h2', { class: 'wahl-frage', text: T.frage }),
    el('p', { class: 'unterzeile', text: T.hinweisWahl }),
    el('div', { class: 'wahl-raster', role: 'group', 'aria-label': T.frage }, ...kacheln),
    el('div', { id: 'zusage-panel', class: 'zusage-panel', 'aria-live': 'polite' }, panel));
  if (fokus && panel) {
    const titel = $('.zusage-titel', panel);
    titel.focus({ preventScroll: true });
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function waehlen(art) {
  gewaehlt = gewaehlt === art ? null : art;
  history.replaceState(null, '', gewaehlt ? `#${gewaehlt}` : location.pathname);
  zeichnen(Boolean(gewaehlt));
}

async function laden(nachZusage = false) {
  try {
    daten = await holen(`/api/zusagen?browser=${browser}`);
    if (gewaehlt && gewaehlt !== 'updates' && !daten.konfig.zusagen[gewaehlt]) gewaehlt = null;
    zeichnen(nachZusage);
  } catch {
    wurzel.textContent = T.ladeFehler;
  }
}

laden();
