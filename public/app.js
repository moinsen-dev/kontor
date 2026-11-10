// Renders the survey from /api/fragen, submits to /api/antwort, shows /api/ergebnisse.
// Page language comes from <html lang>, so the same script serves / (de) and /en/ (en).
const SPRACHE = document.documentElement.lang === 'en' ? 'en' : 'de';
const MERKER = 'kontor-umfrage-beantwortet';
const start = Date.now();
let fragen = [];

const TEXT = {
  de: {
    pflicht: '(Pflicht)', freiwillig: '(freiwillig)',
    freitext: 'Optional: in eigenen Worten (bitte ohne Namen)', freitextLabel: 'Freitext',
    fehlt: 'Bitte beantworte noch: ', senden: 'Antworten absenden', sendet: 'Wird gesendet …',
    sendenFehler: 'Senden fehlgeschlagen. Bitte versuch es noch einmal.',
    eine: 'Bisher 1 Antwort.', viele: (n) => `Bisher ${n} Antworten.`,
    keine: 'Noch keine Antworten. Sei die erste Person.',
    beantwortet: (n) => `${n} beantwortet`, mehrfach: (n) => `${n} beantwortet, Mehrfachantworten möglich`,
    ladeFehler: 'Ergebnisse konnten nicht geladen werden.',
    umfrageFehler: 'Die Umfrage konnte nicht geladen werden. Bitte lade die Seite neu.',
    zahl: 'de-DE',
  },
  en: {
    pflicht: '(required)', freiwillig: '(optional)',
    freitext: 'Optional: in your own words (please no names)', freitextLabel: 'free text',
    fehlt: 'Please also answer: ', senden: 'Submit answers', sendet: 'Sending …',
    sendenFehler: 'Sending failed. Please try again.',
    eine: '1 answer so far.', viele: (n) => `${n} answers so far.`,
    keine: 'No answers yet. Be the first.',
    beantwortet: (n) => `${n} answered`, mehrfach: (n) => `${n} answered, multiple answers possible`,
    ladeFehler: 'Results could not be loaded.',
    umfrageFehler: 'The survey could not be loaded. Please reload the page.',
    zahl: 'en-GB',
  },
}[SPRACHE];

const $ = (sel) => document.querySelector(sel);

function merkerLesen() {
  try { return localStorage.getItem(MERKER) === '1'; } catch { return false; }
}
function merkerSetzen() {
  try { localStorage.setItem(MERKER, '1'); } catch { /* private mode: fine */ }
}

function el(tag, attrs = {}, ...kinder) {
  const knoten = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') knoten.textContent = v;
    else if (v === true) knoten.setAttribute(k, '');
    else if (v !== false && v != null) knoten.setAttribute(k, v);
  }
  knoten.append(...kinder);
  return knoten;
}

function frageZeichnen(f) {
  const typ = f.typ === 'eins' ? 'radio' : 'checkbox';
  const legende = el('legend', {}, f.frage[SPRACHE], ' ', el('span', { class: 'pflicht', text: f.pflicht ? TEXT.pflicht : TEXT.freiwillig }));
  const feld = el('fieldset', { class: 'frage', 'data-key': f.key }, legende);
  if (f.hinweis) feld.append(el('p', { class: 'frage-hinweis', text: f.hinweis[SPRACHE] }));
  const optionen = el('div', { class: 'optionen' });
  for (const [wert, text] of Object.entries(f.optionen)) {
    const eingabe = el('input', { type: typ, name: f.key, value: wert });
    optionen.append(el('label', { class: 'option' }, eingabe, el('span', { text: text[SPRACHE] })));
  }
  feld.append(optionen);
  if (f.freitext) {
    feld.append(el('textarea', {
      class: 'freitext', name: f.freitext, maxlength: '1000',
      placeholder: TEXT.freitext, 'aria-label': `${f.frage[SPRACHE]} – ${TEXT.freitextLabel}`,
    }));
  }
  if (f.max) {
    optionen.addEventListener('change', () => {
      const boxen = [...optionen.querySelectorAll('input')];
      const voll = boxen.filter((b) => b.checked).length >= f.max;
      for (const b of boxen) b.disabled = voll && !b.checked;
    });
  }
  return feld;
}

