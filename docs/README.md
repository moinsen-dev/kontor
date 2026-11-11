# Kontor design documents

> **Status: everything in this folder is a draft.** Nothing here has been accepted, and no feature described here exists yet.

Kontor (working title) is an open, non-profit **complement to LinkedIn**: a place where your professional network belongs to you, works for you from the first day, and can be used by your own software agents under your control.

The project is **design-first**. We write down what we want to build and why, invite criticism, and implement only what has passed review. See [process.md](process.md).

## Reading order

| Document | Question it answers | Status |
|---|---|---|
| [process.md](process.md) | How does a design become something we build? | Draft |
| [roadmap.md](roadmap.md) | Which features do we want, and in what order? | Draft |
| [RFC 0001](rfcs/0001-complement-not-replacement.md) | Why a complement to LinkedIn and not a replacement? | Draft |
| [RFC 0002](rfcs/0002-linkedin-import.md) | How can people bring their LinkedIn data, lawfully? | Draft |
| [RFC 0003](rfcs/0003-architecture.md) | What is the system made of? | Draft |
| [RFC 0004](rfcs/0004-agent-readiness.md) | What does "A2A-ready from day one" mean? | Draft |
| [RFC template](rfcs/template.md) | How do I propose something? | Draft |

## What exists today

Only the **campaign site** at <https://kontor.moinsen.dev>: a survey, wish voting, pledges, draft statutes and e-mail updates. It lives in `src/` and `public/`. It is not the network and does not constrain the network's architecture.

## How to read a claim

Every RFC separates four kinds of statement, because they deserve different levels of trust:

- **Verified:** checked against a named source, with the date it was read.
- **Decision:** made by a named person, with the date. Can still be challenged through an RFC.
- **Proposal:** the authors' recommendation. This is what reviewers should attack.
- **Open question:** we do not know yet.

None of this is legal advice. Every statement about law is an input for a qualified review, not a replacement for one.
