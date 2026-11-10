import { seite, ROUTEN, REPO } from './layout.js';

const t = (de, en) => ({ de, en });

const KARTEN = [
  { zahl: t('1,3 Mrd.', '1.3 bn'), text: t('registrierte LinkedIn-Mitglieder weltweit. Registriert heißt nicht aktiv.', 'registered LinkedIn members worldwide. Registered does not mean active.'),
    quelle: t('Microsoft, Jahresbericht 2026', 'Microsoft, Annual Report 2026'), url: 'https://www.microsoft.com/investor/reports/ar26/' },
  { zahl: t('15 % · 8 %', '15 % · 8 %'), text: t('der Menschen in Deutschland nutzen LinkedIn beziehungsweise XING. Eine Befragung vom Mai 2025 ergab: 83 % nutzen keins von beiden.', 'of people in Germany use LinkedIn and XING respectively. A May 2025 survey found that 83 % use neither.'),
    quelle: t('YouGov und Macromedia, Februar 2026', 'YouGov and Macromedia, February 2026 (German)'), url: 'https://www.macromedia-fachhochschule.de/de/hochschule/ueber-uns/news/studie-linkedin-vs-xing/' },
  { zahl: t('über 40 %', 'over 40 %'), text: t('der längeren LinkedIn-Beiträge wurden in einer großen Stichprobe als KI-generiert eingestuft.', 'of longer LinkedIn posts were classified as AI-generated in a large sample.'),
    quelle: t('Pangram, Juli 2026 (Anbieter von KI-Erkennung)', 'Pangram, July 2026 (an AI-detection vendor)'), url: 'https://www.pangram.com/blog/ai-in-your-feed' },
  { zahl: t('1 Mio.', '1 million'), text: t('Mal drückten Mitglieder in den ersten Wochen den neuen Knopf „wirkt wie KI-Brei“.', 'times members pressed the new “seems like AI slop” button in the first weeks.'),
    quelle: t('LinkedIn, September 2026', 'LinkedIn, September 2026'), url: 'https://news.linkedin.com/2026/how-linkedin-is-tackling-ai-slop' },
  { zahl: t('−13 % · −17 %', '−13 % · −17 %'), text: t('weniger Likes und Kommentare Anfang 2026 im Vergleich zum Vorjahr, gemessen an 673.658 Beiträgen.', 'fewer likes and comments in early 2026 than a year before, across 673,658 posts.'),
    quelle: t('Metricool, April 2026', 'Metricool, April 2026'), url: 'https://metricool.com/press-release-linkedin-study-2026/' },
  { zahl: t('18–22 %', '18–22 %'), text: t('der Stellenanzeigen auf einer großen Recruiting-Plattform waren Scheinstellen ohne echte Einstellungsabsicht.', 'of job postings on a large recruiting platform were ghost jobs with no real intent to hire.'),
    quelle: t('Greenhouse, Dezember 2024 (nicht LinkedIn-spezifisch)', 'Greenhouse, December 2024 (not LinkedIn-specific)'), url: 'https://www.greenhouse.com/blog/greenhouse-2024-state-of-job-hunting-report' },
  { zahl: t('3.11.2025', '3 Nov 2025'), text: t('Seitdem trainiert LinkedIn KI mit den Daten seiner Mitglieder, solange sie nicht widersprechen.', 'Since then LinkedIn trains AI on its members’ data unless they opt out.'),
    quelle: t('Landesdatenschutzbeauftragte NRW, Oktober 2025', 'Data Protection Commissioner NRW, October 2025 (German)'), url: 'https://www.ldi.nrw.de/LinkedIn_Widerspruch' },
  { zahl: t('310 Mio. €', '€310 m'), text: t('Bußgeld der irischen Datenschutzbehörde gegen LinkedIn wegen Verhaltensanalyse und zielgerichteter Werbung.', 'fine imposed on LinkedIn by the Irish Data Protection Commission over behavioural analysis and targeted ads.'),
    quelle: t('Data Protection Commission, Oktober 2024', 'Data Protection Commission, October 2024'), url: 'https://www.dataprotection.ie/en/news-media/press-releases/irish-data-protection-commission-fines-linkedin-ireland-eu310-million' },
];