function formularLesen(formular) {
  const daten = new FormData(formular);
  const body = {
    _website: daten.get('_website') || '',
    _dauer: Math.round((Date.now() - start) / 1000),
    _sprache: SPRACHE,
  };
  for (const f of fragen) {
    body[f.key] = f.typ === 'eins' ? daten.get(f.key) : daten.getAll(f.key);
    if (f.freitext) body[f.freitext] = daten.get(f.freitext) || '';
  }
  return body;
}

function fehlendeFrage(body) {
  return fragen.find((f) => f.pflicht && (f.typ === 'eins' ? !body[f.key] : body[f.key].length === 0));
}

async function absenden(ereignis) {
  ereignis.preventDefault();
  const formular = ereignis.currentTarget;
  const fehler = $('#fehler');
  const knopf = $('#absenden');
  const body = formularLesen(formular);

  const fehlt = fehlendeFrage(body);
  if (fehlt) {
    fehler.textContent = TEXT.fehlt + fehlt.frage[SPRACHE];
    fehler.hidden = false;
    formular.querySelector(`[data-key="${fehlt.key}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  fehler.hidden = true;
  knopf.disabled = true;
  knopf.textContent = TEXT.sendet;
  try {
    const antwort = await fetch('/api/antwort', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    });
    const ergebnis = await antwort.json();
    if (!antwort.ok) throw new Error(ergebnis.fehler || TEXT.sendenFehler);
    merkerSetzen();
    zeigeDanke();
    await ergebnisseLaden();
    $('#ergebnisse').scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    fehler.textContent = e.message || TEXT.sendenFehler;
    fehler.hidden = false;
    knopf.disabled = false;
    knopf.textContent = TEXT.senden;
  }
}

function zeigeDanke() {
  $('#umfrage-formular').hidden = true;
  $('#danke').hidden = false;
}

function prozent(teil, ganz) {
  return ganz ? Math.round((teil / ganz) * 100) : 0;
}

async function ergebnisseLaden() {
  const stand = $('#ergebnis-stand');
  const liste = $('#ergebnis-liste');
  try {
    const antwort = await fetch('/api/ergebnisse');
    const { gesamt, auswertung } = await antwort.json();
    stand.textContent = gesamt === 1 ? TEXT.eine : TEXT.viele(gesamt.toLocaleString(TEXT.zahl));
    liste.replaceChildren();
    if (gesamt === 0) {
      liste.append(el('p', { text: TEXT.keine }));
      return;
    }
    for (const f of fragen) {
      const { beantwortet, zaehler } = auswertung[f.key];
      const block = el('div', { class: 'ergebnis-frage' }, el('h3', { text: f.frage[SPRACHE] }));
      const meta = f.typ === 'mehrere' ? TEXT.mehrfach(beantwortet) : TEXT.beantwortet(beantwortet);
      block.append(el('p', { class: 'ergebnis-meta', text: meta }));
      const sortiert = Object.entries(zaehler).sort((a, b) => b[1] - a[1]);
      for (const [wert, anzahl] of sortiert) {
        const p = prozent(anzahl, beantwortet);
        const balken = el('div', { class: 'balken', role: 'presentation' }, el('span', { style: `width:${p}%` }));
        block.append(el('div', { class: 'ergebnis-zeile' },
          el('div', { class: 'ergebnis-text' }, el('span', { text: f.optionen[wert][SPRACHE] }), el('span', { text: `${p} % (${anzahl})` })),
          balken));
      }
      liste.append(block);
    }
  } catch {
    stand.textContent = TEXT.ladeFehler;
  }
}

async function starten() {
  try {
    fragen = await (await fetch('/api/fragen')).json();
  } catch {
    $('#fragen').textContent = TEXT.umfrageFehler;
    return;
  }
  $('#fragen').replaceChildren(...fragen.map(frageZeichnen));
  $('#absenden').textContent = TEXT.senden;
  $('#umfrage-formular').addEventListener('submit', absenden);
  if (merkerLesen()) zeigeDanke();
  ergebnisseLaden();
}

starten();
