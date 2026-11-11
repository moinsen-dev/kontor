# Kontor: guide for agents

Kontor (working title) is a design-first, open, non-profit **complement to LinkedIn**. Today it consists of a **campaign site** (situation with sourced figures, anonymous survey, wish voting, pledges, e-mail updates) and a set of **draft design documents** in `docs/`. The network itself does not exist yet.

## Design-first

- Read `docs/README.md` and `docs/process.md` before proposing anything about the network.
- **No production code for the network without an accepted RFC** (`docs/rfcs/`). The campaign site and clearly marked throwaway spikes are exempt.
- All RFCs are drafts until `docs/process.md` says otherwise. Do not describe a draft as decided.
- Separate Verified, Decision, Proposal and Open question in every design document, with source and date.

## Language

All project documentation, RFCs, code comments and commits are in English. The website stays bilingual (German and English). `SATZUNG.md` stays German.

## Campaign site

- Stack: a Cloudflare Worker renders all pages in both languages (`src/seiten/`), static files in `public/static/`, D1 (`migrations/`), rate-limit binding `LIMIT`, daily cron for deleting unconfirmed e-mail addresses. No dependencies except wrangler.
- Questions in `src/fragen.js`, pledges and thresholds in `src/beteiligung.js`, principles and statutes in `src/satzung.js` (re-export `SATZUNG.md` afterwards), e-mail updates in `src/abo.js` and `src/neuigkeiten.js`.
- Privacy is part of the promise: no cookies of our own, no third-party fonts, no analytics, no storing of IP addresses, worker logging off. Never publish free-text answers.
- Local: `pnpm db:local`, then `pnpm dev` (port 8790). Tests: `pnpm test`.

## Rules

- Deploying, and anything public on GitHub that goes beyond a normal verified code change, needs Uli's explicit yes.
- Never scrape LinkedIn or build anything that does (`docs/rfcs/0002-linkedin-import.md`).
- License: AGPL-3.0-only.
- Idea and research in the Ideenkompass vault: `00 Eingang/Idee - Open LinkedIn, ein offenes berufliches Netzwerk.md`.
