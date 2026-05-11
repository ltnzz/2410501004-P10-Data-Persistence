import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const storage = new MMKV();

storage.set('user.name', 'Andi Pratama');
storage.set('user.age', 21);
storage.set('isLoggedIn', true);
storage.set('settings', JSON.stringify({ theme: 'dark', fontSize: 16 }));

const name = storage.getString('user.name'); 
const age = storage.getNumber('user.age'); 
const isLogin = storage.getBoolean('isLoggedIn');

const secureStorage = new MMKV({
    id: 'secure-storage',
    encryptionKey: 'akjsbakdnajkdkwdka',
});

storage.delete('user.name');
storage.clearAll();

const mmkvStorage = {
    setItem: (name, value) => storage.set(name, value),
    getItem: (name) => storage.getString(name) ?? null,
    removeItem: (name) => storage.delete(name),
};

const useAppStore = create(
    persist(
        (set) => ({
            theme: 'light',
            fontSize: 16,
            setTheme: (theme) => set({ theme }),
            setFontSize: (size) => set({ fontSize: size }),
        }),
        {
            name: 'app-settings',
            storage: createJSONStorage(() => mmkvStorage),
        },
    ),
);

export { storage, secureStorage, useAppStore };
