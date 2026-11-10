// Principles (Charta) and draft statutes (Satzung) of the planned association.
// German is the authoritative text; English is a translation for information.
// The tax-relevant clauses follow the model statutes in Annex 1 to § 60 AO.

const t = (de, en) => ({ de, en });

export const CHARTA = [
  t('Keine Werbung und keine bezahlte Reichweite.', 'No advertising and no paid reach.'),
  t('Keine Nutzung persönlicher Daten für Werbung oder KI-Training, kein Verkauf von Daten.', 'No use of personal data for advertising or AI training, no selling of data.'),
  t('Alle Funktionen für alle – kein Premium, das Grundrechte wie Auskunft hinter eine Bezahlschranke stellt.', 'Every feature for everyone – no Premium that puts basic rights such as access to your data behind a paywall.'),
  t('Der Feed gehört dir: zeitlich sortiert oder nach Regeln, die du siehst und wählst.', 'Your feed is yours: chronological or by rules you can see and choose.'),
  t('Deine Daten und Kontakte kannst du jederzeit mitnehmen; offene Protokolle statt Abschottung.', 'You can take your data and contacts with you at any time; open protocols, not lock-in.'),
  t('Die Software ist Freie Software (AGPL-3.0). Jede und jeder kann sie prüfen, verbessern und betreiben.', 'The software is free software (AGPL-3.0). Anyone can inspect, improve and run it.'),
  t('Die Gemeinschaft entscheidet mit: Wichtige Regeländerungen werden zur Abstimmung gestellt.', 'The community has a say: important rule changes are put to a vote.'),
  t('Offene Finanzen: Einnahmen und Ausgaben werden jedes Jahr veröffentlicht.', 'Open finances: income and expenses are published every year.'),
];

