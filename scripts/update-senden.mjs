#!/usr/bin/env node
// Send one update to all confirmed subscribers – always preview first.
//   secretariat run kontor -- node scripts/update-senden.mjs <update-id>            preview to business@moinsen.dev only
//   secretariat run kontor -- node scripts/update-senden.mjs <update-id> --senden   send to everyone not yet mailed
// Reads subscribers and records deliveries in the remote D1 via wrangler, so a resumed run never mails anyone twice.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { NEUIGKEITEN, updateMail } from '../src/neuigkeiten.js';

const [id, modus] = process.argv.slice(2);
const n = NEUIGKEITEN.find((x) => x.id === id);
if (!n) { console.error(`Unbekannte Update-ID. Vorhanden: ${NEUIGKEITEN.map((x) => x.id).join(', ')}`); process.exit(1); }
const key = process.env.RESEND_API_KEY;
if (!key || key.length < 20) { console.error('RESEND_API_KEY fehlt. Mit `secretariat run kontor -- …` starten.'); process.exit(1); }

const BASIS = 'https://kontor.moinsen.dev';
const ABSENDER = 'Kontor <business@moinsen.dev>';
const sha = (v) => createHash('sha256').update(v).digest('hex');

function d1(sql) {
  const aus = execFileSync('wrangler', ['d1', 'execute', 'kontor', '--remote', '--json', '--command', sql], { encoding: 'utf8' });
  return JSON.parse(aus)[0].results;
}

async function batch(mails, schluessel) {
  const antwort = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', 'idempotency-key': schluessel },
    body: JSON.stringify(mails),
  });
  if (!antwort.ok) throw new Error(`Resend ${antwort.status}: ${await antwort.text()}`);
}

function mailFuer(abo) {
  const abmelden = `${BASIS}${abo.sprache === 'en' ? '/en/updates' : '/neuigkeiten'}?abmelden=${abo.abmelde_token}`;
  const m = updateMail(n, abo.sprache, abmelden);
  return {
    from: ABSENDER, to: [abo.email], reply_to: 'business@moinsen.dev', subject: m.betreff, text: m.text, html: m.html,
    headers: {
      'X-Moinsen-Art': 'routine',
      'List-Unsubscribe': `<${BASIS}/api/abo/abmelden?token=${abo.abmelde_token}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
}

if (modus !== '--senden') {
  const vorschau = ['de', 'en'].map((sprache) => {
    const m = mailFuer({ email: 'business@moinsen.dev', sprache, abmelde_token: 'VORSCHAU' });
    return { ...m, subject: `[Vorschau] ${m.subject}` };
  });
  await batch(vorschau, `kontor-vorschau/${id}/${sha(JSON.stringify(n)).slice(0, 16)}`);
  const offen = d1(`SELECT COUNT(*) AS n FROM abos WHERE status = 'bestaetigt' AND id NOT IN (SELECT abo_id FROM versand WHERE update_id = '${id}')`)[0].n;
  console.log(`Vorschau (de + en) an business@moinsen.dev gesendet. Empfänger beim echten Versand: ${offen}.`);
  console.log(`Senden mit: secretariat run kontor -- node scripts/update-senden.mjs ${id} --senden`);
  process.exit(0);
}

let gesamt = 0;
for (;;) {
  const abos = d1(`SELECT id, email, sprache, abmelde_token FROM abos WHERE status = 'bestaetigt'
    AND id NOT IN (SELECT abo_id FROM versand WHERE update_id = '${id}') ORDER BY id LIMIT 100`);
  if (!abos.length) break;
  // The key names the exact recipients, so a retried request cannot mail them twice.
  await batch(abos.map(mailFuer), `kontor-update/${id}/${sha(abos.map((a) => a.id).join(',')).slice(0, 32)}`);
  const jetzt = Math.floor(Date.now() / 1000);
  d1(`INSERT OR IGNORE INTO versand (update_id, abo_id, gesendet_am) VALUES ${abos.map((a) => `('${id}', '${a.id}', ${jetzt})`).join(', ')}`);
  gesamt += abos.length;
  console.log(`… ${gesamt} gesendet`);
}
console.log(`Fertig: Update ${id} an ${gesamt} Abonnentinnen und Abonnenten gesendet.`);
