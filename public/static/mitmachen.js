// Pledges with thresholds. One pledge per kind and browser; it can be taken back.
import { $, el, holen, senden, browserId, schwellenZeichnen, SPRACHE } from './gemeinsam.js';

const T = {
  de: {
    email: 'E-Mail (freiwillig)', emailPflicht: 'E-Mail (für die Einladung)',
    einwilligung: 'Ihr dürft mich unter dieser Adresse benachrichtigen, wenn eine Schwelle erreicht ist oder die Gründung ansteht. Widerruf jederzeit per E-Mail.',
    gebiete: 'Wobei kannst du helfen?', betrag: 'Wie viel würdest du geben?',
    zugesagt: 'Du hast zugesagt. Danke!', zuruecknehmen: 'Zusage zurücknehmen', ladeFehler: 'Der Stand konnte nicht geladen werden.',
    standTitel: 'Zwischenstand',
  },
  en: {
    email: 'E-mail (optional)', emailPflicht: 'E-mail (for the invitation)',
    einwilligung: 'You may notify me at this address when a threshold is reached or the founding is coming up. I can withdraw this at any time by e-mail.',
    gebiete: 'Where can you help?', betrag: 'How much would you give?',
    zugesagt: 'You have pledged. Thank you!', zuruecknehmen: 'Take pledge back', ladeFehler: 'Progress could not be loaded.',
    standTitel: 'Progress so far',
  },
}[SPRACHE];

const browser = browserId();
const wurzel = $('#zusagen');

function auswahl(name, typ, optionen) {
  return el('div', { class: 'optionen kompakt' }, ...Object.entries(optionen).map(([wert, text]) =>
    el('label', { class: 'option' }, el('input', { type: typ, name, value: wert }), el('span', { text: text[SPRACHE] ?? text.text[SPRACHE] }))));
}

function karte(art, z, konfig, zugesagt) {
  const kopf = [el('h2', { class: 'zusage-titel', text: z.titel[SPRACHE] }), el('p', { text: z.text[SPRACHE] })];
  if (zugesagt) {
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
    zustimmung,
    el('div', { class: 'falle', 'aria-hidden': 'true' }, el('input', { type: 'text', name: '_website', tabindex: '-1', autocomplete: 'off' })),
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
      laden();
    } catch (err) {
      fehler.textContent = err.message;
      fehler.hidden = false;
    }
  });
  return el('article', { class: 'zusage' }, ...kopf, formular);
}

async function laden() {
  try {
    const { stand, meine, konfig } = await holen(`/api/zusagen?browser=${browser}`);
    const schwellen = el('div', { class: 'schwellen' });
    schwellenZeichnen(schwellen, stand, konfig);
    wurzel.replaceChildren(
      el('div', { class: 'zusage-stand' }, el('h2', { text: T.standTitel }), schwellen),
      ...Object.entries(konfig.zusagen).map(([art, z]) => karte(art, z, konfig, meine.includes(art))));
  } catch {
    wurzel.textContent = T.ladeFehler;
  }
}

laden();