// Each paragraph: title and list of clauses.
export const SATZUNG = [
  {
    titel: t('§ 1 Name, Sitz, Geschäftsjahr', '§ 1 Name, seat, financial year'),
    absaetze: [
      t('(1) Der Verein führt den Namen „Kontor – offenes Berufsnetz“. Er soll in das Vereinsregister eingetragen werden und trägt danach den Zusatz „e. V.“.', '(1) The association is called “Kontor – offenes Berufsnetz”. It is to be entered in the register of associations and will then carry the suffix “e. V.”.'),
      t('(2) Der Verein hat seinen Sitz in Hamburg.', '(2) The association has its seat in Hamburg.'),
      t('(3) Das Geschäftsjahr ist das Kalenderjahr.', '(3) The financial year is the calendar year.'),
    ],
  },
  {
    titel: t('§ 2 Zweck', '§ 2 Purpose'),
    absaetze: [
      t('(1) Der Verein verfolgt ausschließlich und unmittelbar gemeinnützige Zwecke im Sinne des Abschnitts „Steuerbegünstigte Zwecke“ der Abgabenordnung.',
        '(1) The association pursues exclusively and directly charitable purposes within the meaning of the section “Tax-privileged purposes” of the German Fiscal Code (Abgabenordnung).'),
      t('(2) Zwecke des Vereins sind die Förderung der Volks- und Berufsbildung (§ 52 Abs. 2 Satz 1 Nr. 7 AO), die Förderung des Verbraucherschutzes (§ 52 Abs. 2 Satz 1 Nr. 16 AO) und die Förderung des bürgerschaftlichen Engagements zugunsten gemeinnütziger Zwecke (§ 52 Abs. 2 Satz 1 Nr. 25 AO).',
        '(2) The purposes of the association are the promotion of adult and vocational education (§ 52(2) sentence 1 no. 7 AO), of consumer protection (no. 16) and of civic engagement in favour of charitable purposes (no. 25).'),
      t('(3) Die Satzungszwecke werden insbesondere verwirklicht durch: a) Aufbau und Betrieb einer für alle frei und unentgeltlich zugänglichen, werbefreien Plattform, auf der Menschen berufliches Wissen und Erfahrungen austauschen, Fragen stellen, voneinander lernen und sich gegenseitig unterstützen; b) Entwicklung und Veröffentlichung der dafür nötigen Software als Freie Software; c) Aufklärung und Information über Datenschutz, digitale Selbstbestimmung und faire Bedingungen in beruflichen Online-Netzwerken; d) Veranstaltungen, Lernangebote und Veröffentlichungen zu diesen Themen.',
        '(3) The purposes are realised in particular by: a) building and running a platform that is freely accessible to everyone, free of charge and free of advertising, on which people share professional knowledge and experience, ask questions, learn from each other and support each other; b) developing and publishing the software required as free software; c) educating and informing about data protection, digital self-determination and fair conditions in professional online networks; d) events, learning offers and publications on these topics.'),
      t('(4) Bei der Verwirklichung der Zwecke beachtet der Verein die Grundsätze der Charta, insbesondere: keine Werbung, kein Verkauf personenbezogener Daten und keine Verwendung für KI-Training ohne ausdrückliche Einwilligung.',
        '(4) In pursuing its purposes the association follows the principles of its charter, in particular: no advertising, no selling of personal data and no use for AI training without explicit consent.'),
    ],
  },
  {
    titel: t('§ 3 Selbstlosigkeit und Mittelverwendung', '§ 3 Selflessness and use of funds'),
    absaetze: [
      t('(1) Der Verein ist selbstlos tätig; er verfolgt nicht in erster Linie eigenwirtschaftliche Zwecke.', '(1) The association acts selflessly; it does not primarily pursue its own economic purposes.'),
      t('(2) Mittel des Vereins dürfen nur für die satzungsmäßigen Zwecke verwendet werden. Die Mitglieder erhalten keine Zuwendungen aus Mitteln des Vereins.', '(2) Funds of the association may only be used for the purposes set out in these statutes. Members receive no payments from the association’s funds.'),
      t('(3) Es darf keine Person durch Ausgaben, die dem Zweck des Vereins fremd sind, oder durch unverhältnismäßig hohe Vergütungen begünstigt werden.', '(3) No person may benefit from expenses that are foreign to the purpose of the association or from disproportionately high remuneration.'),
      t('(4) Vereinsämter werden grundsätzlich ehrenamtlich ausgeübt. Die Mitgliederversammlung kann eine angemessene Vergütung im Rahmen des § 3 Nr. 26a EStG beschließen.', '(4) Offices in the association are generally honorary. The general meeting may decide on reasonable compensation within the limits of § 3 no. 26a EStG.'),
    ],
  },
  {
    titel: t('§ 4 Mitgliedschaft', '§ 4 Membership'),
    absaetze: [
      t('(1) Mitglied kann jede natürliche und juristische Person werden, die die Zwecke des Vereins unterstützt. Über den Aufnahmeantrag in Textform entscheidet der Vorstand.', '(1) Any natural or legal person who supports the purposes of the association may become a member. The board decides on the application, submitted in text form.'),
      t('(2) Neben ordentlichen Mitgliedern gibt es Fördermitglieder. Sie unterstützen den Verein finanziell und haben in der Mitgliederversammlung Rede-, aber kein Stimmrecht.', '(2) In addition to full members there are supporting members. They support the association financially and may speak, but not vote, at the general meeting.'),
      t('(3) Die Mitgliedschaft endet durch Austritt in Textform zum Ende eines Monats, durch Ausschluss bei grobem Verstoß gegen die Vereinsinteressen nach Anhörung oder durch Tod beziehungsweise Auflösung der juristischen Person.', '(3) Membership ends by resignation in text form at the end of a month, by exclusion for a serious breach of the association’s interests after a hearing, or by death or dissolution of the legal person.'),
    ],
  },
  {
    titel: t('§ 5 Beiträge', '§ 5 Contributions'),
    absaetze: [
      t('(1) Die Mitglieder zahlen Beiträge nach einer Beitragsordnung, die die Mitgliederversammlung beschließt. Der Vorstand kann Beiträge auf Antrag ermäßigen oder erlassen.', '(1) Members pay contributions according to a contribution schedule adopted by the general meeting. The board may reduce or waive contributions on request.'),
      t('(2) Die Nutzung der Plattform ist nicht an eine Mitgliedschaft oder einen Beitrag gebunden.', '(2) Use of the platform does not require membership or any contribution.'),
    ],
  },
  {
    titel: t('§ 6 Organe', '§ 6 Bodies'),
    absaetze: [
      t('Organe des Vereins sind die Mitgliederversammlung und der Vorstand.', 'The bodies of the association are the general meeting and the board.'),
    ],
  },
  {
    titel: t('§ 7 Mitgliederversammlung', '§ 7 General meeting'),
    absaetze: [
      t('(1) Die ordentliche Mitgliederversammlung findet mindestens einmal im Jahr statt. Sie kann in Präsenz, online oder in gemischter Form abgehalten werden.', '(1) The ordinary general meeting takes place at least once a year. It may be held in person, online or in hybrid form.'),
      t('(2) Der Vorstand lädt mit einer Frist von vier Wochen in Textform unter Angabe der Tagesordnung ein. Eine außerordentliche Versammlung ist einzuberufen, wenn ein Zehntel der Mitglieder dies verlangt.', '(2) The board invites in text form with four weeks’ notice and an agenda. An extraordinary meeting must be convened if one tenth of the members request it.'),
      t('(3) Die Mitgliederversammlung beschließt mit einfacher Mehrheit der abgegebenen Stimmen. Satzungsänderungen bedürfen einer Mehrheit von zwei Dritteln, Änderungen des Zwecks und die Auflösung einer Mehrheit von drei Vierteln.', '(3) The general meeting decides by a simple majority of votes cast. Amendments to the statutes require a two-thirds majority; changes of purpose and dissolution require a three-quarters majority.'),
      t('(4) Sie wählt und entlastet den Vorstand, beschließt die Beitragsordnung und den Haushalt und nimmt den jährlichen Finanzbericht entgegen. Über die Beschlüsse wird ein Protokoll angefertigt.', '(4) It elects and discharges the board, adopts the contribution schedule and the budget, and receives the annual financial report. Minutes are kept of its resolutions.'),
    ],
  },
  {
    titel: t('§ 8 Vorstand', '§ 8 Board'),
    absaetze: [
      t('(1) Der Vorstand im Sinne des § 26 BGB besteht aus drei Personen. Je zwei Vorstandsmitglieder vertreten den Verein gemeinsam.', '(1) The board within the meaning of § 26 BGB consists of three persons. Any two board members jointly represent the association.'),
      t('(2) Der Vorstand wird für zwei Jahre gewählt und bleibt bis zur Neuwahl im Amt.', '(2) The board is elected for two years and remains in office until a new election.'),
    ],
  },
  {
    titel: t('§ 9 Beteiligung der Nutzenden und Transparenz', '§ 9 User participation and transparency'),
    absaetze: [
      t('(1) Wesentliche Änderungen der Regeln der Plattform stellt der Vorstand vorab allen Nutzenden zur Abstimmung. Das Ergebnis ist zu veröffentlichen und in der Entscheidung zu berücksichtigen.', '(1) The board puts significant changes to the platform rules to a vote of all users beforehand. The result must be published and taken into account in the decision.'),
      t('(2) Der Verein veröffentlicht jährlich seine Satzung, die Namen der Vorstandsmitglieder, einen Tätigkeitsbericht sowie Einnahmen und Ausgaben.', '(2) Each year the association publishes its statutes, the names of the board members, an activity report and its income and expenses.'),
    ],
  },
  {
    titel: t('§ 10 Auflösung und Vermögensbindung', '§ 10 Dissolution and allocation of assets'),
    absaetze: [
      t('Bei Auflösung des Vereins oder bei Wegfall steuerbegünstigter Zwecke fällt das Vermögen des Vereins an eine juristische Person des öffentlichen Rechts oder eine andere steuerbegünstigte Körperschaft zwecks Verwendung für die Förderung der Volks- und Berufsbildung.',
        'On dissolution of the association or if tax-privileged purposes cease to apply, the association’s assets pass to a legal entity under public law or another tax-privileged body, to be used for the promotion of adult and vocational education.'),
    ],
  },
  {
    titel: t('§ 11 Inkrafttreten', '§ 11 Entry into force'),
    absaetze: [
      t('Diese Satzung wurde in der Gründungsversammlung am … beschlossen und tritt mit der Eintragung in das Vereinsregister in Kraft.', 'These statutes were adopted at the founding meeting on … and enter into force upon registration.'),
    ],
  },
];

