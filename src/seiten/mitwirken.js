// Survey, wishes and pledge pages. The interactive parts are rendered by the scripts in public/static.
import { seite, ROUTEN } from './layout.js';

const TEXT = {
  umfrage: {
    de: {
      titel: 'Umfrage – Kontor', beschreibung: 'Zehn kurze Fragen zu LinkedIn, eine nach der anderen, anonym. Die Ergebnisse sind öffentlich.',
      h1: 'Was stört dich an LinkedIn?', text: 'Zehn kurze Fragen, eine nach der anderen. Anonym, ohne Anmeldung, etwa drei Minuten. Bitte schreib in Freitexte keine Namen.',
      start: 'Los geht’s', laden: 'Fragen werden geladen …', ergebnis: 'Ergebnisse, live',
      hinweis: 'Antworten der deutschen und englischen Seite werden zusammengezählt. Freitexte werden nie veröffentlicht.',
    },
    en: {
      titel: 'Survey – Kontor', beschreibung: 'Ten short questions about LinkedIn, one at a time, anonymous. The results are public.',
      h1: 'What bothers you about LinkedIn?', text: 'Ten short questions, one at a time. Anonymous, no sign-up, about three minutes. Please don’t put names in free text.',
      start: 'Let’s go', laden: 'Loading questions …', ergebnis: 'Results, live',
      hinweis: 'Answers from the German and English pages are counted together. Free text is never published.',
    },
  },
  wuensche: {
    de: {
      titel: 'Wünsche – Kontor', beschreibung: 'Was müsste ein besseres Berufsnetz können? Stimme ab oder schlage selbst etwas vor.',
      h1: 'Was müsste ein besseres Berufsnetz können?',
      text: 'Stimme für das, was dir wichtig ist (▲), und gegen das, was du nicht brauchst (▼). Ein zweiter Klick nimmt die Stimme zurück. Die Reihenfolge berücksichtigt, wie sicher ein Ergebnis bei wenigen Stimmen schon ist.',
      vorschlagTitel: 'Dir fehlt etwas?', vorschlagText: 'Schlag es vor. Vorschläge erscheinen, sobald wir sie gesichtet haben – meist innerhalb eines Tages.',
      platzhalter: 'Zum Beispiel: Eine Funktion, die … (10 bis 280 Zeichen)', senden: 'Vorschlag senden',
    },
    en: {
      titel: 'Wishes – Kontor', beschreibung: 'What would a better professional network need? Vote, or suggest something yourself.',
      h1: 'What would a better professional network need?',
      text: 'Vote for what matters to you (▲) and against what you don’t need (▼). A second click takes your vote back. The ranking accounts for how reliable a result is with only a few votes.',
      vorschlagTitel: 'Something missing?', vorschlagText: 'Suggest it. Suggestions appear once we have reviewed them – usually within a day.',
      platzhalter: 'For example: a feature that … (10 to 280 characters)', senden: 'Send suggestion',
    },
  },
  mitmachen: {
    de: {
      titel: 'Mitmachen – Kontor', beschreibung: 'Sag zu, dass du mitkommst, mitbaust, spendest oder den Verein mitgründest. Wir starten, wenn genug zusammenkommen.',
      h1: 'Niemand zieht allein um',
      text: 'Ein neues Netz lohnt sich erst, wenn genug Menschen gleichzeitig kommen. Deshalb sammeln wir Zusagen mit klaren Schwellen. Erst wenn sie erreicht sind, geht es los – und alle, die zugesagt haben, wissen es zur gleichen Zeit.',
      emailHinweis: 'Eine E-Mail-Adresse ist bei Zusagen freiwillig (außer bei der Gründung). Wir nutzen sie nur, um dich zu benachrichtigen, wenn eine Schwelle erreicht ist oder wir dich einladen. Updates per E-Mail gibt es nur mit Bestätigung (Double-Opt-In). Keine Weitergabe.',
    },
    en: {
      titel: 'Join – Kontor', beschreibung: 'Pledge to come along, help build, donate or co-found the association. We start once enough people pledge.',
      h1: 'Nobody moves alone',
      text: 'A new network only works if enough people arrive at the same time. So we collect pledges with clear thresholds. Only when they are reached do we start – and everyone who pledged finds out at the same time.',
      emailHinweis: 'An e-mail address is optional for pledges (except for founding). We only use it to let you know when a threshold is reached or to invite you. E-mail updates require confirmation (double opt-in). Never passed on.',
    },
  },
};

