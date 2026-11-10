-- E-mail updates with double opt-in. Only the address, times, consent version and language are stored.
CREATE TABLE abos (
  id               TEXT    PRIMARY KEY,
  email            TEXT    NOT NULL UNIQUE,
  status           TEXT    NOT NULL,           -- offen | bestaetigt
  token_hash       TEXT,                       -- SHA-256 of the confirmation token
  abmelde_token    TEXT    NOT NULL,           -- random; in every update mail for one-click removal
  sprache          TEXT    NOT NULL DEFAULT 'de',
  einwilligung     TEXT    NOT NULL,           -- version of the consent text
  angefragt_am     INTEGER NOT NULL,
  bestaetigt_am    INTEGER,
  mails            INTEGER NOT NULL DEFAULT 0,
  letzte_mail_am   INTEGER NOT NULL DEFAULT 0
);

-- Global caps for confirmation mails, without addresses.
CREATE TABLE abo_ereignisse (
  am    INTEGER NOT NULL,
  art   TEXT    NOT NULL
);
CREATE INDEX abo_ereignisse_am ON abo_ereignisse (am);

-- Which update went to which subscriber, so a resumed send never mails anyone twice.
CREATE TABLE versand (
  update_id   TEXT    NOT NULL,
  abo_id      TEXT    NOT NULL,
  gesendet_am INTEGER NOT NULL,
  PRIMARY KEY (update_id, abo_id)
);
