import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initDatabase } from './src/database/migration';
import NoteList from './src/screens/notelist';
import NoteDetail from './src/screens/notedetail';
import NoteEditor from './src/screens/noteeditor';
import OfflineBanner from './src/components/offline.banner';

export default function App() {
    const [screen, setScreen] = useState('list');
    const [selectedId, setSelectedId] = useState(null);
    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        const setup = async () => {
            try {
                await initDatabase();
                setDbReady(true);
            } catch (err) {
                console.log('DB init error:', err);
                setDbReady(false);
            }
        };

        setup();
    }, []);

    if (!dbReady) return null;

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <StatusBar style="auto" />
                <OfflineBanner />

                {screen === 'list' && (
                    <NoteList
                        onSelectNote={(id) => {
                            setSelectedId(id);
                            setScreen('detail');
                        }}
                        onCreateNote={() => {
                            setSelectedId(null);
                            setScreen('editor');
                        }}
                    />
                )}

                {screen === 'detail' && (
                    <NoteDetail
                        noteId={selectedId}
                        onEdit={(id) => {
                            setSelectedId(id);
                            setScreen('editor');
                        }}
                        onBack={() => setScreen('list')}
                    />
                )}

                {screen === 'editor' && (
                    <NoteEditor
                        noteId={selectedId}
                        onSave={() => setScreen('list')}
                        onCancel={() => setScreen(selectedId ? 'detail' : 'list')}
                    />
                )}
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: 48,
    },
});