// Open legal questions, stated honestly on the page.
export const HINWEISE = [
  t('Dies ist ein Entwurf, keine Rechtsberatung. Vor der Gründung soll das Finanzamt den Entwurf prüfen (Feststellung nach § 60a AO).', 'This is a draft, not legal advice. Before founding, the tax office should review it (determination under § 60a AO).'),
  t('Ein Berufsnetz ist nicht automatisch gemeinnützig: Wenn es vor allem den wirtschaftlichen Interessen seiner Nutzenden dient, kann das Finanzamt die Gemeinnützigkeit verneinen. Deshalb stehen Bildung, Wissensaustausch und Verbraucherschutz im Zweck – nicht Vermittlung.', 'A professional network is not automatically charitable: if it mainly serves its users’ economic interests, the tax office may deny charitable status. That is why the purpose centres on education, knowledge sharing and consumer protection – not brokering.'),
  t('Eine Stellen- oder Auftragsbörse könnte ein steuerpflichtiger wirtschaftlicher Geschäftsbetrieb sein. Ob und wie sie dazugehört, entscheiden wir erst nach Beratung.', 'A job or project board could count as a taxable business activity. Whether and how it belongs is decided only after advice.'),
  t('Für die Eintragung als e. V. braucht es sieben Gründungsmitglieder (§ 56 BGB).', 'Registering as an e. V. requires seven founding members (§ 56 BGB).'),
];

// Markdown export for the repository (SATZUNG.md).
export function alsMarkdown() {
  const zeilen = ['# Kontor – Grundsätze und Satzungsentwurf', '', '> Entwurf. Deutsch ist maßgeblich. Live: https://kontor.moinsen.dev/grundsaetze', '', '## Grundsätze (Charta)', ''];
  CHARTA.forEach((c, i) => zeilen.push(`${i + 1}. ${c.de}`));
  zeilen.push('', '## Satzungsentwurf', '');
  for (const p of SATZUNG) {
    zeilen.push(`### ${p.titel.de}`, '');
    for (const a of p.absaetze) zeilen.push(a.de, '');
  }
  zeilen.push('## Offene Punkte', '');
  for (const h of HINWEISE) zeilen.push(`- ${h.de}`);
  zeilen.push('');
  return zeilen.join('\n');
}
