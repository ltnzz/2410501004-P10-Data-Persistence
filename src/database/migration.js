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

export async function initDatabase() {
    const db = await SQLite.openDatabaseAsync('app.db');

    const savedVersion = parseInt((await AsyncStorage.getItem('DB_VERSION')) || '0');

    if (savedVersion < CURRENT_DB_VERSION) {
        await runMigrations(db, savedVersion, CURRENT_DB_VERSION);
        await AsyncStorage.setItem('DB_VERSION', String(CURRENT_DB_VERSION));
    }

    return db;
}
