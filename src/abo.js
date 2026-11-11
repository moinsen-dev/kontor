// E-mail updates with double opt-in, following the proven pattern from crypto_oracle:
// links in mails open a page; only a button there changes anything (mail scanners follow links, they don't press buttons),
// answers never reveal whether an address is known, and no IP addresses are stored.

const t = (de, en) => ({ de, en });

export const EINWILLIGUNG_VERSION = '2026-11-10';
export const EINWILLIGUNG = t(
  'Ja, schickt mir Neuigkeiten zum Fortschritt von Kontor per E-Mail (höchstens etwa einmal im Monat). Keine Werbung, keine Weitergabe. Abmelden geht jederzeit mit einem Klick.',
  'Yes, send me news about Kontor’s progress by e-mail (about once a month at most). No advertising, never passed on. Unsubscribe at any time with one click.',
);

export const GRENZEN = { offenTage: 7, bestaetigungenProAdresse: 3, erneutNachSekunden: 86400, mailsProStunde: 40, mailsProTag: 300 };
const ABSENDER = 'Kontor <business@moinsen.dev>';
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

export const normalisieren = (wert) => {
  const e = typeof wert === 'string' ? wert.trim().toLowerCase() : '';
  return EMAIL.test(e) ? e : null;
};

const hex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
export const sha256 = async (text) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
const zufall = (n = 24) => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(n))))
  .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');

const PFAD = { de: '/neuigkeiten', en: '/en/updates' };

export function bestaetigungsMail({ sprache, link }) {
  const de = sprache !== 'en';
  const betreff = de ? 'Bitte bestätige deine Anmeldung zu Kontor-Neuigkeiten' : 'Please confirm your subscription to Kontor updates';
  const text = de
    ? `Hallo,\n\njemand – hoffentlich du – möchte Neuigkeiten zum Fortschritt von Kontor erhalten, dem geplanten offenen, gemeinnützigen Berufsnetz.\n\nBitte öffne diesen Link und bestätige dort mit einem Klick:\n${link}\n\nWenn du das nicht warst, ignoriere diese Mail einfach. Ohne Bestätigung löschen wir die Adresse nach sieben Tagen.\n\nUlrich Diedrichsen\nKontor · https://kontor.moinsen.dev`
    : `Hello,\n\nsomeone – hopefully you – asked for news about the progress of Kontor, the planned open, non-profit professional network.\n\nPlease open this link and confirm there with one click:\n${link}\n\nIf this wasn’t you, simply ignore this e-mail. Without confirmation we delete the address after seven days.\n\nUlrich Diedrichsen\nKontor · https://kontor.moinsen.dev`;
  const html = `<!doctype html><html lang="${de ? 'de' : 'en'}"><body style="font:16px/1.6 system-ui,sans-serif;color:#1d2433;max-width:560px;margin:0 auto;padding:24px">
<p>${de ? 'Hallo,' : 'Hello,'}</p>
<p>${de ? 'jemand – hoffentlich du – möchte Neuigkeiten zum Fortschritt von Kontor erhalten, dem geplanten offenen, gemeinnützigen Berufsnetz.' : 'someone – hopefully you – asked for news about the progress of Kontor, the planned open, non-profit professional network.'}</p>
<p><a href="${link}" style="display:inline-block;background:#a3472f;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">${de ? 'Anmeldung bestätigen' : 'Confirm subscription'}</a></p>
<p style="color:#556070;font-size:14px">${de ? 'Wenn du das nicht warst, ignoriere diese Mail einfach. Ohne Bestätigung löschen wir die Adresse nach sieben Tagen.' : 'If this wasn’t you, simply ignore this e-mail. Without confirmation we delete the address after seven days.'}</p>
<p style="color:#556070;font-size:14px">Ulrich Diedrichsen · Kontor · <a href="https://kontor.moinsen.dev" style="color:#a3472f">kontor.moinsen.dev</a></p>
</body></html>`;
  return { betreff, text, html };
}

