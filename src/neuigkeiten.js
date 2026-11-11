// Progress updates, newest first. Shown on the updates page, in the RSS feeds and sent by scripts/update-senden.mjs.
// Each text is plain paragraphs separated by a blank line; links are written out in full.

const t = (de, en) => ({ de, en });

export const NEUIGKEITEN = [
  {
    id: '2026-11-11',
    datum: '2026-11-11',
    titel: t('Kontor wird eine Ergänzung zu LinkedIn, und wir planen öffentlich', 'Kontor becomes a complement to LinkedIn, planned in public'),
    text: t(
      `Wir haben unsere Richtung geändert. Kontor soll LinkedIn nicht ersetzen, sondern ergänzen. Niemand muss dort weggehen. Kontor soll schon für eine einzelne Person nützlich sein: Dein berufliches Netzwerk gehört dir, und deine eigenen Software-Agenten können unter deiner Kontrolle damit arbeiten.

Gebaut ist davon noch nichts. Wir beschreiben zuerst öffentlich, was entstehen soll, und entwickeln erst, wenn die Entwürfe geprüft sind. Die Roadmap steht unter https://kontor.moinsen.dev/roadmap, die englischen Entwürfe liegen auf GitHub (https://github.com/moinsen-dev/kontor/tree/main/docs).

Dazu gehören ein Import der eigenen LinkedIn-Daten ohne Scraping und ein Weg, damit Daten von Menschen, die nicht dabei sind, geschützt bleiben. Lies mit, widersprich und sag uns, was fehlt.`,
      `We have changed direction. Kontor is not meant to replace LinkedIn but to complement it. Nobody has to leave. Kontor should be useful even to a single person: your professional network belongs to you, and your own software agents can work with it under your control.

None of this is built yet. We first describe in public what we want to create, and develop only once the drafts have been reviewed. The roadmap is at https://kontor.moinsen.dev/en/roadmap, the drafts are on GitHub (https://github.com/moinsen-dev/kontor/tree/main/docs).

They include importing your own LinkedIn data without scraping, and a way to keep the data of people who aren’t part of it protected. Read along, disagree and tell us what is missing.`,
    ),
  },
  {
    id: '2026-11-10',
    datum: '2026-11-10',
    titel: t('Kontor ist online: Umfrage, Wünsche und Zusagen', 'Kontor is live: survey, wishes and pledges'),
    text: t(
      `Seit heute ist kontor.moinsen.dev online. Die Idee: Viele ärgern sich über LinkedIn und bleiben trotzdem, weil dort alle sind. Ein neues Netz scheitert selten an der Technik, sondern daran, dass niemand als Erster umziehen will.

Deshalb sammeln wir zuerst Zusagen mit klaren Schwellen: 1.000 Menschen, die mitkommen, 25, die mitbauen, 500 Euro im Monat an Spendenzusagen und 7 Gründungsmitglieder für einen gemeinnützigen Verein. Erst wenn die Schwellen erreicht sind, geht es los.

Was du tun kannst: die Umfrage ausfüllen (https://kontor.moinsen.dev/umfrage), über Wünsche abstimmen (https://kontor.moinsen.dev/wuensche) und zusagen (https://kontor.moinsen.dev/mitmachen). Grundsätze und Satzungsentwurf stehen offen zur Diskussion (https://kontor.moinsen.dev/grundsaetze).`,
      `As of today kontor.moinsen.dev is live. The idea: many people are fed up with LinkedIn and stay anyway, because everyone is there. A new network rarely fails on technology; it fails because nobody wants to move first.

So we collect pledges with clear thresholds first: 1,000 people coming along, 25 helping to build, €500 a month in pledged donations and 7 founding members for a non-profit association. Only when the thresholds are reached do we start.

What you can do: take the survey (https://kontor.moinsen.dev/en/survey), vote on wishes (https://kontor.moinsen.dev/en/wishes) and pledge (https://kontor.moinsen.dev/en/join). Principles and draft statutes are open for discussion (https://kontor.moinsen.dev/en/principles).`,
    ),
  },
];

export const absaetze = (text) => text.split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean);

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

// One update as an e-mail. abmeldeLink opens the page with the unsubscribe button.
export function updateMail(n, sprache, abmeldeLink) {
  const s = sprache === 'en' ? 'en' : 'de';
  const teile = absaetze(n.text[s]);
  const fuss = s === 'de'
    ? `Du bekommst diese Mail, weil du Updates zu Kontor abonniert hast. Abmelden: ${abmeldeLink}`
    : `You receive this e-mail because you subscribed to Kontor updates. Unsubscribe: ${abmeldeLink}`;
  const text = `${n.titel[s]}\n\n${teile.join('\n\n')}\n\nUlrich Diedrichsen\nKontor · https://kontor.moinsen.dev\n\n${fuss}`;
  const html = `<!doctype html><html lang="${s}"><body style="font:16px/1.6 system-ui,sans-serif;color:#1d2433;max-width:560px;margin:0 auto;padding:24px">
<h1 style="font-size:22px;line-height:1.3">${esc(n.titel[s])}</h1>
${teile.map((a) => `<p>${esc(a).replace(/https:\/\/[^\s)]+/g, (u) => `<a href="${u}" style="color:#a3472f">${u.replace('https://', '')}</a>`)}</p>`).join('\n')}
<p>Ulrich Diedrichsen<br>Kontor · <a href="https://kontor.moinsen.dev" style="color:#a3472f">kontor.moinsen.dev</a></p>
<p style="color:#556070;font-size:13px;border-top:1px solid #e2d9cb;padding-top:12px">${s === 'de' ? 'Du bekommst diese Mail, weil du Updates zu Kontor abonniert hast.' : 'You receive this e-mail because you subscribed to Kontor updates.'} <a href="${abmeldeLink}" style="color:#a3472f">${s === 'de' ? 'Abmelden' : 'Unsubscribe'}</a></p>
</body></html>`;
  return { betreff: `Kontor: ${n.titel[s]}`, text, html };
}
