# Kontor

**Alle ärgern sich über LinkedIn. Und alle bleiben. Warum?**

Kontor (Arbeitstitel) fragt, bevor jemand baut: Was stört Menschen an LinkedIn, was hat es ihnen wirklich gebracht, was müsste ein besseres Berufsnetz können, und würden sie wechseln? Die Seite zeigt die aktuelle Lage mit Quellen, eine anonyme Umfrage und die Ergebnisse live.

Falls daraus ein Netz entsteht, soll es offen und nicht gewinnorientiert sein.

## Lokal starten

```bash
pnpm db:local   # create the local D1 database
pnpm dev        # http://localhost:8790
pnpm test
```

Cloudflare Worker + static assets + D1. No runtime dependencies.

## Datenschutz

Keine Cookies, keine Dritt-Dienste, keine IP-Speicherung. Freitexte werden nie veröffentlicht. Details: `public/datenschutz.html`.

## Lizenz

AGPL-3.0-only. Ein Projekt von Ulrich Diedrichsen, Hamburg.
