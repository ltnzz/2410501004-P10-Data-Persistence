import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function NoteList({ onSelectNote, onCreateNote }) {
    const [notes, setNotes] = useState([]);
    const [query, setQuery] = useState([]);

    const loadNotes = async (search = '') => {
        try {
            const db = await SQLite.openDatabaseAsync('app.db');

            let results = [];

            if (search.trim()) {
                const keyword = `%${search}%`;

                results = await db.getAllAsync(
                    `
                    SELECT * FROM notes
                    WHERE title LIKE ?
                    OR content LIKE ?
                    ORDER BY updated_at DESC
                    `,
                    [keyword, keyword],
                );
            } else {
                results = await db.getAllAsync(
                    `
                    SELECT * FROM notes
                    ORDER BY updated_at DESC
                    `,
                );
            }

            setNotes(results);
        } catch (err) {
            console.log('Load notes error:', err);
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const handleSearch = (text) => {
        setQuery(text);
        loadNotes(text);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.noteCard, { borderLeftColor: item.color || '#4f46e5' }]}
            onPress={() => onSelectNote(item.id)}
        >
            <Text style={styles.noteTitle} numberOfLines={1}>
                {item.title}
            </Text>

            <Text style={styles.noteContent} numberOfLines={2}>
                {item.content}
            </Text>

            <View style={styles.noteFooter}>
                <Text style={styles.noteDate}>
                    {new Date(item.updated_at).toLocaleDateString('id-ID')}
                </Text>

                {item.is_synced === 0 && <Text style={styles.unsyncedBadge}>Belum tersinkron</Text>}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Catatan Saya</Text>

            <TextInput
                style={styles.searchInput}
                placeholder="Cari catatan..."
                value={query}
                onChangeText={handleSearch}
            />

            {notes.length === 0 ? (
                <Text style={styles.emptyText}>Belum ada catatan. Buat sekarang!</Text>
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <TouchableOpacity style={styles.fab} onPress={onCreateNote}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    heading: {
        fontSize: 24,
        fontWeight: '700',
        marginHorizontal: 16,
        marginBottom: 12,
    },

    searchInput: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        fontSize: 15,
    },

    list: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },

    noteCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 5,

        elevation: 2,

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    noteTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
        color: '#111827',
    },

    noteContent: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },

    noteFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        alignItems: 'center',
    },

    noteDate: {
        fontSize: 12,
        color: '#9ca3af',
    },

    unsyncedBadge: {
        fontSize: 11,
        color: '#d97706',
        backgroundColor: '#fef3c7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        overflow: 'hidden',
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 80,
        color: '#9ca3af',
        fontSize: 15,
    },

    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 999,
        backgroundColor: '#4f46e5',

        alignItems: 'center',
        justifyContent: 'center',

        elevation: 5,

        shadowColor: '#4f46e5',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },

    fabText: {
        color: '#fff',
        fontSize: 30,
        lineHeight: 32,
        fontWeight: '300',
    },
});
