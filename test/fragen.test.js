import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FRAGEN, pruefen } from '../src/fragen.js';

const gueltig = () => ({
  nutzung: 'taeglich',
  stoert: ['ki_brei', 'daten'],
  gebracht: ['nichts'],
  besser_netz: 'xing',
  wuensche: ['gruppen', 'gesuche', 'keine_daten'],
  wechsel: 'parallel',
  mitmachen: ['testen'],
  rolle: 'selbststaendig',
  land: 'de',
  freitext_stoert: '  Zu viel KI.  ',
  freitext_wunsch: '',
});

test('accepts a complete answer and normalises it', () => {
  const r = pruefen(gueltig());
  assert.equal(r.ok, true);
  assert.equal(r.row.nutzung, 'taeglich');
  assert.equal(r.row.stoert, '["ki_brei","daten"]');
  assert.equal(r.row.freitext_stoert, 'Zu viel KI.');
  assert.equal(r.row.freitext_wunsch, null);
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

test('rejects a missing mandatory question', () => {
  const body = gueltig();
  body.stoert = [];
  const r = pruefen(body);
  assert.equal(r.ok, false);
  assert.match(r.fehler, /Was stört dich/);
});

test('rejects unknown option values', () => {
  const body = gueltig();
  body.wechsel = 'vielleicht';
  assert.equal(pruefen(body).ok, false);
});

test('enforces the maximum of three wishes', () => {
  const body = gueltig();
  body.wuensche = ['gruppen', 'gesuche', 'keine_daten', 'mitnehmen'];
  const r = pruefen(body);
  assert.equal(r.ok, false);
  assert.match(r.fehler, /Höchstens 3/);
});

test('rejects overlong free text', () => {
  const body = gueltig();
  body.freitext_wunsch = 'x'.repeat(1001);
  assert.equal(pruefen(body).ok, false);
});

test('every question has a unique key and at least two options', () => {
  const keys = FRAGEN.map((f) => f.key);
  assert.equal(new Set(keys).size, keys.length);
  for (const f of FRAGEN) assert.ok(Object.keys(f.optionen).length >= 2, f.key);
});
