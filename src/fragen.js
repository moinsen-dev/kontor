// Single source of truth for the survey (German and English): the worker validates
// against it, the page renders from it (served as /api/fragen).
import { LAENDER } from './laender.js';

export const SPRACHEN = ['de', 'en'];

const t = (de, en) => ({ de, en });

export const FRAGEN = [
  {
    key: 'nutzung', typ: 'eins', pflicht: true,
    frage: t('Wie oft nutzt du LinkedIn?', 'How often do you use LinkedIn?'),
    optionen: {
      taeglich: t('Täglich', 'Daily'),
      woechentlich: t('Jede Woche', 'Every week'),
      selten: t('Selten', 'Rarely'),
      nicht_mehr: t('Nicht mehr (Konto ruht oder gelöscht)', 'Not anymore (account dormant or deleted)'),
      nie: t('Nie gehabt', 'Never had one'),
    },
  },
  {
    key: 'stoert', typ: 'mehrere', pflicht: true, freitext: 'freitext_stoert',
    frage: t('Was stört dich an LinkedIn?', 'What bothers you about LinkedIn?'),
    hinweis: t('Mehrere Antworten möglich.', 'Pick as many as apply.'),
    optionen: {
      ki_brei: t('KI-Beiträge und automatische Kommentare', 'AI-written posts and automated comments'),
      inszenierung: t('Selbstdarstellung, Erfolgsgeschichten, „Cringe“', 'Self-promotion, humblebrags, cringe'),
      reichweite: t('Unberechenbare Reichweite, undurchsichtiger Algorithmus', 'Unpredictable reach, opaque algorithm'),
      jobs: t('Scheinstellen, Bewerbungen ohne Antwort', 'Ghost jobs, applications without a reply'),
      fakes: t('Fake-Profile, Betrug, Vertriebsnachrichten', 'Fake profiles, scams, sales pitches'),
      daten: t('Nutzung meiner Daten, KI-Training, Tracking', 'Use of my data, AI training, tracking'),
      werbung: t('Werbung im Feed', 'Ads in the feed'),
      paywall: t('Bezahlschranken und Premium', 'Paywalls and Premium'),
      nichts: t('Eigentlich nichts', 'Nothing, really'),
    },
  },
  {
    key: 'gebracht', typ: 'mehrere', pflicht: true,
    frage: t('Was hat dir LinkedIn beruflich wirklich gebracht?', 'What has LinkedIn actually done for your career?'),
    hinweis: t('Ehrlich: Was ist tatsächlich daraus entstanden?', 'Honestly: what actually came out of it?'),
    optionen: {
      auftraege: t('Aufträge oder Kunden', 'Projects or clients'),
      job: t('Einen Job', 'A job'),
      mitarbeitende: t('Mitarbeitende oder Bewerbende', 'Employees or candidates'),
      kontakte: t('Wertvolle Kontakte', 'Valuable contacts'),
      wissen: t('Wissen und Anregungen', 'Knowledge and ideas'),
      nichts: t('Nichts Messbares', 'Nothing measurable'),
    },
  },
  {
    key: 'besser_netz', typ: 'eins', pflicht: false,
    frage: t('Welches Netzwerk hat dir mehr Aufträge oder Jobs gebracht?', 'Which network brought you more projects or jobs?'),
    optionen: {
      linkedin: t('LinkedIn', 'LinkedIn'),
      xing: t('XING', 'XING'),
      beide: t('Beide ähnlich', 'Both about the same'),
      anderes: t('Ein anderes (Fachforum, Community, Verband …)', 'Another one (forum, community, association …)'),
      keins: t('Keins davon', 'None of them'),
    },
  },
  {
    key: 'wuensche', typ: 'mehrere', pflicht: true, freitext: 'freitext_wunsch', max: 3,
    frage: t('Was müsste ein besseres Berufsnetz können?', 'What would a better professional network need to do?'),
    hinweis: t('Höchstens drei – was ist dir am wichtigsten?', 'Up to three – what matters most to you?'),
    optionen: {
      chronologisch: t('Feed in zeitlicher Reihenfolge oder selbst wählbar', 'Chronological feed, or one I can choose'),
      keine_daten: t('Keine Nutzung meiner Daten für KI oder Werbung', 'No use of my data for AI or ads'),
      echte_stellen: t('Geprüfte Stellen mit Ablaufdatum und Antwortpflicht', 'Verified jobs with expiry dates and a duty to reply'),
      gruppen: t('Lebendige Gruppen und regionale Kreise', 'Active groups and local circles'),
      gesuche: t('Gesuche und Angebote: „Ich suche …“, „Ich biete …“', 'Requests and offers: “I’m looking for …”, “I can offer …”'),
      keine_werbung: t('Keine Werbung, kein Premium', 'No ads, no Premium'),
      echte_menschen: t('Nur echte Menschen, KI-Beiträge gekennzeichnet', 'Real people only, AI posts labelled'),
      mitnehmen: t('Profil und Kontakte jederzeit mitnehmbar', 'Profile and contacts portable at any time'),
      mitbestimmen: t('Die Gemeinschaft bestimmt die Regeln', 'The community sets the rules'),
    },
  },
  {
    key: 'wechsel', typ: 'eins', pflicht: true,
    frage: t('Wenn es so ein Netz gäbe: Würdest du wechseln?', 'If such a network existed, would you switch?'),
    optionen: {
      sofort: t('Ja, ich würde LinkedIn verlassen', 'Yes, I would leave LinkedIn'),
      parallel: t('Ich würde es parallel nutzen', 'I would use it alongside LinkedIn'),
      kontakte: t('Nur wenn meine wichtigen Kontakte mitkommen', 'Only if my important contacts came along'),
      nein: t('Nein, ich bleibe bei LinkedIn', 'No, I’d stay on LinkedIn'),
      weiss_nicht: t('Weiß ich nicht', 'Don’t know'),
    },
  },
  {
    key: 'mitmachen', typ: 'mehrere', pflicht: true,
    frage: t('Würdest du mitmachen?', 'Would you get involved?'),
    optionen: {
      testen: t('Früh ausprobieren und Rückmeldung geben', 'Try it early and give feedback'),
      mitbauen: t('Mitentwickeln (Code, Design, Texte)', 'Help build it (code, design, writing)'),
      spenden: t('Mit Geld unterstützen (Spende, Mitgliedsbeitrag)', 'Support it with money (donation, membership)'),
      verbreiten: t('Weitersagen', 'Spread the word'),
      nein: t('Eher nicht', 'Probably not'),
    },
  },
  {
    key: 'rolle', typ: 'eins', pflicht: false,
    frage: t('Was beschreibt dich am besten?', 'What describes you best?'),
    optionen: {
      angestellt: t('Angestellt', 'Employed'),
      selbststaendig: t('Selbstständig oder freiberuflich', 'Self-employed or freelance'),
      unternehmen: t('Unternehmerin oder Unternehmer', 'Business owner'),
      recruiting: t('Recruiting oder Personal', 'Recruiting or HR'),
      suchend: t('Auf Jobsuche', 'Looking for a job'),
      ausbildung: t('In Ausbildung oder Studium', 'In training or studying'),
      anderes: t('Anderes', 'Other'),
    },
  },
  {
    key: 'branche', typ: 'eins', pflicht: false,
    frage: t('In welcher Branche arbeitest du?', 'Which field do you work in?'),
    optionen: {
      it: t('IT und Software', 'IT and software'),
      beratung: t('Beratung', 'Consulting'),
      marketing: t('Marketing, Medien, Kommunikation', 'Marketing, media, communications'),
      kreativ: t('Design und Kreativwirtschaft', 'Design and creative industries'),
      handwerk: t('Handwerk, Produktion, Technik', 'Trades, manufacturing, engineering'),
      handel: t('Handel und Vertrieb', 'Retail and sales'),
      finanzen: t('Finanzen, Recht, Verwaltung', 'Finance, law, administration'),
      gesundheit: t('Gesundheit und Soziales', 'Health and social care'),
      bildung: t('Bildung und Wissenschaft', 'Education and research'),
      oeffentlich: t('Öffentlicher Dienst und Gemeinnütziges', 'Public sector and non-profit'),
      anderes: t('Anderes', 'Other'),
    },
  },
  {
    key: 'land', typ: 'land', pflicht: false,
    frage: t('In welchem Land arbeitest du?', 'Which country do you work in?'),
    hinweis: t('Hilft uns zu sehen, wo genug Menschen für einen Start zusammenkommen.', 'Helps us see where enough people come together for a start.'),
    optionen: {},
  },
];

