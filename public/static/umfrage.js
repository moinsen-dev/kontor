// Survey, one question at a time. Answers stay in memory until the last step is submitted.
import { $, el, holen, senden, lesen, schreiben, zahl, SPRACHE } from './gemeinsam.js';

const MERKER = 'kontor-umfrage-beantwortet';
const OBEN = ['DE', 'AT', 'CH', 'NL', 'GB', 'US'];
const T = {
  de: {
    frageVon: (i, n) => `Frage ${i} von ${n}`, weiter: 'Weiter', absenden: 'Absenden', zurueck: 'Zurück', ueberspringen: 'Überspringen',
    pflicht: 'Bitte wähle mindestens eine Antwort.', max: (n) => `Höchstens ${n} Antworten.`,
    freitext: 'Optional: in eigenen Worten (bitte ohne Namen)', landWaehlen: 'Land wählen …', alleLaender: 'Alle Länder',
    sendet: 'Wird gesendet …',
    dankeTitel: 'Danke!', dankeText: 'Deine Antworten sind gespeichert. Zwei Dinge helfen jetzt am meisten:',
    wuensche: 'Über Wünsche abstimmen', mitmachen: 'Zusagen, dass du mitkommst',
    teilen: 'Und teile die Seite mit Menschen, die auch auf LinkedIn sind.',
    eine: 'Bisher 1 Antwort.', viele: (n) => `Bisher ${n} Antworten.`, keine: 'Noch keine Antworten. Sei die erste Person.',
    beantwortet: (n) => `${n} beantwortet`, mehrfach: (n) => `${n} beantwortet, Mehrfachantworten möglich`,
    weitere: (n) => `und ${n} weitere`, ladeFehler: 'Ergebnisse konnten nicht geladen werden.',
  },
  en: {
    frageVon: (i, n) => `Question ${i} of ${n}`, weiter: 'Next', absenden: 'Submit', zurueck: 'Back', ueberspringen: 'Skip',
    pflicht: 'Please choose at least one answer.', max: (n) => `At most ${n} answers.`,
    freitext: 'Optional: in your own words (please no names)', landWaehlen: 'Choose a country …', alleLaender: 'All countries',
    sendet: 'Sending …',
    dankeTitel: 'Thank you!', dankeText: 'Your answers are saved. Two things help most now:',
    wuensche: 'Vote on wishes', mitmachen: 'Pledge to come along',
    teilen: 'And share this page with people who are on LinkedIn too.',
    eine: '1 answer so far.', viele: (n) => `${n} answers so far.`, keine: 'No answers yet. Be the first.',
    beantwortet: (n) => `${n} answered`, mehrfach: (n) => `${n} answered, multiple answers possible`,
    weitere: (n) => `and ${n} more`, ladeFehler: 'Results could not be loaded.',
  },
}[SPRACHE];
const WEGE = { de: { wuensche: '/wuensche', mitmachen: '/mitmachen' }, en: { wuensche: '/en/wishes', mitmachen: '/en/join' } }[SPRACHE];

const laenderNamen = new Intl.DisplayNames([SPRACHE], { type: 'region' });
const land = (code) => { try { return laenderNamen.of(code); } catch { return code; } };

let fragen = [];
let laender = [];
let index = 0;
let hoechster = 0;
const antworten = {};
const begonnen = Date.now();

const schritt = $('#umfrage-schritt');
const feld = $('#frage-feld');
const fehler = $('#fehler');
const weiter = $('#weiter');
const zurueck = $('#zurueck');

function zaehlen(n) {
  senden('/api/schritt', { schritt: n }).catch(() => {});
}

function frageZeichnen() {
  const f = fragen[index];
  fehler.hidden = true;
  $('#fortschritt-text').textContent = T.frageVon(index + 1, fragen.length);
  const anteil = Math.round((index / fragen.length) * 100);
  $('#fortschritt-balken').style.width = `${anteil}%`;
  schritt.querySelector('.fortschritt').setAttribute('aria-valuenow', String(anteil));

  const titel = el('h2', { class: 'frage-titel', tabindex: '-1', text: f.frage[SPRACHE] });
  const teile = [titel];
  if (f.hinweis) teile.push(el('p', { class: 'frage-hinweis', text: f.hinweis[SPRACHE] }));

  if (f.typ === 'land') {
    const auswahl = el('select', { class: 'land-auswahl', name: f.key, 'aria-label': f.frage[SPRACHE] },
      el('option', { value: '', text: T.landWaehlen }),
      ...OBEN.map((c) => el('option', { value: c, text: land(c), selected: antworten[f.key] === c })),
      el('optgroup', { label: T.alleLaender },
        ...laender.filter((c) => !OBEN.includes(c)).map((c) => [c, land(c)])
          .sort((a, b) => a[1].localeCompare(b[1], SPRACHE))
          .map(([c, n]) => el('option', { value: c, text: n, selected: antworten[f.key] === c }))));
    teile.push(auswahl);
  } else {
    const typ = f.typ === 'eins' ? 'radio' : 'checkbox';
    const gewaehlt = [].concat(antworten[f.key] || []);
    const optionen = el('div', { class: 'optionen', role: typ === 'radio' ? 'radiogroup' : 'group', 'aria-label': f.frage[SPRACHE] });
    for (const [wert, text] of Object.entries(f.optionen)) {
      optionen.append(el('label', { class: 'option' },
        el('input', { type: typ, name: f.key, value: wert, checked: gewaehlt.includes(wert) }),
        el('span', { text: text[SPRACHE] })));
    }
    if (f.max) {
      const sperren = () => {
        const boxen = [...optionen.querySelectorAll('input')];
        const voll = boxen.filter((b) => b.checked).length >= f.max;
        for (const b of boxen) b.disabled = voll && !b.checked;
      };
      optionen.addEventListener('change', sperren);
      queueMicrotask(sperren);
    }
    if (typ === 'radio') {
      optionen.addEventListener('change', () => {
        merken();
        if (index < fragen.length - 1) setTimeout(() => vor(), 280);
      });
    }
    teile.push(optionen);
    if (f.freitext) {
      teile.push(el('textarea', {
        class: 'freitext', name: f.freitext, maxlength: '1000', placeholder: T.freitext,
        'aria-label': `${f.frage[SPRACHE]} – ${T.freitext}`,
      }));
      queueMicrotask(() => { schritt.querySelector(`[name="${f.freitext}"]`).value = antworten[f.freitext] || ''; });
    }
  }
  feld.replaceChildren(...teile);
  zurueck.hidden = index === 0;
  zurueck.textContent = T.zurueck;
  const letzte = index === fragen.length - 1;
  weiter.textContent = letzte ? T.absenden : T.weiter;
  titel.focus({ preventScroll: true });
  if (index + 1 > hoechster) { hoechster = index + 1; zaehlen(hoechster); }
}

