# Kontor – Anleitung für Agenten

Kontor (Arbeitstitel) prüft, ob ein offenes, nicht gewinnorientiertes Berufsnetz als Alternative zu LinkedIn gebraucht wird. Phase 1 ist nur eine Webseite: die Lage mit belegten Zahlen, eine anonyme Umfrage und öffentliche Ergebnisse. Es wird kein Netzwerk gebaut, bevor die Umfrage ausgewertet ist.

- Stack: Cloudflare Worker rendert alle Seiten zweisprachig (`src/seiten/`), statische Dateien unter `public/static/`, D1 (`migrations/`), Rate-Limit-Binding `LIMIT`. Keine Abhängigkeiten außer wrangler.
- Fragen in `src/fragen.js`, Zusagen und Schwellen in `src/beteiligung.js`, Grundsätze und Satzung in `src/satzung.js` (danach `SATZUNG.md` neu exportieren).
- Datenschutz ist Teil des Versprechens: keine Cookies, keine Fremd-Schriften, keine Analyse, keine IP-Speicherung, Worker-Protokollierung aus. Freitexte nie öffentlich ausgeben.
- Lokal: `pnpm db:local`, dann `pnpm dev` (Port 8790). Tests: `pnpm test`.
- Deploy und öffentliches GitHub-Repo nur mit Ulis ausdrücklichem Ja.
- Lizenz: AGPL-3.0-only.
- Idee und Recherche im Ideenkompass: `00 Eingang/Idee - Open LinkedIn, ein offenes berufliches Netzwerk.md`.
