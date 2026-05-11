import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('auth_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
await SecureStore.setItemAsync('user_password', 'hashed_password_here');

const token = await SecureStore.getItemAsync('auth_token');
if (token !== null) {
    console.log('Token found:', token);
}

await SecureStore.deleteItemAsync('auth_token');
