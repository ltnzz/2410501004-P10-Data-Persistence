import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app.db');

export default function NoteDetail({ noteId, onEdit, onBack }) {
    const note = db.getFirstSync('SELECT title, content, tags, color, is_synced FROM notes WHERE id = ?', [noteId]);

    if (!note) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Catatan tidak ditemukan.</Text>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.backLink}>← Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const tags = JSON.parse(note.tags || '[]');

    const handleDelete = () => {
        Alert.alert('Hapus Catatan', 'Yakin ingin menghapus catatan ini?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Hapus',
                style: 'destructive',
                onPress: () => {
                    db.runSync('DELETE FROM notes WHERE id = ?', [noteId]);
                    onBack();
                },
            },
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.backLink}>← Kembali</Text>
                </TouchableOpacity>
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(note.id)}>
                        <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                        <Text style={styles.deleteBtnText}>Hapus</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.colorBar, { backgroundColor: note.color || '#4f46e5' }]} />

            <Text style={styles.title}>{note.title}</Text>

            {tags.length > 0 && (
                <View style={styles.tagsRow}>
                    {tags.map((tag, i) => (
                        <View key={i} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}

            <Text style={styles.body}>{note.content}</Text>

            <View style={styles.meta}>
                <Text style={styles.metaText}>
                    Dibuat: {new Date(note.created_at).toLocaleString('id-ID')}
                </Text>
                <Text style={styles.metaText}>
                    Diperbarui: {new Date(note.updated_at).toLocaleString('id-ID')}
                </Text>
                <Text style={[styles.metaText, note.is_synced ? styles.synced : styles.unsynced]}>
                    {note.is_synced ? '✅ Tersinkron' : '⏳ Belum tersinkron'}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    content: { padding: 20 },
    errorText: { fontSize: 16, color: '#999', marginTop: 40, textAlign: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    backLink: { fontSize: 15, color: '#4f46e5' },
    actions: { flexDirection: 'row', gap: 10 },
    editBtn: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
    },
    editBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    deleteBtn: {
        backgroundColor: '#fef2f2',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fca5a5',
    },
    deleteBtnText: { color: '#dc2626', fontSize: 14, fontWeight: '600' },
    colorBar: { height: 4, borderRadius: 2, marginBottom: 16 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 10, color: '#1a1a1a' },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
    tag: {
        backgroundColor: '#ede9fe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    tagText: { fontSize: 12, color: '#6d28d9' },
    body: { fontSize: 16, color: '#444', lineHeight: 26, marginBottom: 24 },
    meta: { borderTopWidth: 1, borderColor: '#e5e7eb', paddingTop: 14, gap: 4 },
    metaText: { fontSize: 12, color: '#9ca3af' },
    synced: { color: '#16a34a' },
    unsynced: { color: '#d97706' },
});
