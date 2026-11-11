# STATE – Kontor

## Übergabe (2026-11-11)

**Geändert und lokal geprüft, noch nicht deployt:**
- Updates per E-Mail mit Double-Opt-In: `migrations/0004_abos.sql`, `src/abo.js`, API `/api/abo`, `/api/abo/bestaetigen`, `/api/abo/abmelden`.
- Neuigkeiten-Seite `/neuigkeiten` + `/en/updates` mit Zwischenstand, Abo-Formular und RSS (`/neuigkeiten.xml`, `/en/updates.xml`).
- Mitmachen-Seite: erst Auswahl (5 Kacheln), dann nur das passende Formular.
- Versandskript mit Vorschau: `scripts/update-senden.mjs` (noch nie echt gelaufen, braucht die Live-Datenbank).
- Datenschutz um E-Mail-Updates (Resend) ergänzt. Secretariat-Profil `kontor` mit `RESEND_API_KEY`; Resend-Domain moinsen.dev verifiziert, Tracking aus (Angabe vom 10.11., nicht neu geprüft).

**Am 11.11. behoben (Tests decken die ersten beiden ab):**
- Erneute Bestätigungsmail bekam nicht die versprochenen sieben Tage.
- Zweiter Klick auf den Bestätigungslink meldete „ungültig“.
- Auf dem Handy lag die Formularüberschrift unter der festen Kopfleiste.

**Offen:**
1. Unbestätigte Adressen werden bisher nur gelöscht, wenn sich jemand anderes anmeldet. Die Seite verspricht sieben Tage. `aufraeumen()` in `src/abo.js` ist fertig, es fehlt ein täglicher Worker-Cron (`scheduled`-Handler, `triggers.crons` in `wrangler.jsonc`). Wartet auf Udis ausdrückliches Ja zum zeitgesteuerten Job. Das Versprechen gilt erst damit.
2. Udi: Secret setzen und deployen:
```
secretariat run kontor -- sh -c 'umask 077; f=$(mktemp); trap "rm -f \"$f\"" EXIT; printf "{\"RESEND_API_KEY\":\"%s\"}" "$RESEND_API_KEY" > "$f"; wrangler secret bulk "$f" --name kontor'
wrangler d1 migrations apply kontor --remote && wrangler deploy
```
3. Nach dem Deploy: ein echtes Abo mit echter Mail durchspielen, dann die Vorschau von `update-senden.mjs`.

**Lokal testen:** `wrangler d1 migrations apply kontor --local --persist-to <ordner>`, dann `wrangler dev --port 8790 --var MAILS:konsole --persist-to <ordner>`. Der Bestätigungslink steht in der Konsole und zeigt wegen der Route auf `http://kontor.moinsen.dev/…`: Host von Hand auf `localhost:8790` ändern.

**Gelaufene Prüfungen (11.11.):** 39 Tests grün; drei der neuen Tests schlagen gegen den alten Abo-Code fehl. Browser lokal: Formular ohne Haken abgelehnt, Anmelden, Link öffnen ändert nichts, Knopf bestätigt, zweiter Klick bestätigt, Abmelden löscht die Zeile. Handybreite 375 und 320 ohne Überlauf. Echter Versand über Resend nicht getestet.

## Sichtbarkeit (Quelle: Ideenkompass, „ASO, SEO und GEO - Übersicht“)

| Punkt | Seite | Status |
|---|---|---|
| Eigener Titel, Beschreibung, hreflang | Neuigkeiten | geprüft (Test) |
| RSS wohlgeformt, beide Sprachen | Feeds | geprüft (Test, xmllint) |
| Aussagen gegen Produkt: Schwellen 1.000 / 25 / 500 € / 7, Livegang 10.11. | erste Neuigkeit | geprüft |
| Sitemap, robots.txt | ganze Website | fehlen (404), Wirkung offen, nicht Teil dieses Auftrags |
| Öffentliche Fassung nach Deploy | Neuigkeiten, Feeds | geplant |
