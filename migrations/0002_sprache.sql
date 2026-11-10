-- Which page language the answer came from (de or en), to compare audiences.
ALTER TABLE antworten ADD COLUMN sprache TEXT NOT NULL DEFAULT 'de';
