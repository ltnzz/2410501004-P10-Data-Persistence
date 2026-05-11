import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { CREATE_NOTES_TABLE, CREATE_NOTES_INDEXES } from './schema';

const CURRENT_DB_VERSION = 1;

const migrations = {
    1: async (db) => {
        await db.execAsync(CREATE_NOTES_TABLE);

        for (const idx of CREATE_NOTES_INDEXES) {
            await db.execAsync(idx);
        }

        console.log('Migration v1: Created notes table');
    },
};

async function runMigrations(db, fromVersion, toVersion) {
    for (let v = fromVersion + 1; v <= toVersion; v++) {
        if (migrations[v]) {
            console.log(`Running migration v${v}...`);
            await migrations[v](db);
        }
    }
}

let db = null;

export const initDatabase = async () => {
    if (db) return db;

    db = await SQLite.openDatabaseAsync(
        'app.db'
    );

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            content TEXT DEFAULT '',
            tags TEXT DEFAULT '[]',
            color TEXT DEFAULT '#FFFFFF',
            is_synced BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    return db;
};

export const getDatabase = () => db;
