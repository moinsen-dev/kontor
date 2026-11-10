# Kontor – Anleitung für Agenten

Kontor (Arbeitstitel) prüft, ob ein offenes, nicht gewinnorientiertes Berufsnetz als Alternative zu LinkedIn gebraucht wird. Phase 1 ist nur eine Webseite: die Lage mit belegten Zahlen, eine anonyme Umfrage und öffentliche Ergebnisse. Es wird kein Netzwerk gebaut, bevor die Umfrage ausgewertet ist.

- Stack: Cloudflare Worker mit statischen Dateien (`public/`) und D1 (`migrations/`). Keine Abhängigkeiten außer wrangler.
- Die Fragen stehen nur in `src/fragen.js`; Worker und Seite lesen sie von dort.
- Datenschutz ist Teil des Versprechens: keine Cookies, keine Fremd-Schriften, keine Analyse, keine IP-Speicherung, Worker-Protokollierung aus. Freitexte nie öffentlich ausgeben.
- Lokal: `pnpm db:local`, dann `pnpm dev` (Port 8790). Tests: `pnpm test`.
- Deploy und öffentliches GitHub-Repo nur mit Ulis ausdrücklichem Ja.
- Lizenz: AGPL-3.0-only.
- Idee und Recherche im Ideenkompass: `00 Eingang/Idee - Open LinkedIn, ein offenes berufliches Netzwerk.md`.