const TEXT = {
  de: {
    titel: 'Kontor – ein offenes, gemeinnütziges Berufsnetz?',
    og: 'Alle ärgern sich über LinkedIn. Und alle bleiben. Warum?',
    beschreibung: 'Viele ärgern sich über LinkedIn und bleiben trotzdem. Wir fragen, was stört, stimmen über Wünsche ab und sammeln Zusagen für ein offenes, gemeinnütziges Berufsnetz.',
    vorzeile: 'Ein offenes, gemeinnütziges Berufsnetz – wenn genug Menschen mitkommen',
    h1: 'Alle ärgern sich über LinkedIn. Und alle bleiben. Warum?',
    einleitung: 'Neue Netzwerke scheitern selten an der Technik, sondern daran, dass niemand als Erster umziehen will. Deshalb drehen wir es um: Erst sagen genug Menschen zu, dann wird gebaut. Niemand zieht allein um.',
    wege: [
      { id: 'umfrage', titel: '1 · Umfrage', text: 'Was stört dich, was hat LinkedIn dir wirklich gebracht? Zehn kurze Fragen, eine nach der anderen, anonym.', knopf: 'Umfrage starten' },
      { id: 'wuensche', titel: '2 · Wünsche', text: 'Was müsste ein besseres Netz können? Stimme ab oder schlage selbst etwas vor.', knopf: 'Abstimmen' },
      { id: 'mitmachen', titel: '3 · Mitmachen', text: 'Sag zu, dass du mitkommst, mitbaust, spendest oder den Verein mitgründest.', knopf: 'Zusagen' },
    ],
    standTitel: 'Zwischenstand',
    standText: 'Wir starten erst, wenn genug Menschen zusagen. So sieht es gerade aus:',
    warumTitel: 'Warum ich frage',
    zitat: 'Ich bin seit 2014 auf LinkedIn und seit 2024 aktiv. Einen Auftrag oder eine Verbindung, die mich wirklich weitergebracht hat, kann ich nicht nennen. Über XING habe ich zwischen 2015 und 2024 dagegen sehr viele Aufträge bekommen. Geht es nur mir so?',
    zitatVon: 'Ulrich Diedrichsen, Softwareentwickler aus Hamburg',
    lageTitel: 'Die Lage im November 2026',
    lageText: 'Zahlen aus öffentlichen Quellen. Sie zeigen Muster, keine repräsentative Zufriedenheit.',
    altTitel: 'Und die Alternativen?',
    alt: [
      '<strong>Polywork</strong> sammelte über 40 Millionen Dollar und schloss im Januar 2025. <strong>Read.cv</strong> wurde im Mai 2025 abgeschaltet. Beide scheiterten nicht am Design, sondern daran, dass zu wenige Menschen da waren.',
      '<strong>Offene Berufsnetze gibt es schon</strong>, etwa <a href="https://vutuv.de/">vutuv</a> (Open Source, mit dem Fediverse verbunden) mit einigen Tausend Mitgliedern. Software ist also nicht das Problem.',
      '<strong>XING</strong> hat Gruppen abgebaut und wird seltener genutzt als LinkedIn, ist für viele im Mittelstand aber weiter ein Ort für Aufträge.',
    ],
    bleibenTitel: 'Warum bleiben trotzdem alle?',
    bleibenText: 'Die ersten beiden Gründe sind gut belegt, die letzten beiden sind unsere Einschätzung.',
    bleiben: [
      '<strong>Dort sind die Menschen.</strong> Kundinnen, frühere Kollegen, Recruiter. Ein Netz ist nur so gut wie die Leute darin.',
      '<strong>Kontakte lassen sich nicht mitnehmen.</strong> Eine Liste kann man exportieren, Aufmerksamkeit und Vertrauen nicht.',
      '<strong>Die Hoffnung auf den einen Treffer.</strong> Wer Erfolg hatte, erzählt davon; wer nichts bekommt, schweigt. So wirkt LinkedIn erfolgreicher, als es für die meisten ist.',
      '<strong>Man geht nicht, man wird leiser.</strong> Viele kündigen Premium, filtern den Feed oder nutzen das Profil nur noch als Visitenkarte.',
    ],
    bleibenSchluss: 'Genau deshalb sammeln wir Zusagen: Wenn alle wissen, dass genug andere mitkommen, fällt der erste Schritt leicht.',
    wasTitel: 'Was das hier ist – und was nicht',
    was: [
      `<strong>Gemeinnützig geplant:</strong> Getragen werden soll Kontor von einem gemeinnützigen Verein, der der Gemeinschaft gehört, nicht Investoren. <a href="${ROUTEN.grundsaetze.de}">Grundsätze und Satzungsentwurf</a> sind öffentlich.`,
      `<strong>Offen:</strong> Der Code liegt auf <a href="${REPO}">GitHub</a> unter der Lizenz AGPL-3.0. Die Ergebnisse sind öffentlich.`,
      '<strong>Erst Zusagen, dann bauen:</strong> Wenn zu wenige mitkommen, bauen wir nichts. Auch das ist ein Ergebnis.',
      '<strong>Kein Verkauf:</strong> Hier wird nichts verkauft, keine Daten werden weitergegeben oder für KI-Training genutzt.',
    ],
    arbeitstitel: '„Kontor“ ist ein Arbeitstitel – nach den Hamburger Kontoren, in denen Kaufleute sich trafen und Geschäfte machten.',
  },
  en: {
    titel: 'Kontor – an open, non-profit professional network?',
    og: 'Everyone complains about LinkedIn. Everyone stays. Why?',
    beschreibung: 'Many people are fed up with LinkedIn and stay anyway. We ask what bothers you, vote on wishes and collect pledges for an open, non-profit professional network.',
    vorzeile: 'An open, non-profit professional network – if enough people come along',
    h1: 'Everyone complains about LinkedIn. Everyone stays. Why?',
    einleitung: 'New networks rarely fail on technology; they fail because nobody wants to move first. So we turn it around: first enough people pledge, then we build. Nobody moves alone.',
    wege: [
      { id: 'umfrage', titel: '1 · Survey', text: 'What bothers you, what has LinkedIn really done for you? Ten short questions, one at a time, anonymous.', knopf: 'Start the survey' },
      { id: 'wuensche', titel: '2 · Wishes', text: 'What would a better network need? Vote, or suggest something yourself.', knopf: 'Vote' },
      { id: 'mitmachen', titel: '3 · Join', text: 'Pledge to come along, help build, donate or co-found the association.', knopf: 'Pledge' },
    ],
    standTitel: 'Progress so far',
    standText: 'We only start once enough people pledge. This is where we are:',
    warumTitel: 'Why I’m asking',
    zitat: 'I’ve been on LinkedIn since 2014 and active since 2024. I can’t name a single project or connection that really moved me forward. Through XING, the German network, I got a lot of work between 2015 and 2024. Is it just me?',
    zitatVon: 'Ulrich Diedrichsen, software developer from Hamburg',
    lageTitel: 'The situation in November 2026',
    lageText: 'Figures from public sources. They show patterns, not representative satisfaction.',
    altTitel: 'What about the alternatives?',
    alt: [
      '<strong>Polywork</strong> raised more than 40 million dollars and shut down in January 2025. <strong>Read.cv</strong> closed in May 2025. Neither failed on design; they failed because too few people were there.',
      '<strong>Open professional networks already exist</strong>, for example <a href="https://vutuv.de/">vutuv</a> (open source, connected to the Fediverse) with a few thousand members. Software is not the problem.',
      '<strong>XING</strong>, the German-speaking network, has removed its groups and is used less than LinkedIn, but for many small and mid-sized businesses it is still a place to find work.',
    ],
    bleibenTitel: 'So why does everyone stay?',
    bleibenText: 'The first two reasons are well documented, the last two are our assessment.',
    bleiben: [
      '<strong>That’s where the people are.</strong> Clients, former colleagues, recruiters. A network is only as good as the people in it.',
      '<strong>You can’t take your contacts with you.</strong> You can export a list, but not attention and trust.',
      '<strong>Hoping for the one big hit.</strong> People who succeed talk about it; people who get nothing stay quiet. So LinkedIn looks more successful than it is for most.',
      '<strong>People don’t leave, they go quiet.</strong> Many cancel Premium, filter their feed or keep their profile only as a business card.',
    ],
    bleibenSchluss: 'That is exactly why we collect pledges: once everyone knows enough others are coming, the first step is easy.',
    wasTitel: 'What this is – and what it isn’t',
    was: [
      `<strong>Planned as a non-profit:</strong> Kontor is meant to be run by a non-profit association owned by its community, not by investors. <a href="${ROUTEN.grundsaetze.en}">Principles and draft statutes</a> are public.`,
      `<strong>Open:</strong> The code is on <a href="${REPO}">GitHub</a> under the AGPL-3.0 licence. The results are public.`,
      '<strong>Pledges first, then building:</strong> If too few people come along, we won’t build anything. That is a result too.',
      '<strong>Nothing for sale:</strong> Nothing is sold here, no data is passed on or used for AI training.',
    ],
    arbeitstitel: '“Kontor” is a working title – after the Hamburg trading offices where merchants met and did business.',
  },
};

