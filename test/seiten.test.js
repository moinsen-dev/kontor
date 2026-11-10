import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeFinden, ROUTEN } from '../src/seiten/layout.js';
import worker from '../src/worker.js';
import { SATZUNG, CHARTA, alsMarkdown } from '../src/satzung.js';

test('every page has a German and an English route that resolve back', () => {
  for (const [seite, wege] of Object.entries(ROUTEN)) {
    assert.deepEqual(routeFinden(wege.de), { seite, sprache: 'de' });
    assert.deepEqual(routeFinden(wege.en), { seite, sprache: 'en' });
  }
  assert.deepEqual(routeFinden('/en'), { seite: 'start', sprache: 'en' });
  assert.deepEqual(routeFinden('/umfrage/'), { seite: 'umfrage', sprache: 'de' });
  assert.equal(routeFinden('/gibts-nicht'), null);
});

test('every page renders in both languages with hreflang, repo link and its own language', async () => {
  for (const wege of Object.values(ROUTEN)) {
    for (const [sprache, pfad] of Object.entries(wege)) {
      const antwort = await worker.fetch(new Request(`https://kontor.moinsen.dev${pfad}`), {});
      assert.equal(antwort.status, 200, pfad);
      const text = await antwort.text();
      assert.match(text, new RegExp(`<html lang="${sprache}">`), pfad);
      assert.match(text, /hreflang="de"/, pfad);
      assert.match(text, /hreflang="en"/, pfad);
      assert.match(text, /github\.com\/moinsen-dev\/kontor/, pfad);
      assert.doesNotMatch(text, /undefined/, pfad);
    }
  }
});

// The tax office checks these clauses against the model statutes (Annex 1 to § 60 AO).
test('draft statutes contain the clauses required by the model statutes', () => {
  const text = SATZUNG.flatMap((p) => p.absaetze.map((a) => a.de)).join(' ');
  for (const pflicht of [
    'verfolgt ausschließlich und unmittelbar gemeinnützige Zwecke im Sinne des Abschnitts „Steuerbegünstigte Zwecke“ der Abgabenordnung',
    'Der Verein ist selbstlos tätig; er verfolgt nicht in erster Linie eigenwirtschaftliche Zwecke.',
    'Mittel des Vereins dürfen nur für die satzungsmäßigen Zwecke verwendet werden.',
    'Die Mitglieder erhalten keine Zuwendungen aus Mitteln des Vereins.',
    'Es darf keine Person durch Ausgaben, die dem Zweck des Vereins fremd sind, oder durch unverhältnismäßig hohe Vergütungen begünstigt werden.',
    'Bei Auflösung des Vereins oder bei Wegfall steuerbegünstigter Zwecke fällt das Vermögen des Vereins an eine juristische Person des öffentlichen Rechts oder eine andere steuerbegünstigte Körperschaft',
  ]) assert.ok(text.includes(pflicht), pflicht);
  assert.match(text, /Die Satzungszwecke werden insbesondere verwirklicht durch/);
});

test('every clause and principle is translated', () => {
  for (const p of SATZUNG) {
    assert.ok(p.titel.de && p.titel.en);
    for (const a of p.absaetze) assert.ok(a.de && a.en, a.de);
  }
  for (const c of CHARTA) assert.ok(c.de && c.en);
  assert.match(alsMarkdown(), /^# Kontor/);
});
