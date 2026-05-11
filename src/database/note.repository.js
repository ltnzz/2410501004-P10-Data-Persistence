import db from './schema';

const insertNote = (title, content) => {
    const stmt = db.prepareSync(
        'INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)',
    );
    const now = Date.now();
    const result = stmt.executeSync([title, content, now, now]);
    stmt.finalizeSync();
    return result.lastInsertRowId;
};

const getAllNotes = () => {
    return db.getAllSync('SELECT * FROM notes ORDER BY updated_at DESC');
};

const getNoteById = (id) => {
    return db.getFirstSync('SELECT * FROM notes WHERE id = ?', [id]);
};

const updateNote = (id, title, content) => {
    db.runSync('UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?', [
        title,
        content,
        Date.now(),
        id,
    ]);
};

const deleteNote = (id) => {
    db.runSync('DELETE FROM notes WHERE id = ?', [id]);
};

db.withTransactionSync(() => {
    db.runSync('INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)', [
        'Note 1',
        'Content 1',
        Date.now(),
        Date.now(),
    ]);
    db.runSync('INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)', [
        'Note 2',
        'Content 2',
        Date.now(),
        Date.now(),
    ]);
});

export { insertNote, getAllNotes, getNoteById, updateNote, deleteNote };
