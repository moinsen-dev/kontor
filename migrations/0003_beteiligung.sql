-- Participation: wishes with up/down votes, pledges, survey funnel.
-- No names, no IPs. "browser" is a random id the page creates in localStorage.

ALTER TABLE antworten ADD COLUMN branche TEXT;

CREATE TABLE wuensche (
  id            TEXT PRIMARY KEY,
  titel_de      TEXT,
  titel_en      TEXT,
  text_de       TEXT,
  text_en       TEXT,
  quelle        TEXT    NOT NULL DEFAULT 'team',   -- team | vorschlag
  freigegeben   INTEGER NOT NULL DEFAULT 1,        -- suggestions start at 0 until reviewed
  reihenfolge   INTEGER NOT NULL DEFAULT 100,
  erstellt_am   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE stimmen (
  wunsch_id     TEXT    NOT NULL REFERENCES wuensche(id),
  browser       TEXT    NOT NULL,
  richtung      INTEGER NOT NULL CHECK (richtung IN (-1, 1)),
  erstellt_am   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  PRIMARY KEY (wunsch_id, browser)
);

CREATE TABLE zusagen (
  art           TEXT    NOT NULL,   -- mitkommen | mitbauen | spenden | gruenden
  browser       TEXT    NOT NULL,
  details       TEXT,               -- JSON: skills or pledge amount
  email         TEXT,               -- optional, only with consent, never published
  land          TEXT,
  sprache       TEXT    NOT NULL DEFAULT 'de',
  erstellt_am   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  PRIMARY KEY (art, browser)
);

-- Anonymous funnel: how many people reached question n of the survey.
CREATE TABLE schritte (
  schritt       INTEGER PRIMARY KEY,
  anzahl        INTEGER NOT NULL DEFAULT 0
);

INSERT INTO wuensche (id, reihenfolge, titel_de, titel_en, text_de, text_en) VALUES
('feed_waehlen', 10, 'Den Feed selbst wählen', 'Choose your own feed',
 'Zeitlich sortiert oder nach eigenen Regeln. Kein Algorithmus entscheidet, was du siehst.',
 'Chronological or by your own rules. No algorithm decides what you see.'),
('daten_gehoeren_dir', 20, 'Deine Daten gehören dir', 'Your data belongs to you',
 'Kein KI-Training, keine Werbeprofile, kein Verkauf von Daten.',
 'No AI training, no ad profiles, no selling of data.'),
('echte_stellen', 30, 'Echte Stellen', 'Real jobs',
 'Stellen mit Ablaufdatum, Gehaltsspanne und der Pflicht, Bewerbungen zu beantworten.',
 'Jobs with an expiry date, a salary range and a duty to reply to applicants.'),
('gruppen', 40, 'Lebendige Gruppen und regionale Kreise', 'Active groups and local circles',
 'Fachgruppen und Kreise in deiner Stadt, mit Moderation statt Werbung.',
 'Topic groups and circles in your city, moderated rather than advertised.'),
('gesuche', 50, 'Gesuche und Angebote', 'Requests and offers',
 '„Ich suche …“ und „Ich biete …“ – direkt, ohne Umweg über einen Beitrag.',
 '“I’m looking for …” and “I can offer …” – directly, without dressing it up as a post.'),
('projekte', 60, 'Aufträge für Freiberufliche und kleine Firmen', 'Projects for freelancers and small firms',
 'Eine Projektbörse, wie sie viele früher bei XING gefunden haben.',
 'A project board like the one many people used to find on XING.'),
('keine_werbung', 70, 'Keine Werbung, kein Premium', 'No ads, no Premium',
 'Alle Funktionen für alle. Getragen von Mitgliedsbeiträgen und Spenden.',
 'Every feature for everyone. Funded by memberships and donations.'),
('echte_menschen', 80, 'Echte Menschen', 'Real people',
 'KI-Beiträge sind gekennzeichnet, automatische Kommentare und Bots fliegen raus.',
 'AI posts are labelled, automated comments and bots are removed.'),
('keine_zaehler', 90, 'Keine öffentlichen Like-Zähler', 'No public like counts',
 'Weniger Wettbewerb um Aufmerksamkeit, weniger Selbstinszenierung.',
 'Less competition for attention, less performing.'),
('empfehlungen', 100, 'Echte Empfehlungen', 'Real recommendations',
 'Persönliche Empfehlungen von Menschen, die mit dir gearbeitet haben, statt Ein-Klick-Bestätigungen.',
 'Personal recommendations from people who worked with you, instead of one-click endorsements.'),
('mentoring', 110, 'Mentoring und Fragen an Erfahrene', 'Mentoring and asking experienced people',
 'Fragen stellen und Erfahrung weitergeben, auch über Branchen hinweg.',
 'Ask questions and pass on experience, across industries too.'),
('mitnehmen', 120, 'Profil und Kontakte mitnehmen', 'Take your profile and contacts with you',
 'Export jederzeit und ein offenes Protokoll, damit niemand eingesperrt ist.',
 'Export at any time and an open protocol, so nobody is locked in.'),
('fediverse', 130, 'Verbunden mit dem Fediverse', 'Connected to the Fediverse',
 'Über ActivityPub Menschen auf Mastodon und anderen offenen Netzen folgen.',
 'Follow people on Mastodon and other open networks via ActivityPub.'),
('linkedin_import', 140, 'Profil aus LinkedIn übernehmen', 'Import your LinkedIn profile',
 'Mit der eigenen Export-Datei in einer Minute startklar.',
 'Ready in a minute using your own export file.'),
('mitbestimmen', 150, 'Die Gemeinschaft bestimmt die Regeln', 'The community sets the rules',
 'Wichtige Regeländerungen werden abgestimmt, die Finanzen sind offen.',
 'Important rule changes are put to a vote, finances are public.');