export function umfrage(s) {
  const x = TEXT.umfrage[s];
  const inhalt = `
<section class="abschnitt">
  <div class="breite schmal">
    <div id="umfrage" class="umfrage" data-sprache="${s}">
      <div class="umfrage-start" id="umfrage-start">
        <h1>${x.h1}</h1>
        <p class="einleitung">${x.text}</p>
        <button class="knopf" type="button" id="umfrage-los">${x.start}</button>
      </div>
      <form class="umfrage-schritt" id="umfrage-schritt" hidden novalidate>
        <div class="fortschritt" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="fortschritt-balken"></span></div>
        <p class="fortschritt-text" id="fortschritt-text"></p>
        <div id="frage-feld" aria-live="polite"></div>
        <div class="falle" aria-hidden="true"><label>Website <input type="text" name="_website" tabindex="-1" autocomplete="off"></label></div>
        <p class="fehler" id="fehler" role="alert" hidden></p>
        <div class="schritt-knoepfe">
          <button class="knopf knopf-leise" type="button" id="zurueck"></button>
          <button class="knopf" type="submit" id="weiter"></button>
        </div>
      </form>
      <div class="danke" id="danke" hidden></div>
    </div>
  </div>
</section>
<section class="abschnitt abschnitt-getoent" id="ergebnisse">
  <div class="breite schmal">
    <h2>${x.ergebnis}</h2>
    <p class="unterzeile" id="ergebnis-stand">…</p>
    <div id="ergebnis-liste"></div>
    <p class="hinweis">${x.hinweis}</p>
  </div>
</section>`;
  return seite({ id: 'umfrage', sprache: s, titel: x.titel, beschreibung: x.beschreibung, inhalt, skript: 'umfrage.js' });
}

export function wuensche(s) {
  const x = TEXT.wuensche[s];
  const inhalt = `
<section class="abschnitt">
  <div class="breite schmal">
    <h1>${x.h1}</h1>
    <p class="einleitung">${x.text}</p>
    <ol id="wunsch-liste" class="wunsch-liste" data-sprache="${s}" aria-live="polite"></ol>
  </div>
</section>
<section class="abschnitt abschnitt-getoent">
  <div class="breite schmal">
    <h2>${x.vorschlagTitel}</h2>
    <p>${x.vorschlagText}</p>
    <form id="vorschlag" class="vorschlag" novalidate>
      <textarea class="freitext" name="text" minlength="10" maxlength="280" required placeholder="${x.platzhalter}" aria-label="${x.vorschlagTitel}"></textarea>
      <div class="falle" aria-hidden="true"><label>Website <input type="text" name="_website" tabindex="-1" autocomplete="off"></label></div>
      <p class="fehler" role="alert" hidden></p>
      <button class="knopf" type="submit">${x.senden}</button>
    </form>
  </div>
</section>`;
  return seite({ id: 'wuensche', sprache: s, titel: x.titel, beschreibung: x.beschreibung, inhalt, skript: 'wuensche.js' });
}

export function mitmachen(s) {
  const x = TEXT.mitmachen[s];
  const inhalt = `
<section class="abschnitt">
  <div class="breite schmal">
    <h1>${x.h1}</h1>
    <p class="einleitung">${x.text}</p>
    <div id="zusagen" class="zusagen" data-sprache="${s}"></div>
    <p class="hinweis">${x.emailHinweis} <a href="${ROUTEN.datenschutz[s]}">${s === 'de' ? 'Datenschutz' : 'Privacy'}</a></p>
  </div>
</section>`;
  return seite({ id: 'mitmachen', sprache: s, titel: x.titel, beschreibung: x.beschreibung, inhalt, skript: 'mitmachen.js' });
}
