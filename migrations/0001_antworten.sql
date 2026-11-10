-- One row per submitted survey. No IP, no e-mail, no cookies: answers are anonymous.
CREATE TABLE antworten (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  erstellt_am   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  nutzung       TEXT    NOT NULL,           -- single choice
  rolle         TEXT,                       -- single choice, optional
  land          TEXT,                       -- single choice, optional
  stoert        TEXT    NOT NULL,           -- JSON array of choice keys
  gebracht      TEXT    NOT NULL,           -- JSON array of choice keys
  besser_netz   TEXT,                       -- single choice: which network brought more
  wuensche      TEXT    NOT NULL,           -- JSON array of choice keys
  wechsel       TEXT    NOT NULL,           -- single choice
  mitmachen     TEXT    NOT NULL,           -- JSON array of choice keys
  freitext_stoert  TEXT,                    -- never published, max 1000 chars
  freitext_wunsch  TEXT                     -- never published, max 1000 chars
);

CREATE INDEX antworten_erstellt ON antworten (erstellt_am);
