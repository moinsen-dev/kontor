# STATE – Kontor

## Übergabe (2026-11-10, Pause wegen Claude-Limit, Fortsetzung 23:00)

**Geändert (Zwischenstand, nicht deployt):**
- Updates per E-Mail mit Double-Opt-In: `migrations/0004_abos.sql`, `src/abo.js`, API `/api/abo`, `/api/abo/bestaetigen`, `/api/abo/abmelden` in `src/worker.js`.
- Neuigkeiten-Seite `/neuigkeiten` + `/en/updates` mit Zwischenstand, Abo-Formular, RSS (`/neuigkeiten.xml`, `/en/updates.xml`): `src/neuigkeiten.js`, `src/seiten/neuigkeiten.js`, `public/static/neuigkeiten.js`.
- Mitmachen-Seite: erst Auswahl (5 Kacheln inkl. „Auf dem Laufenden bleiben“), dann nur das passende Formular: `public/static/mitmachen.js`, Styles.
- Versandskript mit Vorschau: `scripts/update-senden.mjs`.
- Datenschutz um E-Mail-Updates (Resend) ergänzt; Dankeseite der Umfrage verlinkt Updates.
- Secretariat-Profil `kontor` mit `RESEND_API_KEY` angelegt; Resend-Domain moinsen.dev verifiziert, Tracking aus.

**Halb fertig / nächste Schritte:**
1. Tests für `src/abo.js` (Lebenszyklus mit node:sqlite-Shim) und Seitentest um `neuigkeiten` ergänzen.
2. Lokal prüfen: `wrangler d1 migrations apply kontor --local`, dann `wrangler dev --port 8790 --var MAILS:konsole`; Abo im Browser durchspielen (Bestätigungslink aus der Konsole), Mitmachen-Auswahl auf Handy prüfen.
3. Commit, Push, Ideenkompass.
4. Udi: Secret setzen und deployen (siehe unten).

**Für Udi nach dem Test:**
```
secretariat run kontor -- sh -c 'umask 077; f=$(mktemp); trap "rm -f \"$f\"" EXIT; printf "{\"RESEND_API_KEY\":\"%s\"}" "$RESEND_API_KEY" > "$f"; wrangler secret bulk "$f" --name kontor'
wrangler d1 migrations apply kontor --remote && wrangler deploy
```

**Gelaufene Prüfungen:** bestehende 20 Tests (Stand vor den Abo-Tests).
