# STATE: Kontor

## Handoff (2026-11-11)

### Design phase (drafts public on GitHub since 2026-11-11)

Udi's decisions on 2026-11-11: Kontor is a complement to LinkedIn, not a replacement; documented in English; design-first with a long specification phase; A2A-ready from day one; features to be collected as a roadmap.

Written as drafts in `docs/`: `process.md`, `roadmap.md`, RFC 0001 (complement), 0002 (LinkedIn import), 0003 (architecture), 0004 (agent readiness). `AGENTS.md` translated to English and given the design-first rule.

**Live since 2026-11-11 (worker version `56d102ef`, commit `f36e7b5`):** reworded start page, join page, pledge text and survey question, a new update (`2026-11-11`, on the page and in the feeds, not e-mailed) and a new roadmap page (`/roadmap`, `/en/roadmap`). RFC 0001 lists every change. Checked: 44 tests; browser at desktop, 375 and 320 px without overflow, no console errors; live pages and feeds answer 200, new texts delivered, old framing gone.

**Open, needs Udi:**
1. Whether the pledge threshold stays the build gate now that Stage 1 is useful alone (RFC 0001, open question 1).

**Community gate decided by Udi on 2026-11-11:** at least 5 independent reviewers per RFC, plus a majority vote of the founding members for RFCs 0001 to 0004 (`process.md`). The foundation RFCs therefore cannot be accepted before founding members exist.

**Decided by Udi on 2026-11-11:** Kontor continues independently of Sifa ("Eigenständig weiter"). No outreach planned, and nothing may depend on Sifa's service, schemas or roadmap.

**Needs before any RFC is accepted:** legal review of RFC 0002 (household exemption, non-members); primary check of LinkedIn's User Agreement section 8.2, which could only be read through secondary sources; a spike on the public-plane protocol.

### E-mail updates, live since 2026-11-11

E-mail updates with double opt-in, updates page with RSS, choose-first join page, daily deletion job at 03:17 UTC, send script `scripts/update-senden.mjs`.

**Checked live on 2026-11-11:** pages, feeds and assets answer 200, feed well-formed, three new tables exist. Form submitted in the browser, confirmation mail arrived at `business@moinsen.dev`, preview of the first update sent. Resend domain verified, open and click tracking off.

**Not checked live:** confirming and unsubscribing with a real link (checked locally), because the mail tool does not release links from mail routed through the `business@` group, and on live systems that click is Udi's. The first cron run is on 2026-11-12 at 03:17 UTC. The test address `business@moinsen.dev` sits unconfirmed in `abos`; if Udi does not confirm it, it must be gone after the run on 2026-11-19, which proves the job works.

**Open:** send an update after reviewing its preview, once there are recipients (currently 0). The current one is `2026-11-11`: `secretariat run kontor -- node scripts/update-senden.mjs 2026-11-11` for the preview, add `--senden` to send.

**Local test:** `wrangler d1 migrations apply kontor --local --persist-to <dir>`, then `wrangler dev --port 8790 --var MAILS:konsole --persist-to <dir>` (add `--test-scheduled` for the job, trigger at `/cdn-cgi/handler/scheduled?cron=17+3+*+*+*`). The confirmation link appears in the console and points to `http://kontor.moinsen.dev/…` because of the route, so replace the host with `localhost:8790`.

**Tests:** 44 passing.

## Visibility (source: Ideenkompass, "ASO, SEO und GEO - Übersicht")

| Item | Page | Status |
|---|---|---|
| Own title, description, hreflang | Updates | checked (test) |
| RSS well-formed, both languages | Feeds | checked (live, xmllint) |
| Claims match the product: thresholds, launch date | First update | checked; framing outdated by RFC 0001, left as history |
| Own title, description, hreflang; says nothing is built | Roadmap | checked (test, live 200); crawling and indexing open |
| Page title and description state the complement framing | Start | checked live; crawling and indexing open |
| Public version delivered | Updates, feeds | checked (200); crawling and indexing open |
| Sitemap, robots.txt | Whole site | missing (404), effect open, out of scope so far |
