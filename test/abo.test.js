import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { abos, normalisieren, sha256, GRENZEN, EINWILLIGUNG, EINWILLIGUNG_VERSION } from '../src/abo.js';
import worker from '../src/worker.js';

const TAG = 86400;
const ADRESSE = 'test@example.org';

// The part of the D1 API the code uses, backed by a real SQLite and the real migration.
function d1() {
  const roh = new DatabaseSync(':memory:');
  roh.exec(readFileSync(new URL('../migrations/0004_abos.sql', import.meta.url), 'utf8'));
  const anweisung = (sql, werte = []) => ({
    bind: (...neu) => anweisung(sql, neu),
    first: async () => roh.prepare(sql).get(...werte) ?? null,
    run: async () => { roh.prepare(sql).run(...werte); return { success: true }; },
    all: async () => ({ results: roh.prepare(sql).all(...werte) }),
    ausfuehren: () => roh.prepare(sql).run(...werte),
  });
  return {
    roh,
    prepare: (sql) => anweisung(sql),
    batch: async (liste) => {
      roh.exec('BEGIN');
      try {
        for (const a of liste) a.ausfuehren();
        roh.exec('COMMIT');
      } catch (fehler) {
        roh.exec('ROLLBACK');
        throw fehler;
      }
    },
  };
}

function aufbau() {
  const db = d1();
  const uhr = { jetzt: 1_800_000_000 };
  const mails = [];
  const zustand = { kaputt: false };
  const dienst = abos({
    db,
    ursprung: 'https://kontor.moinsen.dev',
    jetzt: () => uhr.jetzt,
    senden: async (mail, schluessel) => {
      if (zustand.kaputt) throw new Error('Resend 500');
      mails.push({ ...mail, schluessel });
    },
  });
  const zeilen = () => db.roh.prepare('SELECT * FROM abos').all();
  const token = (mail) => new URL(mail.text.match(/https:\S+/)[0]).searchParams.get('bestaetigen');
  const anmelden = (extra = {}) => dienst.anmelden({ email: ADRESSE, einwilligung: true, ...extra });
  return { db, uhr, mails, zustand, dienst, zeilen, token, anmelden };
}

test('addresses are trimmed, lower-cased and validated', () => {
  assert.equal(normalisieren('  Test@Example.ORG '), ADRESSE);
  for (const falsch of ['', 'kein-at', 'a@b', 'a b@example.org', null, 42]) assert.equal(normalisieren(falsch), null);
});

test('a sign-up without a valid address or explicit consent is refused and sends nothing', async () => {
  const { dienst, mails, zeilen } = aufbau();
  assert.deepEqual(await dienst.anmelden({ email: 'kaputt', einwilligung: true }), { status: 'ungueltig' });
  assert.deepEqual(await dienst.anmelden({ email: ADRESSE, einwilligung: false }), { status: 'ungueltig' });
  assert.deepEqual(await dienst.anmelden({ email: ADRESSE, einwilligung: 'on' }), { status: 'ungueltig' });
  assert.equal(mails.length, 0);
  assert.equal(zeilen().length, 0);
});

test('a filled trap field looks accepted but stores and sends nothing', async () => {
  const { anmelden, mails, zeilen } = aufbau();
  assert.deepEqual(await anmelden({ website: 'https://spam.example' }), { status: 'angenommen' });
  assert.equal(mails.length, 0);
  assert.equal(zeilen().length, 0);
});

