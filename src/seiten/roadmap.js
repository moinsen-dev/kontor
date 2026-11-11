import { seite, ROUTEN, REPO, esc } from './layout.js';
import { STUFEN, NICHT_GEPLANT, ENTWUERFE } from '../roadmap.js';

const TEXT = {
  de: {
    titel: 'Roadmap – Kontor', beschreibung: 'Was Kontor werden soll, in welcher Reihenfolge und warum. Alles sind Entwürfe, gebaut ist noch nichts.',
    h1: 'Was wir bauen wollen',
    einleitung: 'Alles hier ist ein Entwurf. Gebaut ist davon noch nichts, und Termine versprechen wir nicht. Geordnet ist die Liste danach, ab wann etwas nützt: erst für eine Person, dann für zwei, dann für Gruppen.',
    wunsch: 'Steht zur Abstimmung', agentenTitel: 'Agenten von Anfang an',
    agenten: 'Wer möchte, kann eigene Software-Agenten einsetzen, über offene Standards (A2A und MCP). Ein Agent handelt immer erklärt und im Auftrag eines Menschen, mit Rechten, die sich widerrufen lassen. Er gibt sich nie als Mensch aus und kann niemanden ungefragt ansprechen.',
    nichtTitel: 'Was wir bewusst nicht bauen', entwuerfeTitel: 'Die Entwürfe lesen',
    entwuerfeText: 'Die Entwürfe sind auf Englisch, damit alle mitlesen können. Gebaut wird erst, wenn sie geprüft sind.',
    mitreden: 'Kritik und Ideen gern als', issue: 'Issue auf GitHub', oder: 'oder über die', wuensche: 'Wünsche',
  },
  en: {
    titel: 'Roadmap – Kontor', beschreibung: 'What Kontor is meant to become, in which order and why. These are all drafts, nothing is built yet.',
    h1: 'What we want to build',
    einleitung: 'Everything here is a draft. None of it is built yet, and we promise no dates. The list is ordered by when something becomes useful: first to one person, then to two, then to groups.',
    wunsch: 'Open for voting', agentenTitel: 'Agents from the start',
    agenten: 'If you want to, you can use your own software agents, through open standards (A2A and MCP). An agent always acts openly and on behalf of a person, with permissions that can be revoked. It never poses as a human and cannot contact anyone unasked.',
    nichtTitel: 'What we deliberately won’t build', entwuerfeTitel: 'Read the drafts',
    entwuerfeText: 'The drafts are in English so that everyone can follow them. We only build once they have been reviewed.',
    mitreden: 'Criticism and ideas are welcome as an', issue: 'issue on GitHub', oder: 'or through the', wuensche: 'wishes',
  },
};

export function roadmap(s) {
  const x = TEXT[s];
  const stufen = STUFEN.map((st, i) => `
<section class="abschnitt${i % 2 ? '' : ' abschnitt-getoent'}" id="${st.id}">
  <div class="breite">
    <h2>${esc(st.name[s])}</h2>
    <p class="unterzeile">${esc(st.wann[s])}</p>
    <div class="karten">${st.funktionen.map((f) => `
      <article class="karte">
        <h3>${esc(f.titel[s])}</h3>
        <p>${esc(f.text[s])}</p>
        ${f.wunsch ? `<p class="quelle"><a href="${ROUTEN.wuensche[s]}">${x.wunsch} →</a></p>` : ''}
      </article>`).join('')}
    </div>
  </div>
</section>`).join('');
  const inhalt = `
<section class="abschnitt">
  <div class="breite schmal">
    <h1>${x.h1}</h1>
    <p class="einleitung">${x.einleitung}</p>
  </div>
</section>
${stufen}
<section class="abschnitt" id="agenten">
  <div class="breite schmal">
    <h2>${x.agentenTitel}</h2>
    <p>${x.agenten}</p>
    <h2>${x.nichtTitel}</h2>
    <ul class="liste">${NICHT_GEPLANT.map((n) => `<li>${esc(n[s])}</li>`).join('')}</ul>
    <h2>${x.entwuerfeTitel}</h2>
    <p>${x.entwuerfeText}</p>
    <ul class="liste">${ENTWUERFE.map((e) => `<li><a href="${REPO}/blob/main/docs/${e.datei}">${esc(e.titel[s])}</a></li>`).join('')}</ul>
    <p>${x.mitreden} <a href="${REPO}/issues">${x.issue}</a> ${x.oder} <a href="${ROUTEN.wuensche[s]}">${x.wuensche}</a>.</p>
  </div>
</section>`;
  return seite({ id: 'roadmap', sprache: s, titel: x.titel, beschreibung: x.beschreibung, inhalt });
}
