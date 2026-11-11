// The public roadmap, in both languages. docs/roadmap.md is the design document; a test keeps the feature names in step.

const t = (de, en) => ({ de, en });
const f = (titel, text, wunsch = false) => ({ titel, text, wunsch });

export const STUFEN = [
  {
    id: 'mein-kontor',
    name: t('Stufe 1: Mein Kontor', 'Stage 1: My Kontor'),
    wann: t('Nützlich für eine einzelne Person, auch wenn sonst niemand da ist.', 'Useful to a single person, even if nobody else is there.'),
    funktionen: [
      f(t('Profil-Import', 'Profile import'), t('Positionen, Ausbildung und Fähigkeiten aus deinem eigenen LinkedIn-Export übernehmen.', 'Bring in positions, education and skills from your own LinkedIn export.'), true),
      f(t('Privates Netzwerkbuch', 'Private network book'), t('Deine LinkedIn-Kontakte als verschlüsseltes Adressbuch, das nur du lesen kannst.', 'Your LinkedIn connections as an encrypted address book only you can read.'), true),
      f(t('Beziehungsgedächtnis', 'Relationship memory'), t('Private Notizen und Schlagworte: wie ihr euch kennt, wann ihr zuletzt gesprochen habt.', 'Private notes and tags: how you met, when you last spoke.')),
      f(t('Mein Netzwerk fragen', 'Ask my network'), t('„Wen kenne ich in der Logistik in Hamburg?“, beantwortet aus deinen Daten auf deinem Gerät.', '“Who do I know in logistics in Hamburg?”, answered from your own data on your own device.')),
      f(t('Gesuche und Angebote', 'Requests and offers'), t('„Ich suche …“ und „Ich biete …“ als Link, den du auf LinkedIn oder überall teilen kannst.', '“I am looking for …” and “I can offer …” as a link you can share on LinkedIn or anywhere.'), true),
      f(t('Deine öffentliche Seite', 'Your public page'), t('Eine übertragbare berufliche Seite unter einer festen Adresse. Kein Tracking, kein Ranking.', 'A portable professional page at a stable address. No tracking, no ranking.'), true),
      f(t('Vollständiger Export, jederzeit', 'Full export, any time'), t('Alles in offenen Formaten, inklusive Löschung.', 'Everything in open formats, including deletion.'), true),
      f(t('Mein Agent', 'My agent'), t('Verbinde deinen eigenen Assistenten mit deinen Daten, mit Rechten, die du siehst und widerrufen kannst.', 'Connect your own assistant to your own data, with permissions you can see and revoke.')),
    ],
  },
  {
    id: 'vorstellungen',
    name: t('Stufe 2: Persönliche Vorstellungen', 'Stage 2: Warm introductions'),
    wann: t('Nützlich, sobald zwei Menschen dabei sind, die sich kennen.', 'Useful as soon as two people who know each other take part.'),
    funktionen: [
      f(t('Bekannte finden', 'Find people I already know'), t('Sehen, wer aus deinen Kontakten dabei ist, ohne dass der Server deine Kontakte erfährt.', 'See which of your contacts are here, without the server learning your contacts.')),
      f(t('Gegenseitige Verbindungen', 'Mutual connections'), t('Beide Seiten bestätigen. Ein Treffer ist immer nur ein Vorschlag.', 'Both sides confirm. A match is only ever a suggestion.')),
      f(t('Vorstellungen mit doppelter Zustimmung', 'Double opt-in introductions'), t('„Kannst du mich mit X bekannt machen?“ Bei X kommt erst etwas an, wenn die Person dazwischen zustimmt, und X nimmt dann an.', '“Could you introduce me to X?” Nothing reaches X until the person in the middle agrees, and X then accepts.')),
      f(t('Echte Empfehlungen', 'Real recommendations'), t('Geschrieben von Menschen, die mit dir gearbeitet haben, statt Ein-Klick-Bestätigungen.', 'Written by people who worked with you, instead of one-click endorsements.'), true),
      f(t('Bestätigte Angaben', 'Verified claims'), t('Belege für „hat bei X gearbeitet“, bestätigt von Menschen oder Organisationen, die es wissen.', 'Evidence for “worked at X”, confirmed by people or organisations who would know.'), true),
    ],
  },
  {
    id: 'kreise-markt',
    name: t('Stufe 3: Kreise und Markt', 'Stage 3: Circles and market'),
    wann: t('Braucht eine Gruppe. Wird erst gebaut, wenn es sie gibt.', 'Needs a group. We only build it once one exists.'),
    funktionen: [
      f(t('Kreise', 'Circles'), t('Moderierte Gruppen nach Fach und Stadt.', 'Moderated groups by trade and by city.'), true),
      f(t('Projektbörse', 'Project market'), t('Aufträge für Freiberufliche und kleine Firmen.', 'Assignments for freelancers and small firms.'), true),
      f(t('Ehrliche Stellen', 'Honest job listings'), t('Mit Ablaufdatum, Gehaltsspanne und der Pflicht, Bewerbungen zu beantworten.', 'Expiry date, salary range, a duty to answer applicants.'), true),
      f(t('Mentoring', 'Mentoring'), t('Erfahrene fragen, auch über Branchen hinweg.', 'Ask experienced people, across industries.'), true),
      f(t('Selbst gewählter Feed', 'Chosen feed'), t('Zeitlich oder nach Regeln, die du wählst. Vor dieser Stufe gibt es keinen allgemeinen Feed.', 'Chronological or rules you pick. No general feed before this stage.'), true),
      f(t('Keine öffentlichen Like-Zähler', 'No public like counts'), t('Weniger Wettbewerb um Aufmerksamkeit.', 'Less competition for attention.'), true),
    ],
  },
  {
    id: 'offenes-netz',
    name: t('Stufe 4: Offenes Netz', 'Stage 4: Open network'),
    wann: t('Andere Server und Apps machen mit.', 'Other servers and apps take part.'),
    funktionen: [
      f(t('Föderation', 'Federation'), t('Andere Server und Apps können am öffentlichen Teil teilnehmen.', 'Other servers and apps can take part in the public layer.'), true),
      f(t('Brücke zum Fediverse', 'Fediverse bridge'), t('Menschen auf Mastodon und anderen ActivityPub-Netzen folgen.', 'Follow people on Mastodon and other ActivityPub networks.'), true),
      f(t('Selbst betreiben', 'Self-hosting'), t('Ein eigenes Kontor für eine Zunft, Firma oder Region.', 'Run your own Kontor for a guild, firm or region.')),
    ],
  },
];