export function start(s) {
  const x = TEXT[s];
  const wege = x.wege.map((w) => `
      <a class="weg" href="${ROUTEN[w.id][s]}">
        <span class="weg-titel">${w.titel}</span>
        <span class="weg-text">${w.text}</span>
        <span class="weg-knopf">${w.knopf} →</span>
      </a>`).join('');
  const karten = KARTEN.map((k) => `
        <article class="karte">
          <p class="zahl">${k.zahl[s]}</p>
          <p>${k.text[s]}</p>
          <p class="quelle"><a href="${k.url}">${k.quelle[s]}</a></p>
        </article>`).join('');
  const inhalt = `
<section class="held">
  <div class="breite">
    <p class="vorzeile">${x.vorzeile}</p>
    <h1>${x.h1}</h1>
    <p class="einleitung">${x.einleitung}</p>
    <div class="wege">${wege}</div>
  </div>
</section>

<section class="abschnitt abschnitt-getoent" id="stand">
  <div class="breite schmal">
    <h2>${x.standTitel}</h2>
    <p class="unterzeile">${x.standText}</p>
    <div id="schwellen" class="schwellen" data-sprache="${s}"></div>
  </div>
</section>

<section class="abschnitt" id="warum">
  <div class="breite schmal">
    <h2>${x.warumTitel}</h2>
    <blockquote class="zitat"><p>${x.zitat}</p><footer>${x.zitatVon}</footer></blockquote>
  </div>
</section>

<section class="abschnitt abschnitt-getoent" id="lage">
  <div class="breite">
    <h2>${x.lageTitel}</h2>
    <p class="unterzeile">${x.lageText}</p>
    <div class="karten">${karten}</div>
    <h3>${x.altTitel}</h3>
    <ul class="liste">${x.alt.map((a) => `<li>${a}</li>`).join('')}</ul>
  </div>
</section>

<section class="abschnitt" id="bleiben">
  <div class="breite schmal">
    <h2>${x.bleibenTitel}</h2>
    <p>${x.bleibenText}</p>
    <ol class="liste">${x.bleiben.map((b) => `<li>${b}</li>`).join('')}</ol>
    <p>${x.bleibenSchluss} <a href="${ROUTEN.mitmachen[s]}">${s === 'de' ? 'Jetzt zusagen' : 'Pledge now'} →</a></p>
  </div>
</section>

<section class="abschnitt abschnitt-getoent" id="vorhaben">
  <div class="breite schmal">
    <h2>${x.wasTitel}</h2>
    <ul class="liste">${x.was.map((w) => `<li>${w}</li>`).join('')}</ul>
    <p class="arbeitstitel">${x.arbeitstitel}</p>
  </div>
</section>`;
  return seite({ id: 'start', sprache: s, titel: x.titel, ogTitel: x.og, beschreibung: x.beschreibung, inhalt, skript: 'start.js' });
}
