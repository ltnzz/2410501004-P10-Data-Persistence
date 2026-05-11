import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useNetworkStatus from '../hooks/use.network';
import { Wifi, WifiOff } from 'lucide-react-native';

export default function OfflineBanner() {
    const { isConnected, isInternetReachable } = useNetworkStatus();

    const [visible, setVisible] = useState(false);

    const slideAnim = useRef(new Animated.Value(100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();

    const isOffline = !isConnected || !isInternetReachable;

    useEffect(() => {
        let timeout;

        if (isOffline) {
            setVisible(true);

            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            timeout = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(slideAnim, {
                        toValue: 120,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => setVisible(false));
            }, 2000);
        }

        return () => clearTimeout(timeout);
    }, [isOffline]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.banner,
                isOffline ? styles.offline : styles.online,
                {
                    bottom: insets.bottom + 16,
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={styles.content}>
                {isOffline ? <WifiOff size={18} color="#fff" /> : <Wifi size={18} color="#fff" />}

                <Text style={styles.text}>{isOffline ? 'Anda Offline' : 'Koneksi Terhubung Kembali'}</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 999,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    offline: {
        backgroundColor: '#ef4444',
    },
    online: {
        backgroundColor: '#22c55e',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
});
