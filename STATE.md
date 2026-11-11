# STATE – Kontor

## Übergabe (2026-11-11)

**Live auf kontor.moinsen.dev (Worker-Version `c40c15e8`, Commit `cbf1cee`):**
- Updates per E-Mail mit Double-Opt-In über Resend, API `/api/abo`, `/api/abo/bestaetigen`, `/api/abo/abmelden`.
- Neuigkeiten-Seite `/neuigkeiten` + `/en/updates` mit Zwischenstand, Abo-Formular und RSS (`/neuigkeiten.xml`, `/en/updates.xml`).
- Mitmachen-Seite: erst Auswahl (5 Kacheln), dann nur das passende Formular.
- Täglicher Löschlauf 03:17 UTC für unbestätigte Adressen (Udis Ja vom 11.11.).
- Versandskript mit Vorschau: `scripts/update-senden.mjs`.

**Live geprüft (11.11.):** 16 Seiten, Feeds und Assets antworten 200, Feed wohlgeformt, drei neue Tabellen da. Formular im Browser abgeschickt, Bestätigungsmail kam bei `business@moinsen.dev` an. Vorschau des ersten Updates gesendet. Bei Resend: Domain verifiziert, Öffnungs- und Klickverfolgung aus.

**Nicht live geprüft:**
- Bestätigen und Abmelden mit echtem Link. Das Postfach-Werkzeug gibt Links aus Mails über die Gruppe `business@` nicht heraus (Signatur ersetzt), und auf Live-Systemen ist das Udis Schritt. Lokal im Browser ist beides geprüft.
- Der Cron-Lauf selbst: erster Lauf 12.11. um 03:17 UTC. Die Testadresse `business@moinsen.dev` steht unbestätigt in `abos`. Bestätigt Udi sie nicht, muss sie nach dem Lauf am 19.11. weg sein (Nachweis für den Löschlauf).

**Offen:**
1. Erstes Update an alle: nach Durchsicht der Vorschau `secretariat run kontor -- node scripts/update-senden.mjs 2026-11-10 --senden`. Aktuell 0 Empfänger.
2. Sitemap und robots.txt fehlen (siehe unten).

**Lokal testen:** `wrangler d1 migrations apply kontor --local --persist-to <ordner>`, dann `wrangler dev --port 8790 --var MAILS:konsole --persist-to <ordner>` (für den Löschlauf zusätzlich `--test-scheduled`, Auslöser `/cdn-cgi/handler/scheduled?cron=17+3+*+*+*`). Der Bestätigungslink steht in der Konsole und zeigt wegen der Route auf `http://kontor.moinsen.dev/…`: Host von Hand auf `localhost:8790` ändern.

**Tests:** 41 grün, drei davon schlagen gegen den Abo-Code vom 10.11. fehl.

## Sichtbarkeit (Quelle: Ideenkompass, „ASO, SEO und GEO - Übersicht“)

| Punkt | Seite | Status |
|---|---|---|
| Eigener Titel, Beschreibung, hreflang | Neuigkeiten | geprüft (Test) |
| RSS wohlgeformt, beide Sprachen | Feeds | geprüft (live, xmllint) |
| Aussagen gegen Produkt: Schwellen 1.000 / 25 / 500 € / 7, Livegang 10.11. | erste Neuigkeit | geprüft |
| Öffentliche Fassung ausgeliefert | Neuigkeiten, Feeds | geprüft (200), Crawling und Indexierung offen |
| Sitemap, robots.txt | ganze Website | fehlen (404), Wirkung offen, nicht Teil dieses Auftrags |
