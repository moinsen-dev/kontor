# Kontor

**Everyone complains about LinkedIn. Everyone stays. Why?**
**Alle ärgern sich über LinkedIn. Und alle bleiben. Warum?**

Live: <https://kontor.moinsen.dev> (Deutsch) · <https://kontor.moinsen.dev/en/> (English)

## English

Kontor (working title) asks before anyone builds: what bothers people about LinkedIn, what has it actually done for them, what would a better professional network need, and would they switch? The site shows the current situation with sources, an anonymous survey and live results.

If a network comes out of this, it should be open and not-for-profit. If hardly anyone would switch, nothing gets built – that is a result too.

Ideas, criticism and pull requests are welcome.

## Deutsch

Kontor (Arbeitstitel) fragt, bevor jemand baut: Was stört Menschen an LinkedIn, was hat es ihnen wirklich gebracht, was müsste ein besseres Berufsnetz können, und würden sie wechseln? Die Seite zeigt die aktuelle Lage mit Quellen, eine anonyme Umfrage und die Ergebnisse live.

Falls daraus ein Netz entsteht, soll es offen und nicht gewinnorientiert sein. Wenn kaum jemand wechseln würde, wird nichts gebaut – auch das ist ein Ergebnis.

Ideen, Kritik und Pull Requests sind willkommen.

## Development

Cloudflare Worker + static assets + D1. No runtime dependencies; only [wrangler](https://developers.cloudflare.com/workers/wrangler/) is needed.

```bash
pnpm db:local   # create the local D1 database
pnpm dev        # http://localhost:8790
pnpm test
```

- Survey questions (German and English) live only in `src/fragen.js`; the worker validates against them and the page renders from them.
- Pages: `public/index.html` (de), `public/en/index.html` (en), legal pages in both languages.

## Privacy / Datenschutz

No analytics, no third-party fonts or services, no IP storage, application logging off. Free text is never published. The hosting zone adds Cloudflare's bot-detection script, which may set a security cookie. Details: [`public/en/privacy.html`](public/en/privacy.html) · [`public/datenschutz.html`](public/datenschutz.html).

## Licence

[AGPL-3.0-only](LICENSE). A project by Ulrich Diedrichsen, Hamburg.
