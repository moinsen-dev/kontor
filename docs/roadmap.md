# Feature roadmap

> **Status: draft.** This is a catalogue of intentions. It promises no dates. A feature moves forward only through an accepted RFC ([process](process.md)).

## The ordering principle

Earlier professional networks did not die from bad software. They died because a new network is empty ([RFC 0001](rfcs/0001-complement-not-replacement.md)). So each stage must be worth using **before** the next one exists:

| Stage | Name | Useful when | Depends on |
|---|---|---|---|
| 0 | **Specify** | The design is public and being challenged | nothing |
| 1 | **My Kontor** | **One person** uses it | Accepted RFCs 0001 to 0004 |
| 2 | **Warm introductions** | **Two people** who know each other use it | Stage 1 |
| 3 | **Circles and market** | A **group** uses it | Stage 2 |
| 4 | **Open network** | Other servers and apps take part | Stage 3 |

Agent readiness is not a stage. It runs through all of them ([levels](#agent-readiness-by-stage)).

## Stage 1: My Kontor

Value for a single person, with nobody else on the network.

| Feature | What it does | Public wish | RFC |
|---|---|---|---|
| **Profile import** | Bring in positions, education and skills from your own LinkedIn export. | `linkedin_import` | 0002 |
| **Private network book** | Your LinkedIn connections as an encrypted personal address book only you can read. | `mitnehmen` | 0002, 0003 |
| **Relationship memory** | Private notes, tags, how you met, when you last spoke. | new | 0003 |
| **Ask my network** | "Who do I know in logistics in Hamburg?", answered from your own data on your own device. | new | 0003, 0004 |
| **Requests and offers** | "I am looking for…", "I can offer…", published as a link you can share on LinkedIn or anywhere. | `gesuche` | new |
| **Your public page** | A portable professional page at a stable address. No tracking, no ranking. | `daten_gehoeren_dir` | 0003 |
| **Full export, any time** | Everything in open formats, including deletion. | `mitnehmen` | 0003 |
| **My agent** | Connect your own assistant to your own data, with permissions you can see and revoke. | new | 0004 |

## Stage 2: Warm introductions

The first feature that needs another person, and the reason to invite them.

| Feature | What it does | Public wish | RFC |
|---|---|---|---|
| **Find people I already know** | See which of your contacts are here, without the server learning your contacts. | new | 0002 |
| **Mutual connections** | Both sides confirm. A match is only ever a suggestion. | new | 0003 |
| **Double opt-in introductions** | "Could you introduce me to X?" Nothing reaches X until the person in the middle agrees, and X then accepts. | new | 0004 |
| **Real recommendations** | Written by people who worked with you, instead of one-click endorsements. | `empfehlungen` | new |
| **Verified claims** | Evidence for "worked at X", confirmed by people or organisations who would know. | `echte_menschen` | new |

## Stage 3: Circles and market

Features that need density. We do not build them until a group exists to use them.

| Feature | What it does | Public wish | RFC |
|---|---|---|---|
| **Circles** | Moderated groups by trade and by city. | `gruppen` | new |
| **Project market** | Assignments for freelancers and small firms. | `projekte` | new |
| **Honest job listings** | Expiry date, salary range, a duty to answer applicants. | `echte_stellen` | new |
| **Mentoring** | Ask experienced people, across industries. | `mentoring` | new |
| **Chosen feed** | Chronological or rules you pick. **No general feed before this stage**: a feed without density is an empty room. | `feed_waehlen` | new |
| **No public like counts** | Less competition for attention. | `keine_zaehler` | new |

## Stage 4: Open network

| Feature | What it does | Public wish | RFC |
|---|---|---|---|
| **Federation** | Other servers and apps can take part in the public layer. | `mitnehmen` | 0003 |
| **Fediverse bridge** | Follow people on Mastodon and other ActivityPub networks. | `fediverse` | new |
| **Self-hosting** | Run your own Kontor for a guild, firm or region. | new | 0003 |

## Standing commitments

Not features to schedule, but constraints on all of the above:

| Commitment | Public wish | Where it is defined |
|---|---|---|
| No advertising, no paid reach, no Premium | `keine_werbung` | Principles on the site |
| No AI training on personal data, no sale of data | `daten_gehoeren_dir` | Principles on the site |
| Humans remain identifiable as humans; agents are always declared | `echte_menschen` | [RFC 0004](rfcs/0004-agent-readiness.md) |
| The community sets the rules, finances are public | `mitbestimmen` | Statutes, [process](process.md) |

## Agent readiness by stage

| Stage | Agent capability | Level ([RFC 0004](rfcs/0004-agent-readiness.md)) |
|---|---|---|
| 0 | RFCs, roadmap and results are machine-readable | L0 |
| 1 | A signed Agent Card and read-only skills for public data; your own agent reads your own data | L1 |
| 2 | Agents act for you under revocable grants; agent-negotiated introductions with human approval | L2 and L3 |
| 3 and later | Community-governed rules for agents in circles and markets | L3 |

## Deliberately not planned

- Importing from LinkedIn by scraping, browser extensions or automation of any kind.
- Importing messages from LinkedIn.
- Sending invitations to people who are not members.
- Profiles of people who did not create one ("shadow profiles").
- Writing to LinkedIn automatically or posting on a member's behalf.
