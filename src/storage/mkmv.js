import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const storage = new MMKV({
    id: 'note-app-storage',
    encryptionKey: 'akjjsbdakbriquwkdkad',
});

const mmkvStorage = {
    setItem: (name, value) => {
        storage.set(name, value);
    },

    getItem: (name) => {
        const value = storage.getString(name);
        return value ?? null;
    },

    removeItem: (name) => {
        storage.delete(name);
    },
};

const useAppStore = create(
    persist(
        (set, get) => ({
            theme: 'light',
            fontSize: 16,

            syncQueue: [],

            setTheme: (theme) => set({ theme }),

            setFontSize: (size) =>
                set({
                    fontSize: size,
                }),

            addToSyncQueue: (action) =>
                set((state) => ({
                    syncQueue: [...state.syncQueue, action],
                })),

            removeFromSyncQueue: (id) =>
                set((state) => ({
                    syncQueue: state.syncQueue.filter((item) => item.id !== id),
                })),

            clearSyncQueue: () =>
                set({
                    syncQueue: [],
                }),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => mmkvStorage),
        },
    ),
);

export { storage, useAppStore };