export const FREITEXT_MAX = 1000;

const MELDUNG = {
  ungueltig: t('Ungültige Daten.', 'Invalid data.'),
  fehlt: t('Bitte beantworte: ', 'Please answer: '),
  falsch: t('Ungültige Antwort bei: ', 'Invalid answer for: '),
  zuviele: t('Höchstens {n} Antworten bei: ', 'At most {n} answers for: '),
  zulang: t(`Freitext zu lang (höchstens ${FREITEXT_MAX} Zeichen).`, `Free text too long (at most ${FREITEXT_MAX} characters).`),
};

// Validate a submitted body against FRAGEN. Returns { ok, row } or { ok: false, fehler }.
export function pruefen(body, sprache = 'de') {
  const s = SPRACHEN.includes(sprache) ? sprache : 'de';
  if (!body || typeof body !== 'object') return { ok: false, fehler: MELDUNG.ungueltig[s] };
  const row = { sprache: s };
  for (const f of FRAGEN) {
    const wert = body[f.key];
    const erlaubt = f.typ === 'land' ? LAENDER : Object.keys(f.optionen);
    const frage = f.frage[s];
    if (f.typ === 'eins' || f.typ === 'land') {
      if (wert == null || wert === '') {
        if (f.pflicht) return { ok: false, fehler: MELDUNG.fehlt[s] + frage };
        row[f.key] = null;
        continue;
      }
      if (!erlaubt.includes(wert)) return { ok: false, fehler: MELDUNG.falsch[s] + frage };
      row[f.key] = wert;
    } else {
      const liste = Array.isArray(wert) ? [...new Set(wert)] : [];
      if (f.pflicht && liste.length === 0) return { ok: false, fehler: MELDUNG.fehlt[s] + frage };
      if (liste.some((w) => !erlaubt.includes(w))) return { ok: false, fehler: MELDUNG.falsch[s] + frage };
      if (f.max && liste.length > f.max) return { ok: false, fehler: MELDUNG.zuviele[s].replace('{n}', f.max) + frage };
      row[f.key] = JSON.stringify(liste);
    }
    if (f.freitext) {
      const text = typeof body[f.freitext] === 'string' ? body[f.freitext].trim() : '';
      if (text.length > FREITEXT_MAX) return { ok: false, fehler: MELDUNG.zulang[s] };
      row[f.freitext] = text || null;
    }
  }
  return { ok: true, row };
}
