# Kontor

**Everyone complains about LinkedIn. Everyone stays. Why?**
**Alle ärgern sich über LinkedIn. Und alle bleiben. Warum?**

Live: <https://kontor.moinsen.dev> (Deutsch) · <https://kontor.moinsen.dev/en/> (English)

## English

Kontor (working title) is a planned open, non-profit **complement to LinkedIn**: a place where your professional network belongs to you, works for you from the first day, and can be used by your own software agents under your control. Nobody has to leave LinkedIn.

**Nothing of the network is built yet.** The project is design-first: we describe what we want in public, and implement only what has passed review. Start with the [design documents](docs/README.md) and the [roadmap](docs/roadmap.md).

Ideas, criticism and pull requests are welcome.

## Deutsch

Kontor (Arbeitstitel) ist eine geplante offene, gemeinnützige **Ergänzung zu LinkedIn**: ein Ort, an dem dein berufliches Netzwerk dir gehört, vom ersten Tag an für dich arbeitet und unter deiner Kontrolle von deinen eigenen Software-Agenten genutzt werden kann. Niemand muss LinkedIn verlassen.

**Vom Netz ist noch nichts gebaut.** Wir beschreiben öffentlich, was entstehen soll, und entwickeln erst, was geprüft ist. Die [Entwürfe](docs/README.md) und die [Roadmap](docs/roadmap.md) sind auf Englisch.

Ideen, Kritik und Pull Requests sind willkommen.

## Development

This repository currently holds the campaign site: a Cloudflare Worker + static assets + D1. No runtime dependencies; only [wrangler](https://developers.cloudflare.com/workers/wrangler/) is needed.

```bash
pnpm db:local   # create the local D1 database
pnpm dev        # http://localhost:8790
pnpm test
```

- Pages are rendered by the worker in German and English (`src/seiten/`): start, survey (one question at a time), wishes (up/down votes and suggestions), join (pledges with thresholds), roadmap, principles and draft statutes, updates, imprint, privacy.
- Survey questions live only in `src/fragen.js`, pledges and thresholds in `src/beteiligung.js`, principles and statutes in `src/satzung.js` (`SATZUNG.md` is exported from it), the public roadmap in `src/roadmap.js` (kept in step with `docs/roadmap.md` by a test).
- Suggestions are stored unpublished; approve one with `wrangler d1 execute kontor --remote --command "UPDATE wuensche SET freigegeben = 1 WHERE id = '<id>'"`.

## How it is meant to work

Kontor must be useful to a single person before it needs a network. Pledges with public thresholds (1,000 people, 25 contributors, €500 a month in pledged donations, 7 founding members) show whether enough people want it. Building starts once they are reached and the design has passed review ([process](docs/process.md)).

## Privacy / Datenschutz

No analytics, no third-party fonts or services, no IP storage, application logging off. Free text is never published. The hosting zone adds Cloudflare's bot-detection script, which may set a security cookie. Details: <https://kontor.moinsen.dev/en/privacy> · <https://kontor.moinsen.dev/datenschutz>.

## Licence

[AGPL-3.0-only](LICENSE). A project by Ulrich Diedrichsen, Hamburg.