// db: D1-compatible (prepare/bind/first/run/all/batch). senden: async ({ from, to, subject, text, html, headers, reply_to }, schluessel).
export function abos({ db, senden, ursprung, jetzt = () => Math.floor(Date.now() / 1000), token = zufall }) {
  const zaehlen = async (art, seit) => (await db.prepare('SELECT COUNT(*) AS n FROM abo_ereignisse WHERE art = ? AND am > ?').bind(art, seit).first()).n;

  // Removes addresses that were never confirmed in time, as promised in the mail and the privacy policy.
  async function aufraeumen() {
    const am = jetzt();
    await db.batch([
      db.prepare("DELETE FROM abos WHERE status = 'offen' AND angefragt_am < ?").bind(am - GRENZEN.offenTage * 86400),
      db.prepare('DELETE FROM abo_ereignisse WHERE am < ?').bind(am - 2 * 86400),
    ]);
  }

  async function anmelden({ email: eingabe, einwilligung, sprache = 'de', website = '' }) {
    const email = normalisieren(eingabe);
    const s = sprache === 'en' ? 'en' : 'de';
    if (!email || einwilligung !== true) return { status: 'ungueltig' };
    if (website) return { status: 'angenommen' }; // trap field filled: a script
    const am = jetzt();
    await aufraeumen();
    const da = await db.prepare('SELECT * FROM abos WHERE email = ?').bind(email).first();
    // Never reveal whether an address is known, pending or confirmed.
    if (da?.status === 'bestaetigt') return { status: 'angenommen' };
    if (da && (da.mails >= GRENZEN.bestaetigungenProAdresse || am - da.letzte_mail_am < GRENZEN.erneutNachSekunden)) return { status: 'angenommen' };
    if (await zaehlen('bestaetigung', am - 3600) >= GRENZEN.mailsProStunde || await zaehlen('bestaetigung', am - 86400) >= GRENZEN.mailsProTag) {
      return { status: 'ausgelastet' };
    }
    const geheim = token();
    const mail = bestaetigungsMail({ sprache: s, link: `${ursprung}${PFAD[s]}?bestaetigen=${geheim}` });
    // Mail first, record second: if the provider refuses, nothing is stored and the person can try again.
    await senden({
      from: ABSENDER, to: [email], reply_to: 'business@moinsen.dev', subject: mail.betreff, text: mail.text, html: mail.html,
      headers: { 'X-Moinsen-Art': 'handlung' },
    }, `kontor-bestaetigung/${(await sha256(geheim)).slice(0, 32)}`);
    await db.batch([
      db.prepare(`INSERT INTO abos (id, email, status, token_hash, abmelde_token, sprache, einwilligung, angefragt_am, mails, letzte_mail_am)
        VALUES (?, ?, 'offen', ?, ?, ?, ?, ?, 1, ?)
        ON CONFLICT(email) DO UPDATE SET token_hash = excluded.token_hash, einwilligung = excluded.einwilligung,
          sprache = excluded.sprache, angefragt_am = excluded.angefragt_am, mails = abos.mails + 1, letzte_mail_am = excluded.letzte_mail_am
        WHERE abos.status = 'offen'`)
        .bind(da?.id || crypto.randomUUID(), email, await sha256(geheim), token(), s, EINWILLIGUNG_VERSION, am, am),
      db.prepare("INSERT INTO abo_ereignisse (am, art) VALUES (?, 'bestaetigung')").bind(am),
    ]);
    return { status: 'angenommen' };
  }

  async function bestaetigen(geheim) {
    if (typeof geheim !== 'string' || !/^[A-Za-z0-9_-]{20,64}$/.test(geheim)) return { status: 'ungueltig' };
    const am = jetzt();
    // The token stays valid after confirming, so opening the mail link a second time is still a success.
    const zeile = await db.prepare("SELECT id FROM abos WHERE token_hash = ? AND (status = 'bestaetigt' OR angefragt_am >= ?)")
      .bind(await sha256(geheim), am - GRENZEN.offenTage * 86400).first();
    if (!zeile) return { status: 'ungueltig' };
    await db.prepare("UPDATE abos SET status = 'bestaetigt', bestaetigt_am = COALESCE(bestaetigt_am, ?) WHERE id = ?").bind(am, zeile.id).run();
    return { status: 'bestaetigt' };
  }

  async function abmelden(abmeldeToken) {
    if (typeof abmeldeToken !== 'string' || !/^[A-Za-z0-9_-]{20,64}$/.test(abmeldeToken)) return { status: 'ungueltig' };
    const zeile = await db.prepare('SELECT id FROM abos WHERE abmelde_token = ?').bind(abmeldeToken).first();
    // Removal deletes the address and its delivery records; a second click is just as successful.
    if (zeile) await db.batch([db.prepare('DELETE FROM versand WHERE abo_id = ?').bind(zeile.id), db.prepare('DELETE FROM abos WHERE id = ?').bind(zeile.id)]);
    return { status: 'abgemeldet' };
  }

  async function anzahl() {
    return (await db.prepare("SELECT COUNT(*) AS n FROM abos WHERE status = 'bestaetigt'").first()).n;
  }

  return { anmelden, bestaetigen, abmelden, anzahl, aufraeumen };
}

// Resend: one mail per request, idempotency key so a retry never mails twice.
export function resend(apiKey, url = 'https://api.resend.com/emails') {
  return async (mail, schluessel) => {
    const antwort = await fetch(url, {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json', 'idempotency-key': schluessel },
      body: JSON.stringify(mail),
    });
    if (!antwort.ok) throw new Error(`Resend ${antwort.status}`);
  };
}
