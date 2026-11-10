// Single source of truth for the survey: the worker validates against it,
// the page renders from it (served as /api/fragen).

export const FRAGEN = [
  {
    key: 'nutzung', typ: 'eins', pflicht: true,
    frage: 'Wie oft nutzt du LinkedIn?',
    optionen: {
      taeglich: 'Täglich',
      woechentlich: 'Jede Woche',
      selten: 'Selten',
      nicht_mehr: 'Nicht mehr (Konto ruht oder gelöscht)',
      nie: 'Nie gehabt',
    },
  },
  {
    key: 'stoert', typ: 'mehrere', pflicht: true, freitext: 'freitext_stoert',
    frage: 'Was stört dich an LinkedIn?',
    hinweis: 'Mehrere Antworten möglich.',
    optionen: {
      ki_brei: 'KI-Beiträge und automatische Kommentare',
      inszenierung: 'Selbstdarstellung, Erfolgsgeschichten, „Cringe“',
      reichweite: 'Unberechenbare Reichweite, undurchsichtiger Algorithmus',
      jobs: 'Scheinstellen, Bewerbungen ohne Antwort',
      fakes: 'Fake-Profile, Betrug, Vertriebsnachrichten',
      daten: 'Nutzung meiner Daten, KI-Training, Tracking',
      werbung: 'Werbung im Feed',
      paywall: 'Bezahlschranken und Premium',
      nichts: 'Eigentlich nichts',
    },
  },
  {
    key: 'gebracht', typ: 'mehrere', pflicht: true,
    frage: 'Was hat dir LinkedIn beruflich wirklich gebracht?',
    hinweis: 'Ehrlich: Was ist tatsächlich daraus entstanden?',
    optionen: {
      auftraege: 'Aufträge oder Kunden',
      job: 'Einen Job',
      mitarbeitende: 'Mitarbeitende oder Bewerbende',
      kontakte: 'Wertvolle Kontakte',
      wissen: 'Wissen und Anregungen',
      nichts: 'Nichts Messbares',
    },
  },
  {
    key: 'besser_netz', typ: 'eins', pflicht: false,
    frage: 'Welches Netzwerk hat dir mehr Aufträge oder Jobs gebracht?',
    optionen: {
      linkedin: 'LinkedIn',
      xing: 'XING',
      beide: 'Beide ähnlich',
      anderes: 'Ein anderes (Fachforum, Community, Verband …)',
      keins: 'Keins davon',
    },
  },
  {
    key: 'wuensche', typ: 'mehrere', pflicht: true, freitext: 'freitext_wunsch',
    frage: 'Was müsste ein besseres Berufsnetz können?',
    hinweis: 'Höchstens drei – was ist dir am wichtigsten?',
    max: 3,
    optionen: {
      chronologisch: 'Feed in zeitlicher Reihenfolge oder selbst wählbar',
      keine_daten: 'Keine Nutzung meiner Daten für KI oder Werbung',
      echte_stellen: 'Geprüfte Stellen mit Ablaufdatum und Antwortpflicht',
      gruppen: 'Lebendige Gruppen und regionale Kreise',
      gesuche: 'Gesuche und Angebote: „Ich suche …“, „Ich biete …“',
      keine_werbung: 'Keine Werbung, kein Premium',
      echte_menschen: 'Nur echte Menschen, KI-Beiträge gekennzeichnet',
      mitnehmen: 'Profil und Kontakte jederzeit mitnehmbar',
      mitbestimmen: 'Die Gemeinschaft bestimmt die Regeln',
    },
  },
  {
    key: 'wechsel', typ: 'eins', pflicht: true,
    frage: 'Wenn es so ein Netz gäbe: Würdest du wechseln?',
    optionen: {
      sofort: 'Ja, ich würde LinkedIn verlassen',
      parallel: 'Ich würde es parallel nutzen',
      kontakte: 'Nur wenn meine wichtigen Kontakte mitkommen',
      nein: 'Nein, ich bleibe bei LinkedIn',
      weiss_nicht: 'Weiß ich nicht',
    },
  },
  {
    key: 'mitmachen', typ: 'mehrere', pflicht: true,
    frage: 'Würdest du mitmachen?',
    optionen: {
      testen: 'Früh ausprobieren und Rückmeldung geben',
      mitbauen: 'Mitentwickeln (Code, Design, Texte)',
      spenden: 'Mit Geld unterstützen (Spende, Mitgliedsbeitrag)',
      verbreiten: 'Weitersagen',
      nein: 'Eher nicht',
    },
  },
  {
    key: 'rolle', typ: 'eins', pflicht: false,
    frage: 'Was beschreibt dich am besten?',
    optionen: {
      angestellt: 'Angestellt',
      selbststaendig: 'Selbstständig oder freiberuflich',
      unternehmen: 'Unternehmerin oder Unternehmer',
      recruiting: 'Recruiting oder Personal',
      suchend: 'Auf Jobsuche',
      ausbildung: 'In Ausbildung oder Studium',
      anderes: 'Anderes',
    },
  },
  {
    key: 'land', typ: 'eins', pflicht: false,
    frage: 'Wo arbeitest du?',
    optionen: { de: 'Deutschland', at: 'Österreich', ch: 'Schweiz', anderes: 'Anderswo' },
  },
];

export const FREITEXT_MAX = 1000;

// Validate a submitted body against FRAGEN. Returns { ok, row } or { ok: false, fehler }.
export function pruefen(body) {
  if (!body || typeof body !== 'object') return { ok: false, fehler: 'Ungültige Daten.' };
  const row = {};
  for (const f of FRAGEN) {
    const wert = body[f.key];
    const erlaubt = Object.keys(f.optionen);
    if (f.typ === 'eins') {
      if (wert == null || wert === '') {
        if (f.pflicht) return { ok: false, fehler: `Bitte beantworte: ${f.frage}` };
        row[f.key] = null;
        continue;
      }
      if (!erlaubt.includes(wert)) return { ok: false, fehler: `Ungültige Antwort bei: ${f.frage}` };
      row[f.key] = wert;
    } else {
      const liste = Array.isArray(wert) ? [...new Set(wert)] : [];
      if (f.pflicht && liste.length === 0) return { ok: false, fehler: `Bitte beantworte: ${f.frage}` };
      if (liste.some((w) => !erlaubt.includes(w))) return { ok: false, fehler: `Ungültige Antwort bei: ${f.frage}` };
      if (f.max && liste.length > f.max) return { ok: false, fehler: `Höchstens ${f.max} Antworten bei: ${f.frage}` };
      row[f.key] = JSON.stringify(liste);
    }
    if (f.freitext) {
      const text = typeof body[f.freitext] === 'string' ? body[f.freitext].trim() : '';
      if (text.length > FREITEXT_MAX) return { ok: false, fehler: `Freitext zu lang (höchstens ${FREITEXT_MAX} Zeichen).` };
      row[f.freitext] = text || null;
    }
  }
  return { ok: true, row };
}
