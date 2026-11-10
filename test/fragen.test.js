import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FRAGEN, SPRACHEN, pruefen } from '../src/fragen.js';

const gueltig = () => ({
  nutzung: 'taeglich',
  stoert: ['ki_brei', 'daten'],
  gebracht: ['nichts'],
  besser_netz: 'xing',
  wuensche: ['gruppen', 'gesuche', 'keine_daten'],
  wechsel: 'parallel',
  mitmachen: ['testen'],
  rolle: 'selbststaendig',
  land: 'DE',
  freitext_stoert: '  Zu viel KI.  ',
  freitext_wunsch: '',
});

test('accepts a complete answer and normalises it', () => {
  const r = pruefen(gueltig());
  assert.equal(r.ok, true);
  assert.equal(r.row.sprache, 'de');
  assert.equal(r.row.nutzung, 'taeglich');
  assert.equal(r.row.stoert, '["ki_brei","daten"]');
  assert.equal(r.row.freitext_stoert, 'Zu viel KI.');
  assert.equal(r.row.freitext_wunsch, null);
});

test('records English answers and falls back to German for unknown languages', () => {
  assert.equal(pruefen(gueltig(), 'en').row.sprache, 'en');
  assert.equal(pruefen(gueltig(), 'fr').row.sprache, 'de');
});

test('optional single choices may be empty', () => {
  const body = gueltig();
  delete body.rolle;
  body.land = '';
  const r = pruefen(body);
  assert.equal(r.ok, true);
  assert.equal(r.row.rolle, null);
  assert.equal(r.row.land, null);
});

test('rejects a missing mandatory question in the page language', () => {
  const body = gueltig();
  body.stoert = [];
  assert.match(pruefen(body, 'de').fehler, /Bitte beantworte: Was stört dich/);
  assert.match(pruefen(body, 'en').fehler, /Please answer: What bothers you/);
});

test('rejects unknown option values', () => {
  const body = gueltig();
  body.wechsel = 'vielleicht';
  assert.equal(pruefen(body).ok, false);
});

test('enforces the maximum of three wishes', () => {
  const body = gueltig();
  body.wuensche = ['gruppen', 'gesuche', 'keine_daten', 'mitnehmen'];
  const r = pruefen(body, 'en');
  assert.equal(r.ok, false);
  assert.match(r.fehler, /At most 3/);
});

test('rejects overlong free text', () => {
  const body = gueltig();
  body.freitext_wunsch = 'x'.repeat(1001);
  assert.equal(pruefen(body).ok, false);
});

test('every question and option is translated into every language', () => {
  const keys = FRAGEN.map((f) => f.key);
  assert.equal(new Set(keys).size, keys.length);
  for (const f of FRAGEN) {
    if (f.typ !== 'land') assert.ok(Object.keys(f.optionen).length >= 2, f.key);
    for (const s of SPRACHEN) {
      assert.ok(f.frage[s], `${f.key} question ${s}`);
      if (f.hinweis) assert.ok(f.hinweis[s], `${f.key} hint ${s}`);
      for (const [k, o] of Object.entries(f.optionen)) assert.ok(o[s], `${f.key}.${k} ${s}`);
    }
  }
});

test('country accepts ISO codes only', () => {
  const body = gueltig();
  body.land = 'BR';
  assert.equal(pruefen(body).row.land, 'BR');
  body.land = 'de';
  assert.equal(pruefen(body).ok, false);
});

test('industry is optional and validated', () => {
  const body = gueltig();
  body.branche = 'it';
  assert.equal(pruefen(body).row.branche, 'it');
  body.branche = 'raumfahrt';
  assert.equal(pruefen(body).ok, false);
});
