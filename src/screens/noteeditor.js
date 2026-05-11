import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app.db');

const COLOR_OPTIONS = [
    '#FFFFFF',
    '#FECACA',
    '#FDE68A',
    '#A7F3D0',
    '#BAE6FD',
    '#DDD6FE',
    '#FBCFE8',
    '#D1FAE5',
];

export default function NoteEditor({ noteId, onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [color, setColor] = useState('#FFFFFF');

    useEffect(() => {
        if (noteId) {
            const note = db.getFirstSync('SELECT * FROM notes WHERE id = ?', [noteId]);
            if (note) {
                setTitle(note.title);
                setContent(note.content);
                setTags(JSON.parse(note.tags || '[]').join(', '));
                setColor(note.color || '#FFFFFF');
            }
        }
    }, [noteId]);

    const handleSave = () => {
        if (!title.trim()) return;

        const parsedTags = JSON.stringify(
            tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
        );
        const now = Date.now();

        if (noteId) {
            db.runSync(
                'UPDATE notes SET title = ?, content = ?, tags = ?, color = ?, updated_at = ?, is_synced = 0 WHERE id = ?',
                [title.trim(), content.trim(), parsedTags, color, now, noteId],
            );
        } else {
            const id = now.toString();
            db.runSync(
                'INSERT INTO notes (id, title, content, tags, color, is_synced, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, ?, ?)',
                [id, title.trim(), content.trim(), parsedTags, color, now, now],
            );
        }

        onSave();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onCancel}>
                    <Text style={styles.cancelText}>Batal</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{noteId ? 'Edit Catatan' : 'Catatan Baru'}</Text>
                <TouchableOpacity onPress={handleSave} disabled={!title.trim()}>
                    <Text style={[styles.saveText, !title.trim() && styles.disabledText]}>
                        Simpan
                    </Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.titleInput}
                placeholder="Judul catatan"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
            />

            <TextInput
                style={styles.contentInput}
                placeholder="Tulis catatanmu di sini..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
            />

            <TextInput
                style={styles.tagsInput}
                placeholder="Tag (pisahkan dengan koma, contoh: kerja, penting)"
                value={tags}
                onChangeText={setTags}
            />

            <Text style={styles.colorLabel}>Warna Catatan</Text>
            <View style={styles.colorPicker}>
                {COLOR_OPTIONS.map((c) => (
                    <TouchableOpacity
                        key={c}
                        style={[
                            styles.colorOption,
                            { backgroundColor: c },
                            color === c && styles.colorOptionSelected,
                        ]}
                        onPress={() => setColor(c)}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    content: { padding: 20 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
    cancelText: { fontSize: 15, color: '#6b7280' },
    saveText: { fontSize: 15, color: '#4f46e5', fontWeight: '600' },
    disabledText: { color: '#c4b5fd' },
    titleInput: {
        fontSize: 20,
        fontWeight: '600',
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
        paddingBottom: 10,
        marginBottom: 16,
        color: '#1a1a1a',
    },
    contentInput: {
        fontSize: 16,
        minHeight: 200,
        lineHeight: 26,
        color: '#374151',
        marginBottom: 16,
    },
    tagsInput: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 12,
        fontSize: 14,
        color: '#374151',
        marginBottom: 20,
    },
    colorLabel: { fontSize: 14, color: '#6b7280', marginBottom: 10, fontWeight: '500' },
    colorPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    colorOption: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    colorOptionSelected: { borderWidth: 3, borderColor: '#4f46e5' },
});
