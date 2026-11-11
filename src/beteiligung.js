// Pledges ("Zusagen") and their thresholds: we only build once enough people have said they would use, build or carry Kontor.

const t = (de, en) => ({ de, en });

export const ZUSAGEN = {
  mitkommen: {
    titel: t('Ich komme mit', 'I’m in'),
    text: t(
      'Wenn es Kontor gibt, lege ich ein Profil an und nutze es neben LinkedIn.',
      'If Kontor exists, I’ll create a profile and use it alongside LinkedIn.',
    ),
    schwelle: 1000,
    schwelleText: t('Ab {n} Zusagen und mit geprüftem Plan fangen wir an zu bauen.', 'We start building at {n} pledges and once the plan has been reviewed.'),
  },
  mitbauen: {
    titel: t('Ich baue mit', 'I’ll help build it'),
    text: t(
      'Ich bringe Zeit und Können ein: Code, Design, Texte, Recht, Moderation oder Organisation.',
      'I’ll contribute time and skills: code, design, writing, law, moderation or organising.',
    ),
    schwelle: 25,
    schwelleText: t('Mit {n} Mitbauenden ist ein erstes Team beisammen.', 'With {n} contributors we have a first team.'),
  },
  spenden: {
    titel: t('Ich würde spenden', 'I would donate'),
    text: t(
      'Eine Zusage, kein Geld jetzt. Gezahlt wird erst, wenn es einen gemeinnützigen Verein gibt.',
      'A pledge, no money now. Payments only start once a non-profit association exists.',
    ),
    schwelle: 500,
    schwelleText: t('Ab {n} € im Monat sind Betrieb und Grundkosten gedeckt.', 'At €{n} a month, hosting and basic costs are covered.'),
  },
  gruenden: {
    titel: t('Ich werde Gründungsmitglied', 'I’ll be a founding member'),
    text: t(
      'Ich bin bei der Gründung des Vereins dabei. Dafür brauchen wir eine E-Mail-Adresse, um dich einzuladen.',
      'I’ll take part in founding the association. We need an e-mail address to invite you.',
    ),
    schwelle: 7,
    schwelleText: t('Für einen eingetragenen Verein braucht es {n} Gründungsmitglieder.', 'A registered association needs {n} founding members.'),
    emailPflicht: true,
  },
};

export const FAEHIGKEITEN = {
  entwicklung: t('Entwicklung', 'Development'),
  design: t('Design und Nutzerführung', 'Design and UX'),
  texte: t('Texte und Übersetzung', 'Writing and translation'),
  recht: t('Recht, Verein, Datenschutz', 'Law, association, data protection'),
  community: t('Community und Moderation', 'Community and moderation'),
  finanzen: t('Finanzen und Fördermittel', 'Finance and funding'),
  verbreiten: t('Öffentlichkeit und Verbreitung', 'Outreach and promotion'),
};

// Monthly amounts in euro; "einmalig" counts as a one-off and is not added to the monthly sum.
export const BETRAEGE = {
  m3: { betrag: 3, text: t('3 € im Monat', '€3 a month') },
  m5: { betrag: 5, text: t('5 € im Monat', '€5 a month') },
  m10: { betrag: 10, text: t('10 € im Monat', '€10 a month') },
  m25: { betrag: 25, text: t('25 € im Monat', '€25 a month') },
  einmalig: { betrag: 0, text: t('Einmalig, wenn es losgeht', 'Once, when it starts') },
};

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
export const BROWSER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const MELDUNG = {
  art: t('Unbekannte Zusage.', 'Unknown pledge.'),
  browser: t('Ungültige Kennung. Bitte lade die Seite neu.', 'Invalid id. Please reload the page.'),
  faehigkeit: t('Bitte wähle mindestens ein Gebiet.', 'Please choose at least one area.'),
  betrag: t('Bitte wähle einen Betrag.', 'Please choose an amount.'),
  email: t('Bitte gib eine gültige E-Mail-Adresse an.', 'Please enter a valid e-mail address.'),
  einwilligung: t('Bitte bestätige, dass wir dich per E-Mail kontaktieren dürfen.', 'Please confirm that we may contact you by e-mail.'),
};

// Validate a pledge. Returns { ok, row } or { ok: false, fehler }.
export function zusagePruefen(body, sprache = 'de') {
  const s = sprache === 'en' ? 'en' : 'de';
  const art = body?.art;
  if (!(art in ZUSAGEN)) return { ok: false, fehler: MELDUNG.art[s] };
  if (!BROWSER_ID.test(body.browser || '')) return { ok: false, fehler: MELDUNG.browser[s] };

  let details = null;
  if (art === 'mitbauen') {
    const liste = Array.isArray(body.faehigkeiten) ? [...new Set(body.faehigkeiten)] : [];
    if (liste.length === 0 || liste.some((f) => !(f in FAEHIGKEITEN))) return { ok: false, fehler: MELDUNG.faehigkeit[s] };
    details = JSON.stringify({ faehigkeiten: liste });
  }
  if (art === 'spenden') {
    if (!(body.betrag in BETRAEGE)) return { ok: false, fehler: MELDUNG.betrag[s] };
    details = JSON.stringify({ betrag: body.betrag });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email && !EMAIL.test(email)) return { ok: false, fehler: MELDUNG.email[s] };
  if (ZUSAGEN[art].emailPflicht && !email) return { ok: false, fehler: MELDUNG.email[s] };
  if (email && body.einwilligung !== true) return { ok: false, fehler: MELDUNG.einwilligung[s] };

  return { ok: true, row: { art, browser: body.browser, details, email: email || null, sprache: s } };
}

// Aggregate pledges for the public progress bars. Emails are never part of this.
export function zusagenAuswerten(zeilen) {
  const stand = Object.fromEntries(Object.keys(ZUSAGEN).map((a) => [a, { anzahl: 0, schwelle: ZUSAGEN[a].schwelle }]));
  let monatlich = 0;
  const faehigkeiten = Object.fromEntries(Object.keys(FAEHIGKEITEN).map((f) => [f, 0]));
  for (const z of zeilen) {
    if (!(z.art in stand)) continue;
    stand[z.art].anzahl++;
    const d = z.details ? JSON.parse(z.details) : {};
    if (z.art === 'spenden') monatlich += BETRAEGE[d.betrag]?.betrag ?? 0;
    if (z.art === 'mitbauen') for (const f of d.faehigkeiten || []) if (f in faehigkeiten) faehigkeiten[f]++;
  }
  stand.spenden.summe = monatlich;
  stand.mitbauen.faehigkeiten = faehigkeiten;
  return stand;
}

// Wilson lower bound (95 %): ranks wishes fairly even with few votes.
export function wilson(hoch, runter) {
  const n = hoch + runter;
  if (n === 0) return 0;
  const z = 1.96;
  const p = hoch / n;
  return (p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n)) / (1 + (z * z) / n);
}
