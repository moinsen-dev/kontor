# Design-first process

> **Status: draft.** All numbers below are proposals.

**Decision (Ulrich Diedrichsen, 2026-11-11):** Kontor is documented in English and designed before it is implemented: first a long specification phase covering architecture and features, then implementation.

## Why this project works this way

A professional network holds sensitive data about people who never asked to be in it, and its early protocol choices are expensive to undo. Writing code is cheap. Migrating people's identities and undoing a privacy mistake are not. So the scarce step here is agreeing on the design, in public, before anyone depends on it.

## The rule

**No production code for the network without an accepted RFC.**

Two things are exempt:

1. **The campaign site** (`src/`, `public/`). It collects opinions and pledges and is not the network.
2. **Spikes.** A throwaway experiment that tests a specific claim in an RFC is encouraged, because a working experiment is better evidence than an argument. A spike lives on its own branch, uses no real personal data, is never deployed for real users, and its result is written back into the RFC.

## Stages of an RFC

| Stage | Meaning | Exit condition |
|---|---|---|
| **Idea** | An issue or a public wish. | Someone volunteers to write it up. |
| **Draft** | A pull request using the [template](rfcs/template.md). | The problem, alternatives and open questions are written down. |
| **Discussion** | Open for criticism. | At least 30 days have passed and every substantive objection has an answer. |
| **Review** | Privacy, security and, where needed, legal review. | Reviews are published, findings are resolved. |
| **Final comment** | Last call, announced on the site and by e-mail update. | 14 days without an unresolved blocking objection. |
| **Accepted** | Binding design. | Implementation may begin. |
| **Implemented** | Built and verified against the RFC's acceptance criteria. | |
| **Withdrawn / Superseded** | Kept for the record. | |

## Who decides

**Proposal.** Until the association exists, the maintainer accepts or rejects RFCs and must publish the reasoning. After the association is founded, its statutes define the decision-making body.

A public vote and a design review answer different questions:

- **Votes set priorities.** The wish list on the site tells us what people want first.
- **Review establishes soundness.** A popular design that endangers non-members is still rejected.

## Community gate

**Open question.** What must be true before "the community" has approved a design? Candidates, which can be combined:

- a minimum number of independent reviewers who are not maintainers (proposal: 5);
- a public vote of people who pledged, with a quorum;
- for the four foundation RFCs, a vote of the founding members once they exist.

## Extra gate for personal data

An RFC that processes personal data needs, before acceptance:

- a statement of the legal basis for every category of data, **including people who are not members**;
- a data protection impact assessment, or a written reason why none is needed;
- a retention and deletion rule for every category;
- a threat model that includes abuse by members and by agents.

## Contributions by AI agents

Agents are welcome to draft, review and implement. A human sponsor owns each contribution and answers for it, and agent authorship is disclosed in the pull request. Assertions of fact need a source that a human can check.

## Language

All project documentation is in English. The website stays bilingual, German and English. The draft statutes stay in German because they are filed in Germany.