export const NICHT_GEPLANT = [
  t('LinkedIn per Scraping, Browser-Erweiterung oder Automatisierung auslesen', 'Importing from LinkedIn by scraping, browser extensions or automation'),
  t('Nachrichten aus LinkedIn importieren', 'Importing messages from LinkedIn'),
  t('Einladungen an Menschen verschicken, die nicht dabei sind', 'Sending invitations to people who are not members'),
  t('Profile von Menschen, die keines angelegt haben', 'Profiles of people who did not create one'),
  t('Automatisch auf LinkedIn schreiben oder posten', 'Writing to LinkedIn automatically or posting on a member’s behalf'),
];

export const ENTWUERFE = [
  { datei: 'process.md', titel: t('Wie aus einem Entwurf etwas wird, das wir bauen', 'How a design becomes something we build') },
  { datei: 'rfcs/0001-complement-not-replacement.md', titel: t('Ergänzung statt Ersatz', 'A complement, not a replacement') },
  { datei: 'rfcs/0002-linkedin-import.md', titel: t('LinkedIn-Daten übernehmen', 'Bringing LinkedIn data into Kontor') },
  { datei: 'rfcs/0003-architecture.md', titel: t('Architektur', 'Architecture') },
  { datei: 'rfcs/0004-agent-readiness.md', titel: t('Bereit für Agenten, von Anfang an', 'Agent readiness from day one') },
];
