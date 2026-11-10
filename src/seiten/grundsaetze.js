import { seite, REPO, esc } from './layout.js';
import { CHARTA, SATZUNG, HINWEISE } from '../satzung.js';

const TEXT = {
  de: {
    titel: 'Grundsätze und Satzung – Kontor',
    beschreibung: 'Die Grundsätze von Kontor und der Entwurf der Satzung für einen gemeinnützigen Verein. Offen zur Diskussion.',
    h1: 'Grundsätze und Satzungsentwurf',
    einleitung: 'Kontor soll von einem gemeinnützigen Verein getragen werden, der seinen Mitgliedern und Nutzenden verpflichtet ist – nicht Investoren. Hier stehen unsere Versprechen und der Entwurf der Satzung. Beides ist offen zur Diskussion.',
    charta: 'Unsere Grundsätze',
    satzung: 'Satzungsentwurf',
    satzungText: 'Die steuerlich nötigen Bestimmungen folgen der Mustersatzung der Abgabenordnung (Anlage 1 zu § 60 AO). Vorbild für einen gemeinnützigen Verein, der eine offene Plattform betreibt, ist der Codeberg e. V.',
    offen: 'Was noch offen ist',
    mitreden: `Kritik und Verbesserungen gern als <a href="${REPO}/issues">Issue auf GitHub</a> oder per E-Mail an <a href="mailto:business@moinsen.dev">business@moinsen.dev</a>.`,
    stand: 'Entwurf, Stand November 2026',
  },
  en: {
    titel: 'Principles and statutes – Kontor',
    beschreibung: 'Kontor’s principles and the draft statutes for a non-profit association. Open for discussion.',
    h1: 'Principles and draft statutes',
    einleitung: 'Kontor is meant to be run by a non-profit association that answers to its members and users – not to investors. Here are our promises and the draft statutes. Both are open for discussion.',
    charta: 'Our principles',
    satzung: 'Draft statutes',
    satzungText: 'This is an English translation for information; the German text is authoritative. The tax-relevant clauses follow the model statutes of the German Fiscal Code (Annex 1 to § 60 AO). The model for a non-profit association running an open platform is Codeberg e. V.',
    offen: 'What is still open',
    mitreden: `Criticism and improvements are welcome as an <a href="${REPO}/issues">issue on GitHub</a> or by e-mail to <a href="mailto:business@moinsen.dev">business@moinsen.dev</a>.`,
    stand: 'Draft, November 2026',
  },
};

export function grundsaetze(s) {
  const x = TEXT[s];
  const satzung = SATZUNG.map((p) => `
    <section class="paragraf">
      <h3>${esc(p.titel[s])}</h3>
      ${p.absaetze.map((a) => `<p>${esc(a[s])}</p>`).join('')}
    </section>`).join('');
  const inhalt = `
<section class="abschnitt">
  <div class="breite schmal">
    <p class="vorzeile">${x.stand}</p>
    <h1>${x.h1}</h1>
    <p class="einleitung">${x.einleitung}</p>
    <h2>${x.charta}</h2>
    <ol class="charta">${CHARTA.map((c) => `<li>${esc(c[s])}</li>`).join('')}</ol>
  </div>
</section>
<section class="abschnitt abschnitt-getoent">
  <div class="breite schmal">
    <h2>${x.offen}</h2>
    <ul class="liste">${HINWEISE.map((h) => `<li>${esc(h[s])}</li>`).join('')}</ul>
    <p>${x.mitreden}</p>
  </div>
</section>
<section class="abschnitt">
  <div class="breite schmal satzung">
    <h2>${x.satzung}</h2>
    <p class="unterzeile">${x.satzungText}</p>
    ${satzung}
  </div>
</section>`;
  return seite({ id: 'grundsaetze', sprache: s, titel: x.titel, beschreibung: x.beschreibung, inhalt });
}