function merken() {
  const f = fragen[index];
  const daten = new FormData(schritt);
  antworten[f.key] = f.typ === 'mehrere' ? daten.getAll(f.key) : (daten.get(f.key) || null);
  if (f.freitext) antworten[f.freitext] = daten.get(f.freitext) || '';
}

function fehlt() {
  const f = fragen[index];
  if (!f.pflicht) return null;
  const wert = antworten[f.key];
  return (f.typ === 'mehrere' ? !wert?.length : !wert) ? T.pflicht : null;
}

async function vor() {
  merken();
  const meldung = fehlt();
  if (meldung) { fehler.textContent = meldung; fehler.hidden = false; return; }
  if (index < fragen.length - 1) { index++; frageZeichnen(); window.scrollTo({ top: schritt.offsetTop - 80, behavior: 'smooth' }); return; }

  weiter.disabled = true;
  weiter.textContent = T.sendet;
  try {
    await senden('/api/antwort', {
      ...antworten, _website: new FormData(schritt).get('_website') || '', _dauer: Math.round((Date.now() - begonnen) / 1000),
    });
    schreiben(MERKER, '1');
    zaehlen(fragen.length + 1);
    zeigeDanke();
    ergebnisseLaden();
  } catch (e) {
    fehler.textContent = e.message;
    fehler.hidden = false;
    weiter.disabled = false;
    weiter.textContent = T.absenden;
  }
}

function zeigeDanke() {
  $('#umfrage-start').hidden = true;
  schritt.hidden = true;
  const danke = $('#danke');
  danke.replaceChildren(
    el('h2', { text: T.dankeTitel }),
    el('p', { text: T.dankeText }),
    el('p', {}, el('a', { class: 'knopf', href: WEGE.wuensche, text: T.wuensche }), ' ', el('a', { class: 'knopf knopf-leise', href: WEGE.mitmachen, text: T.mitmachen })),
    el('p', { class: 'hinweis', text: T.teilen }));
  danke.hidden = false;
}

const prozent = (teil, ganz) => (ganz ? Math.round((teil / ganz) * 100) : 0);

async function ergebnisseLaden() {
  const stand = $('#ergebnis-stand');
  const liste = $('#ergebnis-liste');
  try {
    const { gesamt, auswertung } = await holen('/api/ergebnisse');
    stand.textContent = gesamt === 1 ? T.eine : T.viele(zahl(gesamt));
    liste.replaceChildren();
    if (gesamt === 0) { liste.append(el('p', { text: T.keine })); return; }
    for (const f of fragen) {
      const { beantwortet, zaehler } = auswertung[f.key];
      if (!beantwortet) continue;
      const block = el('div', { class: 'ergebnis-frage' },
        el('h3', { text: f.frage[SPRACHE] }),
        el('p', { class: 'ergebnis-meta', text: f.typ === 'mehrere' ? T.mehrfach(beantwortet) : T.beantwortet(beantwortet) }));
      const sortiert = Object.entries(zaehler).filter(([, a]) => f.typ !== 'land' || a > 0).sort((a, b) => b[1] - a[1]);
      const sichtbar = f.typ === 'land' ? sortiert.slice(0, 10) : sortiert;
      for (const [wert, anzahl] of sichtbar) {
        const p = prozent(anzahl, beantwortet);
        const name = f.typ === 'land' ? land(wert) : f.optionen[wert][SPRACHE];
        block.append(el('div', { class: 'ergebnis-zeile' },
          el('div', { class: 'ergebnis-text' }, el('span', { text: name }), el('span', { text: `${p} % (${anzahl})` })),
          el('div', { class: 'balken', role: 'presentation' }, el('span', { style: `width:${p}%` }))));
      }
      if (sortiert.length > sichtbar.length) block.append(el('p', { class: 'ergebnis-meta', text: T.weitere(sortiert.length - sichtbar.length) }));
      liste.append(block);
    }
  } catch {
    stand.textContent = T.ladeFehler;
  }
}

async function starten() {
  fragen = await holen('/api/fragen');
  laender = fragen.find((f) => f.typ === 'land')?.laender || [];
  schritt.addEventListener('submit', (e) => { e.preventDefault(); vor(); });
  zurueck.addEventListener('click', () => { merken(); index = Math.max(0, index - 1); frageZeichnen(); });
  $('#umfrage-los').addEventListener('click', () => {
    $('#umfrage-start').hidden = true;
    schritt.hidden = false;
    frageZeichnen();
  });
  if (lesen(MERKER) === '1') zeigeDanke();
  ergebnisseLaden();
}

starten();
