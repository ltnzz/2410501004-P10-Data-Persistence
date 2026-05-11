import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('username', 'Andi');

await AsyncStorage.setItem(
    'user',
    JSON.stringify({
        name: 'Andi Pratama',
        age: 21,
        email: 'andi@email.com',
    }),
);

const name = await AsyncStorage.getItem('username');
const userStr = await AsyncStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

await AsyncStorage.removeItem('username');

await AsyncStorage.clear();

const keys = await AsyncStorage.getAllKeys();

await AsyncStorage.multiSet([
    ['key1', 'value1'],
    ['key2', 'value2'],
]);

const results = await AsyncStorage.multiGet(['key1', 'key2']);