test('full lifecycle: subscribe, confirm, confirm again, unsubscribe, unsubscribe again', async () => {
  const { db, dienst, anmelden, mails, zeilen, token } = aufbau();
  assert.deepEqual(await anmelden(), { status: 'angenommen' });
  assert.equal(mails.length, 1);
  assert.deepEqual(mails[0].to, [ADRESSE]);
  assert.match(mails[0].schluessel, /^kontor-bestaetigung\//);

  const geheim = token(mails[0]);
  const [offen] = zeilen();
  assert.equal(offen.status, 'offen');
  assert.equal(offen.einwilligung, EINWILLIGUNG_VERSION);
  assert.equal(offen.token_hash, await sha256(geheim));
  assert.ok(!JSON.stringify(offen).includes(geheim), 'the confirmation token is only stored hashed');
  assert.equal(await dienst.anzahl(), 0);

  assert.deepEqual(await dienst.bestaetigen(geheim), { status: 'bestaetigt' });
  assert.equal(await dienst.anzahl(), 1);
  const erstesMal = zeilen()[0].bestaetigt_am;
  assert.ok(erstesMal);
  assert.deepEqual(await dienst.bestaetigen(geheim), { status: 'bestaetigt' }, 'a second click on the mail link is no error');
  assert.equal(zeilen()[0].bestaetigt_am, erstesMal);

  const { id, abmelde_token: abmelden } = zeilen()[0];
  db.roh.prepare('INSERT INTO versand VALUES (?, ?, ?)').run('2026-11-10', id, 1);
  assert.deepEqual(await dienst.abmelden(abmelden), { status: 'abgemeldet' });
  assert.equal(zeilen().length, 0, 'the address is deleted');
  assert.equal(db.roh.prepare('SELECT COUNT(*) AS n FROM versand').get().n, 0, 'delivery records are deleted too');
  assert.deepEqual(await dienst.abmelden(abmelden), { status: 'abgemeldet' });
});

test('the same address gets the same answer whatever its state, and confirmed ones get no mail', async () => {
  const { dienst, anmelden, mails, token, uhr } = aufbau();
  const neu = await anmelden();
  const offen = await anmelden();
  assert.deepEqual(offen, neu);
  await dienst.bestaetigen(token(mails[0]));
  uhr.jetzt += 30 * TAG;
  const bestaetigt = await anmelden();
  assert.deepEqual(bestaetigt, neu);
  assert.equal(mails.length, 1);
});

test('confirmation mails are limited to one a day and three per address', async () => {
  const { anmelden, mails, uhr, zeilen } = aufbau();
  await anmelden();
  await anmelden();
  assert.equal(mails.length, 1, 'no second mail within a day');
  for (let i = 0; i < 2; i++) {
    uhr.jetzt += GRENZEN.erneutNachSekunden + 1;
    await anmelden();
  }
  assert.equal(mails.length, GRENZEN.bestaetigungenProAdresse);
  uhr.jetzt += GRENZEN.erneutNachSekunden + 1;
  await anmelden();
  assert.equal(mails.length, GRENZEN.bestaetigungenProAdresse, 'no fourth mail');
  assert.equal(zeilen()[0].mails, GRENZEN.bestaetigungenProAdresse);
});

test('a newer confirmation mail replaces the older link', async () => {
  const { dienst, anmelden, mails, uhr, token } = aufbau();
  await anmelden();
  uhr.jetzt += TAG + 1;
  await anmelden();
  assert.deepEqual(await dienst.bestaetigen(token(mails[0])), { status: 'ungueltig' });
  assert.deepEqual(await dienst.bestaetigen(token(mails[1])), { status: 'bestaetigt' });
});

test('a link from a repeated request stays valid for the promised seven days', async () => {
  const { dienst, anmelden, mails, uhr, token } = aufbau();
  await anmelden();
  uhr.jetzt += 6 * TAG;
  await anmelden();
  uhr.jetzt += 6 * TAG;
  assert.deepEqual(await dienst.bestaetigen(token(mails[1])), { status: 'bestaetigt' });
});

test('an unconfirmed address expires after seven days and a confirmed one stays', async () => {
  const { dienst, anmelden, mails, uhr, token, zeilen } = aufbau();
  await anmelden();
  await dienst.anmelden({ email: 'bleibt@example.org', einwilligung: true });
  await dienst.bestaetigen(token(mails[1]));

  uhr.jetzt += GRENZEN.offenTage * TAG + 1;
  assert.deepEqual(await dienst.bestaetigen(token(mails[0])), { status: 'ungueltig' });
  assert.deepEqual(await dienst.bestaetigen(token(mails[1])), { status: 'bestaetigt' }, 'old links of confirmed addresses are no error');
  await dienst.aufraeumen();
  assert.deepEqual(zeilen().map((z) => z.email), ['bleibt@example.org']);
});

test('the global caps stop confirmation mails', async () => {
  const { dienst, anmelden, mails, uhr, db } = aufbau();
  const eintragen = db.roh.prepare("INSERT INTO abo_ereignisse (am, art) VALUES (?, 'bestaetigung')");
  for (let i = 0; i < GRENZEN.mailsProStunde; i++) eintragen.run(uhr.jetzt - 60);
  assert.deepEqual(await anmelden(), { status: 'ausgelastet' });
  assert.equal(mails.length, 0);
  uhr.jetzt += 3600;
  for (let i = 0; i < GRENZEN.mailsProTag - GRENZEN.mailsProStunde; i++) eintragen.run(uhr.jetzt - 7200);
  assert.deepEqual(await dienst.anmelden({ email: 'tag@example.org', einwilligung: true }), { status: 'ausgelastet' });
  assert.equal(mails.length, 0);
});

test('when the provider refuses, nothing is stored and the person can try again', async () => {
  const { anmelden, mails, zeilen, zustand } = aufbau();
  zustand.kaputt = true;
  await assert.rejects(anmelden());
  assert.equal(zeilen().length, 0);
  zustand.kaputt = false;
  await anmelden();
  assert.equal(mails.length, 1);
});

test('mails and links follow the language of the page', async () => {
  const { anmelden, mails, zeilen } = aufbau();
  await anmelden({ sprache: 'en' });
  assert.match(mails[0].subject, /Please confirm/);
  assert.match(mails[0].text, /https:\/\/kontor\.moinsen\.dev\/en\/updates\?bestaetigen=/);
  assert.equal(zeilen()[0].sprache, 'en');
  assert.match(mails[0].html, /<html lang="en">/);
});

test('malformed tokens are refused', async () => {
  const { dienst } = aufbau();
  for (const falsch of ['', 'kurz', 'a'.repeat(65), "' OR 1=1 --aaaaaaaaaaaaaaaa", null, undefined, 7]) {
    assert.deepEqual(await dienst.bestaetigen(falsch), { status: 'ungueltig' });
    assert.deepEqual(await dienst.abmelden(falsch), { status: 'ungueltig' });
  }
});

// Changing the wording needs a new EINWILLIGUNG_VERSION, because consent is recorded by version.
test('the consent text is pinned to its version and the join page shows the identical wording', async () => {
  assert.equal(EINWILLIGUNG_VERSION, '2026-11-10');
  assert.equal(await sha256(`${EINWILLIGUNG.de}\n${EINWILLIGUNG.en}`), 'a5d5f4165780d1d1f7dd3bed2cf1f7accbe5b18894ac647e2732faed21eb65e5');
  const mitmachen = readFileSync(new URL('../public/static/mitmachen.js', import.meta.url), 'utf8');
  assert.ok(mitmachen.includes(EINWILLIGUNG.de));
  assert.ok(mitmachen.includes(EINWILLIGUNG.en));
});

test('the daily job deletes expired unconfirmed addresses without anyone signing up', async () => {
  const db = d1();
  const jetzt = Math.floor(Date.now() / 1000);
  const eintragen = db.roh.prepare(`INSERT INTO abos (id, email, status, abmelde_token, einwilligung, angefragt_am) VALUES (?, ?, ?, ?, '2026-11-10', ?)`);
  eintragen.run('a', 'alt@example.org', 'offen', 'token-a', jetzt - GRENZEN.offenTage * TAG - 60);
  eintragen.run('b', 'frisch@example.org', 'offen', 'token-b', jetzt - GRENZEN.offenTage * TAG + 3600);
  eintragen.run('c', 'bestaetigt@example.org', 'bestaetigt', 'token-c', jetzt - 400 * TAG);
  db.roh.prepare("INSERT INTO abo_ereignisse (am, art) VALUES (?, 'bestaetigung')").run(jetzt - 3 * TAG);

  await worker.scheduled({ cron: '17 3 * * *' }, { DB: db });

  const uebrig = db.roh.prepare('SELECT email FROM abos ORDER BY email').all().map((z) => z.email);
  assert.deepEqual(uebrig, ['bestaetigt@example.org', 'frisch@example.org']);
  assert.equal(db.roh.prepare('SELECT COUNT(*) AS n FROM abo_ereignisse').get().n, 0, 'old counters are removed too');
});

test('the daily job is configured', () => {
  assert.match(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8'), /"crons": \["17 3 \* \* \*"\]/);
});

const anfrage = (pfad, koerper, kopf = { 'content-type': 'application/json' }) => new Request(`https://kontor.moinsen.dev${pfad}`, {
  method: 'POST', headers: kopf, body: typeof koerper === 'string' ? koerper : JSON.stringify(koerper),
});

test('the API goes through the whole cycle against Resend, including one-click unsubscribe', async (t) => {
  const db = d1();
  const aufrufe = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    aufrufe.push({ url, init, mail: JSON.parse(init.body) });
    return new Response('{}', { status: 200 });
  });
  const env = { DB: db, RESEND_API_KEY: 're_test_schluessel' };

  const antwort = await worker.fetch(anfrage('/api/abo', { email: ADRESSE, einwilligung: true, _sprache: 'de' }), env);
  assert.equal(antwort.status, 200);
  assert.deepEqual(await antwort.json(), { ok: true });
  assert.equal(aufrufe.length, 1);
  assert.equal(aufrufe[0].url, 'https://api.resend.com/emails');
  assert.equal(aufrufe[0].init.headers.authorization, 'Bearer re_test_schluessel');
  assert.match(aufrufe[0].init.headers['idempotency-key'], /^kontor-bestaetigung\//);
  assert.equal(aufrufe[0].mail.from, 'Kontor <business@moinsen.dev>');

  const link = new URL(aufrufe[0].mail.text.match(/https:\S+/)[0]);
  assert.equal(link.pathname, '/neuigkeiten');
  const bestaetigt = await worker.fetch(anfrage('/api/abo/bestaetigen', { token: link.searchParams.get('bestaetigen') }), env);
  assert.equal(bestaetigt.status, 200);
  assert.equal(db.roh.prepare('SELECT status FROM abos').get().status, 'bestaetigt');

  // Mail programs send a form-encoded POST and the token in the query string.
  const { abmelde_token: abmelden } = db.roh.prepare('SELECT abmelde_token FROM abos').get();
  const weg = await worker.fetch(anfrage(`/api/abo/abmelden?token=${abmelden}`, 'List-Unsubscribe=One-Click', { 'content-type': 'application/x-www-form-urlencoded' }), env);
  assert.equal(weg.status, 200);
  assert.equal(db.roh.prepare('SELECT COUNT(*) AS n FROM abos').get().n, 0);
});

test('the API answers with understandable errors and never reveals provider details', async (t) => {
  const env = { DB: d1(), RESEND_API_KEY: 're_test_schluessel' };
  const ohneMailer = await worker.fetch(anfrage('/api/abo', { email: ADRESSE, einwilligung: true, _sprache: 'en' }), { DB: d1() });
  assert.equal(ohneMailer.status, 503);
  assert.match((await ohneMailer.json()).fehler, /not available/);

  const ungueltig = await worker.fetch(anfrage('/api/abo', { email: 'x', einwilligung: true }), env);
  assert.equal(ungueltig.status, 400);
  assert.match((await ungueltig.json()).fehler, /gültige E-Mail/);

  const kaputt = await worker.fetch(anfrage('/api/abo', 'kein json'), env);
  assert.equal(kaputt.status, 400);

  t.mock.method(globalThis, 'fetch', async () => new Response('geheimes Detail', { status: 500 }));
  const anbieter = await worker.fetch(anfrage('/api/abo', { email: ADRESSE, einwilligung: true }), env);
  assert.equal(anbieter.status, 502);
  assert.doesNotMatch(await anbieter.text(), /geheimes Detail|Resend/);
  assert.equal(env.DB.roh.prepare('SELECT COUNT(*) AS n FROM abos').get().n, 0);

  const falsch = await worker.fetch(anfrage('/api/abo/bestaetigen', { token: 'x'.repeat(30) }), env);
  assert.equal(falsch.status, 400);
});
