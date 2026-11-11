# RFC 0002: Bringing LinkedIn data into Kontor

- **Status:** Draft
- **Authors:** Ulrich Diedrichsen, Claude
- **Created:** 2026-11-11
- **Depends on:** RFC 0001

## Summary

Members can bring in their own LinkedIn data through two lawful routes: the **archive file** LinkedIn gives every member, and later LinkedIn's **official portability API** for members in the European Economic Area. Scraping is excluded.

Importing your **own profile** is the easy part. Importing your **connections** means handling personal data about people who never agreed to be in Kontor. Most of this RFC is about that.

## Problem

A complement is only useful if people do not have to start from zero. But a contact importer is one of the most legally exposed features a social network can have.

## Routes

| | A. Archive upload | B. Portability API | C. Scraping, extensions, "account-based" APIs |
|---|---|---|---|
| Who can use it | Every member, worldwide | **EEA members only** | n/a |
| LinkedIn's approval needed | No | Yes: Company Page, business verification, review | n/a |
| Freshness | One-off snapshot | Snapshot plus changelog of the last 28 days | n/a |
| Depends on LinkedIn's goodwill | Low | Regulatory obligation, but gated | Total |
| **Proposal** | **First** | **Second** | **Rejected** |

### Route A: the archive

**Verified (read 2026-11-11, from third-party documentation; LinkedIn's own help page could not be read).** Under *Settings & Privacy → Data privacy → Get a copy of your data*, a member can request an archive and receives a ZIP with one CSV per data type.

`Connections.csv` has the columns First Name, Last Name, URL, Email Address, Company, Position, Connected On. It starts with several lines of notes before the header. **Email Address is filled only for connections who allowed it, so most rows are blank.**

**Proposal.**

- The ZIP is **parsed in the browser and never uploaded.** Sifa has shown that this works.
- An **explicit allowlist** decides which files are opened at all. Initial list: profile, positions, education, skills, connections. Everything else, above all **messages, ad data and inferences, is never read.**
- The parser tolerates changes in column order, file names and preamble, and is tested against anonymised fixtures. LinkedIn does not publish this format as a stable interface.
- The member reviews everything before anything is saved, and each person in the connection list can be left out.

### Route B: the Member Data Portability API

**Verified (read 2026-11-11, Microsoft Learn).** LinkedIn offers the Member Data Portability (3rd Party) API in response to the EU Digital Markets Act.

- Only members in the **European Economic Area** can consent to share data with third-party applications.
- Access needs a LinkedIn Company Page association, verification of a business e-mail address, organisation details, a privacy policy, and LinkedIn's review. Personal e-mail addresses fail verification.
- Consent runs through OAuth with the scope `r_dma_portability_3rd_party`.
- The Snapshot API returns data by domain, including `PROFILE`, `POSITIONS`, `EDUCATION`, `SKILLS` and `CONNECTIONS`. `CONNECTIONS` is described as name, position, company and connection date of first-degree connections.
- The Changelog API returns events from the past 28 days, starting from the time of consent.

**Proposal.** Treat this as the second route, for EEA members who want a guided import or ongoing sync. Request only the profile domains and connections, never `INBOX`, `ADS_CLICKED` or similar.

### Route C: rejected

**Verified, from secondary sources (read 2026-11-11). The primary text must be checked before acceptance.** Section 8.2 of LinkedIn's User Agreement, effective 3 November 2025, prohibits scraping and copying and the use of bots and unauthorised automated methods. A US court held that hiQ breached that agreement. hiQ then accepted a consent judgment banning it from scraping and requiring deletion. LinkedIn continued suing scrapers in 2025.

**Proposal.** Kontor does not scrape, ship a browser extension that reads LinkedIn pages, or use third-party services that do. A project that asks members to trust it with their network cannot put their LinkedIn accounts at risk.

## People affected who are not members

**This is the central problem of this RFC.** A connections file contains names, employers and sometimes e-mail addresses of people who have no relationship with Kontor.

**Verified (read 2026-11-11).**

- In its 2021 WhatsApp decisions, the Irish data protection authority and the European Data Protection Board dealt with address books uploaded by users. Non-users' phone numbers were personal data, and the EDPB held that they **remained personal data after lossy hashing.** WhatsApp was found to have breached its information duties under Article 14 GDPR towards non-users. **Hashing is not anonymisation.**
- In *Freunde finden* (I ZR 65/14, 14 January 2016), the German Federal Court of Justice held that invitation e-mails Facebook sent to non-members through its contact import were **unlawful advertising**, even though a member triggered them, and that the import flow misled members about how their contacts would be used.

### Rules

**Proposal.** These are design constraints, not settings:

1. **The server never receives non-members' data in readable form.** The network book is end-to-end encrypted on the member's device ([RFC 0003](0003-architecture.md)).
2. **No shadow profiles.** Nothing about a person exists as an entity in Kontor until that person creates an account.
3. **No invitations sent by Kontor.** A member gets a personal link and sends it themselves, from their own account, in their own words.
4. **No enrichment.** We never look up missing e-mail addresses or combine one member's contacts with another's.
5. **No second-degree graph** derived from imports.
6. **Deleting the import really deletes it,** and leaving Kontor removes the encrypted book.

### Finding people you already know

A member will ask which of their contacts are already here. The obvious design, uploading hashed identifiers, is exactly what the WhatsApp case warns about.

**Proposal: reverse the direction.** Only members who **opt in** to being findable publish an identifier, such as their LinkedIn profile URL. Matching then happens on the importing member's device:

- **While the network is small:** the client downloads the list of opted-in identifiers and compares locally. The server learns nothing about anyone's contacts.
- **At larger scale:** a range query. The client sends a short prefix of a hash and receives all opted-in identifiers in that bucket, then compares locally. Prefixes are not stored.

A match is only a suggestion. A connection needs confirmation from both sides.

## Abuse and threats

| Threat | Mitigation |
|---|---|
| Claiming someone else's LinkedIn URL to intercept their contacts | Matches are suggestions and connections need mutual confirmation. Open question 3. |
| Harvesting the directory of opted-in identifiers | Opt-in only, rate limits, the identifier reveals nothing a public LinkedIn URL does not already show. |
| Malicious archive file (zip bomb, formula injection, oversized fields) | Size limits, strict parsing in a sandboxed worker, values treated as plain text. |
| Abusive member importing a stalking target | Import creates nothing visible to anyone else; no notification, no lookup. |
| An employer asks staff to pool their networks | No feature pools one member's book with another's. |

## Agents

Imported contact data is never exposed through public agent interfaces. A member's own agent can read it only under a grant from that member ([RFC 0004](0004-agent-readiness.md)).

## Acceptance criteria

- An automated test shows that no request leaving the browser during import contains a contact's name, URL or e-mail address.
- Files outside the allowlist are never opened, proven by test.
- Import of a fixture with changed column order succeeds; a malformed file fails cleanly without partial saves.
- No code path sends a message to an address originating from an import.
- A published data protection impact assessment exists.

## Open questions

1. **Household exemption:** the GDPR exempts purely personal activity, but explicitly not activity connected to a professional or commercial purpose. A professional address book may fall outside it, which could make the member a controller. If processing happens only on the member's device, what is Kontor's role? **Needs legal review.**
2. Can a non-profit association, or a sole proprietor before the association exists, pass LinkedIn's review for Route B? Which terms apply, and may data be stored after consent ends?
3. How do we verify that a member owns a LinkedIn URL without reading LinkedIn? Sign-in with LinkedIn may prove it for some members. Is it acceptable to have a LinkedIn dependency there?
4. Profile URLs change when a member edits a custom URL. How do we keep matches stable?
5. How do Article 14 information duties apply if the data never reaches the server?

## Sources

- LinkedIn Member Data Portability (3rd Party): <https://learn.microsoft.com/en-us/linkedin/dma/member-data-portability/member-data-portability-3rd-party/> (read 2026-11-11)
- Member Snapshot Domains: <https://learn.microsoft.com/en-us/linkedin/dma/member-data-portability/shared/snapshot-domain> (read 2026-11-11)
- Archive format: <https://enrow.io/en/blog/export-linkedin-contacts>, <https://getwarmpath.com/insights/export-and-combine-linkedin-connections-across-your-team> (secondary, read 2026-11-11)
- User Agreement section 8.2: <https://www.revenueflow.com/blog/linkedin-web-scraping> (secondary, read 2026-11-11); primary: <https://www.linkedin.com/legal/user-agreement> (not read)
- hiQ: <https://www.proskauer.com/blog/court-finds-hiq-breached-linkedins-terms-prohibiting-scraping-but-in-mixed-ruling-declines-to-grant-summary-judgment-to-either-party-as-to-certain-key-issues>, <https://www.jdsupra.com/legalnews/hiq-and-linkedin-reach-proposed-1727186> (read 2026-11-11)
- Enforcement in 2025: <https://news.bloomberglaw.com/artificial-intelligence/linkedin-battles-online-scrapers-in-perpetual-struggle-over-data> (read 2026-11-11)
- EDPB Binding Decision 1/2021 (WhatsApp): <https://www.edpb.europa.eu/system/files/2021-09/edpb_bindingdecision_202101_ie_sa_whatsapp_redacted_en.pdf> (read 2026-11-11)
- Federal Court of Justice, *Freunde finden*: <https://www.bundesgerichtshof.de/SharedDocs/Pressemitteilungen/DE/2016/2016007.html> (read 2026-11-11)
