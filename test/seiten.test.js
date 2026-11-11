import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { routeFinden, ROUTEN } from '../src/seiten/layout.js';
import { STUFEN, ENTWUERFE } from '../src/roadmap.js';
import worker from '../src/worker.js';
import { SATZUNG, CHARTA, alsMarkdown } from '../src/satzung.js';
import { EINWILLIGUNG } from '../src/abo.js';
import { NEUIGKEITEN, updateMail } from '../src/neuigkeiten.js';

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

test('the updates page offers the double opt-in form, the trap field and the feed in both languages', async () => {
  for (const [pfad, feed, einwilligung] of [
    ['/neuigkeiten', '/neuigkeiten.xml', EINWILLIGUNG.de],
    ['/en/updates', '/en/updates.xml', EINWILLIGUNG.en],
  ]) {
    const text = await (await worker.fetch(new Request(`https://kontor.moinsen.dev${pfad}`), {})).text();
    assert.match(text, /id="abo-formular"/, pfad);
    assert.match(text, /type="email" name="email"/, pfad);
    assert.match(text, /type="checkbox" name="einwilligung"/, pfad);
    assert.doesNotMatch(text, /name="einwilligung" [^>]*checked/, pfad);
    assert.match(text, /class="falle"/, pfad);
    assert.ok(text.includes(einwilligung), pfad);
    assert.ok(text.includes(`type="application/rss+xml" title="Kontor" href="https://kontor.moinsen.dev${feed}"`), pfad);
    assert.match(text, /src="\/static\/neuigkeiten\.js"/, pfad);
    for (const n of NEUIGKEITEN) assert.ok(text.includes(`id="n-${n.id}"`), pfad);
  }
});

test('the feeds are well-formed RSS in their own language with every update', async () => {
  for (const [pfad, sprache] of [['/neuigkeiten.xml', 'de'], ['/en/updates.xml', 'en']]) {
    const antwort = await worker.fetch(new Request(`https://kontor.moinsen.dev${pfad}`), {});
    assert.equal(antwort.status, 200, pfad);
    assert.match(antwort.headers.get('content-type'), /application\/rss\+xml/, pfad);
    const text = await antwort.text();
    assert.match(text, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<rss version="2\.0">/, pfad);
    assert.ok(text.includes(`<language>${sprache}</language>`), pfad);
    assert.equal(text.match(/<item>/g).length, NEUIGKEITEN.length, pfad);
    assert.doesNotMatch(text, /undefined|Invalid Date/, pfad);
    assert.doesNotMatch(text.replace(/&(amp|lt|gt|quot|apos);/g, ''), /&/, `${pfad}: raw ampersand`);
  }
});

test('an update mail has text, html and its unsubscribe link in the right language', () => {
  for (const n of NEUIGKEITEN) {
    assert.ok(n.titel.de && n.titel.en && n.text.de && n.text.en, n.id);
    const link = 'https://kontor.moinsen.dev/en/updates?abmelden=abc';
    const mail = updateMail(n, 'en', link);
    assert.ok(mail.betreff.includes(n.titel.en), n.id);
    assert.ok(mail.text.includes(`Unsubscribe: ${link}`), n.id);
    assert.ok(mail.html.includes(`href="${link}"`), n.id);
    assert.match(updateMail(n, 'de', link).text, /Abmelden: /, n.id);
  }
});

test('the roadmap page lists exactly the features of the design document', () => {
  const dokument = readFileSync(new URL('../docs/roadmap.md', import.meta.url), 'utf8');
  const stufen = dokument.slice(dokument.indexOf('## Stage 1'), dokument.indexOf('## Standing commitments'));
  const imDokument = [...stufen.matchAll(/^\| \*\*(.+?)\*\* \|/gm)].map((m) => m[1]);
  const aufDerSeite = STUFEN.flatMap((s) => s.funktionen.map((f) => f.titel.en));
  assert.deepEqual(aufDerSeite, imDokument);
  for (const s of STUFEN) for (const f of s.funktionen) assert.ok(f.titel.de && f.text.de && f.text.en, f.titel.en);
});

test('the roadmap page links every draft and says nothing is built yet', async () => {
  for (const [pfad, hinweis] of [['/roadmap', /Gebaut ist davon noch nichts/], ['/en/roadmap', /None of it is built yet/]]) {
    const text = await (await worker.fetch(new Request(`https://kontor.moinsen.dev${pfad}`), {})).text();
    assert.match(text, hinweis, pfad);
    for (const e of ENTWUERFE) {
      assert.ok(text.includes(`/blob/main/docs/${e.datei}"`), e.datei);
      assert.ok(existsSync(new URL(`../docs/${e.datei}`, import.meta.url)), e.datei);
    }
  }
});

test('no public page still asks people to move away from LinkedIn', async () => {
  for (const pfad of ['/', '/en/', '/mitmachen', '/en/join']) {
    const text = await (await worker.fetch(new Request(`https://kontor.moinsen.dev${pfad}`), {})).text();
    assert.doesNotMatch(text, /zieht allein um|moves alone|als Erster umziehen|move first/, pfad);
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
