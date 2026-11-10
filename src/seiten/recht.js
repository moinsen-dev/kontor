// Imprint and privacy policy. German is legally binding; English is a translation.
import { seite, ROUTEN } from './layout.js';

const KONTAKT = 'Ulrich Diedrichsen<br>Kippingstraße 27<br>20144 Hamburg';

export function impressum(s) {
  const de = s === 'de';
  const inhalt = `
<section class="abschnitt rechtstext">
  <div class="breite schmal">
    <h1>${de ? 'Impressum' : 'Imprint'}</h1>
    ${de ? '' : `<p>This is an English translation. The legally binding version is the <a href="${ROUTEN.impressum.de}" hreflang="de" lang="de">German Impressum</a>.</p>`}
    <h2>${de ? 'Angaben gemäß § 5 DDG' : 'Information according to § 5 DDG (German Digital Services Act)'}</h2>
    <p>${KONTAKT}<br>${de ? 'Deutschland' : 'Germany'}</p>
    <h2>${de ? 'Kontakt' : 'Contact'}</h2>
    <p>E-Mail: <a href="mailto:business@moinsen.dev">business@moinsen.dev</a><br>${de ? 'Telefon' : 'Phone'}: +49 151 61420930</p>
    <h2>${de ? 'Umsatzsteuer-Identifikationsnummer' : 'VAT identification number'}</h2>
    <p>DE299425124</p>
    <h2>${de ? 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV' : 'Responsible for content according to § 18 (2) MStV'}</h2>
    <p>Ulrich Diedrichsen, ${de ? 'Anschrift wie oben' : 'address as above'}</p>
    <h2>${de ? 'Hinweis' : 'Note'}</h2>
    <p>${de
      ? 'Kontor ist derzeit ein privates, nicht gewinnorientiertes Vorhaben von Ulrich Diedrichsen. Ein gemeinnütziger Verein ist in Vorbereitung und besteht noch nicht.'
      : 'Kontor is currently a private, not-for-profit project by Ulrich Diedrichsen. A non-profit association is being prepared and does not exist yet.'}</p>
  </div>
</section>`;
  return seite({ id: 'impressum', sprache: s, titel: de ? 'Impressum – Kontor' : 'Imprint – Kontor', beschreibung: de ? 'Impressum' : 'Imprint', inhalt, noindex: true });
}

