import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zusagePruefen, zusagenAuswerten, wilson, ZUSAGEN } from '../src/beteiligung.js';

const ID = '3f2b8c1e-4d5a-4b6c-9d7e-1a2b3c4d5e6f';

test('a plain "I’m in" pledge needs no e-mail', () => {
  const r = zusagePruefen({ art: 'mitkommen', browser: ID });
  assert.equal(r.ok, true);
  assert.equal(r.row.email, null);
});

test('founding requires an e-mail address and consent', () => {
  assert.equal(zusagePruefen({ art: 'gruenden', browser: ID }).ok, false);
  assert.match(zusagePruefen({ art: 'gruenden', browser: ID, email: 'a@b.de' }).fehler, /bestätige/);
  const ok = zusagePruefen({ art: 'gruenden', browser: ID, email: ' A@B.de ', einwilligung: true }, 'en');
  assert.equal(ok.ok, true);
  assert.equal(ok.row.email, 'a@b.de');
  assert.equal(ok.row.sprache, 'en');
});

test('building and donating need their details', () => {
  assert.equal(zusagePruefen({ art: 'mitbauen', browser: ID, faehigkeiten: [] }).ok, false);
  assert.equal(zusagePruefen({ art: 'mitbauen', browser: ID, faehigkeiten: ['design', 'recht'] }).ok, true);
  assert.equal(zusagePruefen({ art: 'spenden', browser: ID, betrag: 'm1000' }).ok, false);
  assert.equal(zusagePruefen({ art: 'spenden', browser: ID, betrag: 'm10' }).ok, true);
});

test('rejects unknown kinds and malformed browser ids', () => {
  assert.equal(zusagePruefen({ art: 'kaufen', browser: ID }).ok, false);
  assert.equal(zusagePruefen({ art: 'mitkommen', browser: 'x' }).ok, false);
});

test('aggregation counts pledges, sums monthly amounts and never exposes e-mails', () => {
  const stand = zusagenAuswerten([
    { art: 'spenden', details: '{"betrag":"m10"}', email: 'geheim@x.de' },
    { art: 'spenden', details: '{"betrag":"einmalig"}' },
    { art: 'mitbauen', details: '{"faehigkeiten":["design"]}' },
    { art: 'gruenden', details: null, email: 'g@x.de' },
  ]);
  assert.equal(stand.spenden.anzahl, 2);
  assert.equal(stand.spenden.summe, 10);
  assert.equal(stand.mitbauen.faehigkeiten.design, 1);
  assert.equal(stand.gruenden.schwelle, ZUSAGEN.gruenden.schwelle);
  assert.ok(!JSON.stringify(stand).includes('@'));
});

test('Wilson ranking prefers many positive votes over a single one', () => {
  assert.equal(wilson(0, 0), 0);
  assert.ok(wilson(40, 5) > wilson(1, 0));
  assert.ok(wilson(5, 0) > wilson(5, 5));
});
