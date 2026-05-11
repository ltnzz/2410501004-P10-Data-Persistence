export const CREATE_NOTES_TABLE = `
  CREATE TABLE IF NOT EXISTS notes (
    id          TEXT    PRIMARY KEY,
    title       TEXT    NOT NULL,
    content     TEXT    DEFAULT '',
    tags        TEXT    DEFAULT '[]',
    color       TEXT    DEFAULT '#FFFFFF',
    is_synced   INTEGER DEFAULT 0,
    created_at  INTEGER NOT NULL,
    updated_at  INTEGER NOT NULL
  );
`;

export const CREATE_NOTES_INDEXES = [
    `CREATE INDEX IF NOT EXISTS idx_notes_updated ON notes(updated_at DESC);`,
    `CREATE INDEX IF NOT EXISTS idx_notes_unsynced ON notes(is_synced) WHERE is_synced = 0;`,
];
