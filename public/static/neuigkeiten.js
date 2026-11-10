// Updates page: progress bars, subscription form, and the confirm/unsubscribe step behind mail links.
// Links in mails only open this page; the button here sends the POST (mail scanners don't press buttons).
import { $, el, holen, senden, schwellenZeichnen, SPRACHE } from './gemeinsam.js';

const T = {
  de: {
    gesendet: 'Fast geschafft: Wir haben dir eine Mail mit einem Bestätigungslink geschickt. Bitte sieh auch im Spam-Ordner nach.',
    bestaetigenTitel: 'Anmeldung bestätigen', bestaetigenText: 'Ein Klick, und du bekommst Neuigkeiten zum Fortschritt von Kontor.', bestaetigen: 'Ja, Anmeldung bestätigen',
    bestaetigt: 'Danke, deine Anmeldung ist bestätigt. Du hörst von uns, sobald es Neues gibt.',
    abmeldenTitel: 'Abmelden', abmeldenText: 'Du bekommst dann keine Updates mehr; deine Adresse wird gelöscht.', abmelden: 'Ja, abmelden',
    abgemeldet: 'Du bist abgemeldet und deine Adresse ist gelöscht.',
    ungueltig: 'Dieser Link ist nicht mehr gültig. Bestätigungslinks gelten sieben Tage – melde dich einfach noch einmal an.',
    einwilligung: 'Bitte setze den Haken bei der Einwilligung.', ladeFehler: 'Der Zwischenstand konnte nicht geladen werden.',
  },
  en: {
    gesendet: 'Almost done: we have sent you an e-mail with a confirmation link. Please check your spam folder too.',
    bestaetigenTitel: 'Confirm subscription', bestaetigenText: 'One click and you will receive news about Kontor’s progress.', bestaetigen: 'Yes, confirm subscription',
    bestaetigt: 'Thank you, your subscription is confirmed. You will hear from us when there is news.',
    abmeldenTitel: 'Unsubscribe', abmeldenText: 'You will receive no more updates; your address will be deleted.', abmelden: 'Yes, unsubscribe',
    abgemeldet: 'You are unsubscribed and your address has been deleted.',
    ungueltig: 'This link is no longer valid. Confirmation links last seven days – simply subscribe again.',
    einwilligung: 'Please tick the consent box.', ladeFehler: 'Progress could not be loaded.',
  },
}[SPRACHE];

const box = $('#abo-ergebnis');
function zeigen(...inhalt) {
  box.replaceChildren(...inhalt);
  box.hidden = false;
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function schritt(titel, text, knopfText, pfad, token, erfolg) {
  const knopf = el('button', { type: 'button', class: 'knopf', text: knopfText });
  knopf.addEventListener('click', async () => {
    knopf.disabled = true;
    try {
      await senden(pfad, { token });
      zeigen(el('p', { text: erfolg }));
    } catch {
      zeigen(el('p', { text: T.ungueltig }));
    }
  });
  zeigen(el('h2', { text: titel }), el('p', { text }), knopf);
}

const parameter = new URLSearchParams(location.search);
const bestaetigen = parameter.get('bestaetigen');
const abmelden = parameter.get('abmelden');
if (bestaetigen || abmelden) history.replaceState(null, '', location.pathname);
if (bestaetigen) schritt(T.bestaetigenTitel, T.bestaetigenText, T.bestaetigen, '/api/abo/bestaetigen', bestaetigen, T.bestaetigt);
if (abmelden) schritt(T.abmeldenTitel, T.abmeldenText, T.abmelden, '/api/abo/abmelden', abmelden, T.abgemeldet);

const formular = $('#abo-formular');
formular.addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = new FormData(formular);
  const fehler = $('.fehler', formular);
  if (d.get('einwilligung') !== 'on') { fehler.textContent = T.einwilligung; fehler.hidden = false; return; }
  try {
    await senden('/api/abo', { email: d.get('email'), einwilligung: true, _website: d.get('_website') || '' });
    formular.replaceChildren(el('p', { class: 'danke', text: T.gesendet }));
  } catch (err) {
    fehler.textContent = err.message;
    fehler.hidden = false;
  }
});

try {
  const { stand, konfig } = await holen('/api/zusagen');
  schwellenZeichnen($('#schwellen'), stand, konfig);
} catch {
  $('#schwellen').textContent = T.ladeFehler;
}
