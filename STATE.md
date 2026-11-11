# STATE: Kontor

## Handoff (2026-11-11)

### Design phase (just started, uncommitted, awaiting Udi's review)

Udi's decisions on 2026-11-11: Kontor is a complement to LinkedIn, not a replacement; documented in English; design-first with a long specification phase; A2A-ready from day one; features to be collected as a roadmap.

Written as drafts in `docs/`: `process.md`, `roadmap.md`, RFC 0001 (complement), 0002 (LinkedIn import), 0003 (architecture), 0004 (agent readiness). `AGENTS.md` translated to English and given the design-first rule.

**Not changed:** the live site and README still use the old framing ("nobody moves alone", "would you switch?"). RFC 0001 lists every place.

**Open, needs Udi:**
1. What exactly counts as community approval? Udi's sentence broke off at "wenn die Community die ...". Assumed: implementation starts only after the community has approved the specification. Candidates are in `process.md`.
2. Whether and when to publish the drafts to the public repo, and to reword the live site.

**Decided by Udi on 2026-11-11:** Kontor continues independently of Sifa ("Eigenständig weiter"). No outreach planned, and nothing may depend on Sifa's service, schemas or roadmap.

**Needs before any RFC is accepted:** legal review of RFC 0002 (household exemption, non-members); primary check of LinkedIn's User Agreement section 8.2, which could only be read through secondary sources; a spike on the public-plane protocol.

### Campaign site, live (worker version `c40c15e8`, commit `cbf1cee`)

E-mail updates with double opt-in, updates page with RSS, choose-first join page, daily deletion job at 03:17 UTC, send script `scripts/update-senden.mjs`.

**Checked live on 2026-11-11:** pages, feeds and assets answer 200, feed well-formed, three new tables exist. Form submitted in the browser, confirmation mail arrived at `business@moinsen.dev`, preview of the first update sent. Resend domain verified, open and click tracking off.

**Not checked live:** confirming and unsubscribing with a real link (checked locally), because the mail tool does not release links from mail routed through the `business@` group, and on live systems that click is Udi's. The first cron run is on 2026-11-12 at 03:17 UTC. The test address `business@moinsen.dev` sits unconfirmed in `abos`; if Udi does not confirm it, it must be gone after the run on 2026-11-19, which proves the job works.

**Open:** send the first update after reviewing the preview, once there are recipients (currently 0): `secretariat run kontor -- node scripts/update-senden.mjs 2026-11-10 --senden`.

**Local test:** `wrangler d1 migrations apply kontor --local --persist-to <dir>`, then `wrangler dev --port 8790 --var MAILS:konsole --persist-to <dir>` (add `--test-scheduled` for the job, trigger at `/cdn-cgi/handler/scheduled?cron=17+3+*+*+*`). The confirmation link appears in the console and points to `http://kontor.moinsen.dev/…` because of the route, so replace the host with `localhost:8790`.

**Tests:** 41 passing.

## Visibility (source: Ideenkompass, "ASO, SEO und GEO - Übersicht")

| Item | Page | Status |
|---|---|---|
| Own title, description, hreflang | Updates | checked (test) |
| RSS well-formed, both languages | Feeds | checked (live, xmllint) |
| Claims match the product: thresholds, launch date | First update | checked; framing outdated by RFC 0001 |
| Public version delivered | Updates, feeds | checked (200); crawling and indexing open |
| Sitemap, robots.txt | Whole site | missing (404), effect open, out of scope so far |
