# RFC 0001: A complement to LinkedIn, not a replacement

- **Status:** Draft
- **Authors:** Ulrich Diedrichsen, Claude
- **Created:** 2026-11-11
- **Depends on:** none

## Summary

Kontor does not try to get anyone to leave LinkedIn. It gives professionals a layer LinkedIn does not offer: a network that belongs to them, is useful to one person on the first day, and works alongside LinkedIn.

**Decision (Ulrich Diedrichsen, 2026-11-11):** "We do not want to be a replacement for LinkedIn, but a complement."

## Problem

**Verified.** Well-funded alternatives have failed on density and business model, not on design. Polywork closed on 31 January 2025 after raising more than USD 40 million, and Read.cv shut down on 16 May 2025 after being acquired. See Sources.

A replacement must solve the hardest problem first: why would anyone arrive at an empty network? The campaign site currently answers with pledges ("nobody moves alone"), which still asks people to believe in a future network.

## Proposal

**Proposal.** Reverse the order of value:

1. **Single-player value first.** Kontor must be worth using when none of your contacts are on it. Your imported network becomes a private, searchable book with your own memory attached, which LinkedIn does not give you.
2. **LinkedIn stays the place of reach.** People keep posting there. Kontor is where a request, an offer or a page lives, and LinkedIn is one place to share the link. The link is the growth path and needs no integration.
3. **Density arrives as a by-product.** The first reason to invite someone is a concrete introduction, not a promise of a future network.

### What Kontor is for

| LinkedIn is good at | Kontor would be good at |
|---|---|
| Reach and being found by strangers | Remembering and using the relationships you already have |
| Recruiter tooling and a large job market | Warm, double opt-in introductions |
| A public feed | Clear requests and offers |
| A network held by the platform | A network held by you, usable by your own agents |

### Relationship to LinkedIn

- One-way and member-initiated: data moves only because a member exercises their own right to it ([RFC 0002](0002-linkedin-import.md)).
- Kontor never depends on LinkedIn's goodwill. If LinkedIn closed every API tomorrow, the archive export route would remain.
- Kontor does not use LinkedIn's name or logo beyond plainly saying what it is compatible with, and states that it is not affiliated.

## Alternatives considered

| Alternative | Why not |
|---|---|
| **Replacement network** (the campaign's original framing) | Faces the empty-room problem directly. Rejected by the decision above. |
| **Browser extension on top of LinkedIn** | Fits "complement" best on the surface, but LinkedIn's terms prohibit such tools and accounts can be restricted. See [RFC 0002](0002-linkedin-import.md). |
| **Contribute to Sifa instead of building** | Considered and declined, see below. |
| **Do nothing** | The survey is still open and could yet show there is no demand. |

### Existing work we must not ignore

**Verified (read 2026-11-11).**

- **[Sifa](https://sifa.id)** is an alpha professional identity network on the AT Protocol, built in the Netherlands by Singi Labs and hosted in Germany. It imports positions, education and skills from a LinkedIn ZIP processed in the browser. Its profile schemas (`id.sifa.*`) are MIT-licensed. Its roadmap includes confirming real working relationships. Profiles are public by design.
- **[ProFed](https://joinprofed.social)** is an early-stage federated professional network on ActivityPub.
- **Atmos** is a professional network for creatives on the AT Protocol.
- **Wircle** and **Cosign** are closed, curated newcomers. Wircle offers an open API and an MCP server. (From notes collected on 2026-11-10, not rechecked.)

**Decision (Ulrich Diedrichsen, 2026-11-11):** Kontor continues as an independent project and does not build on or with Sifa.

**Proposal.** Kontor has its own public profile, because a member needs one, but does not compete on it. The focus is what public-by-design projects leave open: **the private network, introductions, member-controlled agents, and non-profit community governance.** Interoperability with open schemas remains welcome wherever it costs little and creates no dependency ([RFC 0003](0003-architecture.md)).

## People affected who are not members

This RFC itself touches none. The consequences are in [RFC 0002](0002-linkedin-import.md).

## Abuse and threats

"Complement" invites the temptation to automate LinkedIn. The list of [things we will not build](../roadmap.md#deliberately-not-planned) is part of this RFC.

## Agents

A complement that is agent-ready has a concrete advantage: your own assistant can use your own network, under your own control. See [RFC 0004](0004-agent-readiness.md).

## Consequences for the campaign site

The site was written for the old framing. **Nothing has been changed yet.** The survey has received no answers so far (read 2026-11-11), so changing questions now loses no data.

| Where | Today | Needs |
|---|---|---|
| Join page headline | "Nobody moves alone" | New framing |
| Pledge threshold text | "We start building at 1,000 pledges" | Reconcile with design-first and single-player value |
| Start page introduction | "nobody wants to move first" | New framing |
| Survey question `wechsel` | "Would you switch?", with "I would leave LinkedIn" | Ask about use alongside LinkedIn |
| README, "How it is meant to work" | "New networks fail because nobody wants to move first" | New framing |
| First published update | "nobody wants to move first" | Publish a new update explaining the change; do not rewrite history |
| New page | none | Public roadmap and RFC list |

## Acceptance criteria

- A person with no contacts on Kontor can complete a useful task in their first session.
- No feature in Stage 1 requires a second member.
- Kontor keeps working if LinkedIn's APIs become unavailable.

## Open questions

1. Is the pledge threshold still the right gate, now that Stage 1 is useful alone?
2. Is the first target group settled? Candidates so far: German-speaking freelancers and small firms, open-source developers.
3. Does the working title survive?

## Sources

- Polywork and Read.cv: <https://read.cv/a-new-chapter>, <https://www.seen.is/blog/what-polywork-taught-us> (collected 2026-11-10)
- Sifa: <https://sifa.id/about>, <https://sifa.id/compare/linkedin>, <https://sifa.id/roadmap> (read 2026-11-11; the compare page states "Last updated: March 2026")
- ProFed: <https://joinprofed.social/approach> (read 2026-11-11)
- Atmos: <https://discourse.atprotocol.community/t/atmos-building-a-professional-creative-network-on-at-protocol-architecture-notes/693> (read 2026-11-11)