const DS = {
  de: [
    ['', 'Kurz gesagt: Wir speichern keine Namen und keine IP-Adressen, setzen selbst keine Cookies und binden keine Dienste Dritter wie Schriftarten, Analyse oder Werbung ein. Eine E-Mail-Adresse speichern wir nur, wenn du sie bei einer Zusage oder für Updates freiwillig angibst.'],
    ['Verantwortlicher', 'Ulrich Diedrichsen, Kippingstraße 27, 20144 Hamburg, Deutschland. E-Mail: <a href="mailto:business@moinsen.dev">business@moinsen.dev</a>'],
    ['Hosting', 'Die Seite läuft bei Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA, als Auftragsverarbeiter. Beim Aufruf verarbeitet Cloudflare technisch notwendige Verbindungsdaten wie die IP-Adresse, um die Seite auszuliefern, Missbrauch zu begrenzen (Anfragen pro Adresse und Minute) und Angriffe abzuwehren. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert. Wir selbst speichern keine IP-Adressen und haben die Protokollierung der Anwendung abgeschaltet.'],
    ['', 'Zum Schutz vor automatisierten Zugriffen fügt Cloudflare jeder Seite ein kleines Prüfskript hinzu, das von dieser Adresse geladen wird, und kann dafür ein technisch notwendiges Sicherheits-Cookie („cf_clearance“) setzen. Es dient nur dazu, Bots von Menschen zu unterscheiden, und wird nicht für Analyse oder Werbung verwendet. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG in Verbindung mit Art. 6 Abs. 1 lit. f DSGVO.'],
    ['Umfrage', 'Wenn du die Umfrage absendest, speichern wir deine ausgewählten Antworten, optionale Freitexte, den Zeitpunkt und die Sprache der Seite. Die Daten liegen in Cloudflare D1 (Speicherort Westeuropa) und sind keiner Person zugeordnet. Zusätzlich zählen wir anonym, wie viele Menschen welche Frage erreichen, um die Umfrage zu verbessern. Bitte schreib keine Namen in Freitexte; falls doch, entfernen wir sie. Rechtsgrundlage ist deine Einwilligung durch das Absenden (Art. 6 Abs. 1 lit. a DSGVO). Zusammengezählte Ergebnisse sind öffentlich, Freitexte nie.'],
    ['Abstimmung und Vorschläge', 'Damit jede Person pro Wunsch nur eine Stimme hat, erzeugt dein Browser eine zufällige Kennung und speichert sie im lokalen Speicher. Wir speichern diese Kennung mit deiner Stimme. Sie enthält keine Angaben über dich und ist mit nichts anderem verknüpft. Vorschläge speichern wir als Text und veröffentlichen sie erst nach Prüfung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO.'],
    ['Zusagen', 'Bei einer Zusage speichern wir die Art der Zusage, gewählte Fähigkeiten oder den zugesagten Betrag, die Sprache der Seite und die zufällige Browser-Kennung. Gibst du freiwillig eine E-Mail-Adresse an und willigst ein, nutzen wir sie ausschließlich, um dich zu benachrichtigen, wenn eine Schwelle erreicht ist, oder um dich zur Gründung des Vereins einzuladen. Kein Newsletter, keine Weitergabe. Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du jederzeit per E-Mail an business@moinsen.dev widerrufen kannst; dann löschen wir deine Adresse. Eine Spendenzusage ist unverbindlich, es wird kein Geld eingezogen.'],
    ['Updates per E-Mail', 'Wenn du Updates abonnierst, speichern wir deine E-Mail-Adresse, die Sprache, den Zeitpunkt der Anfrage und der Bestätigung sowie die Version des Einwilligungstextes. Du bekommst zuerst eine Mail mit einem Bestätigungslink (Double-Opt-In); ohne Bestätigung löschen wir die Adresse nach sieben Tagen. Danach schicken wir dir Neuigkeiten zum Fortschritt von Kontor, etwa einmal im Monat. Jede Mail enthält einen Abmeldelink; beim Abmelden löschen wir deine Adresse und die Versandnachweise. Für den Versand nutzen wir Resend (Plus Five Five, Inc., San Francisco, USA) als Auftragsverarbeiter, auf Grundlage von EU-Standardvertragsklauseln und des EU-US Data Privacy Framework. Öffnungs- und Klickverfolgung sind abgeschaltet. Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du jederzeit widerrufen kannst. Ohne E-Mail gibt es die Neuigkeiten auch als RSS-Feed.'],
    ['Speicherdauer', 'Wir löschen Einzelantworten, Stimmen und Zusagen, sobald sie für den Zweck nicht mehr nötig sind, spätestens am 31. Dezember 2027. Entsteht vorher ein Verein, fragen wir Menschen mit E-Mail-Adresse, ob ihre Zusage dorthin übergehen soll; ohne Zustimmung löschen wir sie.'],
    ['Speicher im Browser', 'Im lokalen Speicher (localStorage) deines Browsers liegen nur die zufällige Kennung, ob du die Umfrage schon ausgefüllt hast, und deine Stimmen, damit sie dir angezeigt werden. Du kannst das jederzeit in den Einstellungen deines Browsers löschen.'],
    ['Deine Rechte', 'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerruf einer Einwilligung (Art. 15 bis 21 DSGVO). Anonyme Antworten können wir in der Regel nicht einer Person zuordnen. Du kannst dich außerdem bei einer Datenschutzaufsichtsbehörde beschweren, zum Beispiel beim Hamburgischen Beauftragten für Datenschutz und Informationsfreiheit.'],
  ],
  en: [
    ['', 'In short: we store no names and no IP addresses, set no cookies ourselves and embed no third-party services such as fonts, analytics or advertising. We only store an e-mail address if you voluntarily give one with a pledge or for updates.'],
    ['Controller', 'Ulrich Diedrichsen, Kippingstraße 27, 20144 Hamburg, Germany. E-mail: <a href="mailto:business@moinsen.dev">business@moinsen.dev</a>'],
    ['Hosting', 'The site runs on Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA, acting as our processor. When you visit, Cloudflare processes technically necessary connection data such as your IP address to deliver the site, limit abuse (requests per address and minute) and fend off attacks. The legal basis is our legitimate interest in secure operation (Art. 6(1)(f) GDPR). Cloudflare is certified under the EU-US Data Privacy Framework. We do not store IP addresses ourselves and have switched off application logging.'],
    ['', 'To protect against automated access, Cloudflare adds a small check script to every page, loaded from this address, and may set a technically necessary security cookie (“cf_clearance”). It is used only to tell bots from humans, not for analytics or advertising. The legal basis is § 25(2) no. 2 TDDDG in conjunction with Art. 6(1)(f) GDPR.'],
    ['Survey', 'When you submit the survey, we store your selected answers, optional free text, the time and the page language. The data is kept in Cloudflare D1 (Western Europe) and is not linked to any person. We also count anonymously how many people reach each question, to improve the survey. Please don’t write names in free text; if you do, we remove them. The legal basis is your consent by submitting (Art. 6(1)(a) GDPR). Aggregated results are public, free text never is.'],
    ['Votes and suggestions', 'So that each person has only one vote per wish, your browser creates a random id and keeps it in local storage. We store this id with your vote. It contains nothing about you and is not linked to anything else. We store suggestions as text and only publish them after review. The legal basis is Art. 6(1)(a) GDPR.'],
    ['Pledges', 'For a pledge we store its type, the skills or amount you chose, the page language and the random browser id. If you voluntarily give an e-mail address and consent, we use it only to tell you when a threshold is reached or to invite you to found the association. No newsletter, never passed on. The legal basis is your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time by e-mail to business@moinsen.dev; we then delete your address. A donation pledge is non-binding; no money is collected.'],
    ['E-mail updates', 'If you subscribe to updates, we store your e-mail address, language, the time of the request and of the confirmation, and the version of the consent text. You first receive an e-mail with a confirmation link (double opt-in); without confirmation we delete the address after seven days. After that we send you news about Kontor’s progress, about once a month. Every e-mail contains an unsubscribe link; when you unsubscribe we delete your address and the delivery records. We send via Resend (Plus Five Five, Inc., San Francisco, USA) as our processor, based on EU standard contractual clauses and the EU-US Data Privacy Framework. Open and click tracking are switched off. The legal basis is your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time. Without e-mail, the updates are also available as an RSS feed.'],
    ['Retention', 'We delete individual answers, votes and pledges once they are no longer needed, at the latest on 31 December 2027. If an association is founded earlier, we ask people who left an e-mail address whether their pledge should move there; without consent we delete it.'],
    ['Browser storage', 'Your browser’s local storage only holds the random id, whether you have taken the survey, and your votes so they can be shown to you. You can delete this at any time in your browser settings.'],
    ['Your rights', 'You have the right of access, rectification, erasure, restriction, data portability and withdrawal of consent (Art. 15 to 21 GDPR). We usually cannot link anonymous answers to a person. You can also lodge a complaint with a supervisory authority, for example the Hamburg Commissioner for Data Protection and Freedom of Information.'],
  ],
};

export function datenschutz(s) {
  const de = s === 'de';
  const abschnitte = DS[s].map(([h, p]) => `${h ? `<h2>${h}</h2>` : ''}<p>${p}</p>`).join('\n    ');
  const inhalt = `
<section class="abschnitt rechtstext">
  <div class="breite schmal">
    <h1>${de ? 'Datenschutz' : 'Privacy'}</h1>
    ${de ? '' : `<p>This is an English translation. The legally binding version is the <a href="${ROUTEN.datenschutz.de}" hreflang="de" lang="de">German Datenschutzerklärung</a>.</p>`}
    ${abschnitte}
    <p>${de ? 'Stand: November 2026' : 'Last updated: November 2026'}</p>
  </div>
</section>`;
  return seite({ id: 'datenschutz', sprache: s, titel: de ? 'Datenschutz – Kontor' : 'Privacy – Kontor', beschreibung: de ? 'Datenschutzerklärung' : 'Privacy policy', inhalt, noindex: true });
}
