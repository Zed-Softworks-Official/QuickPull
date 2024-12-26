import '@bacons/text-decoder/install'

import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import '../styles.css'

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-background">
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#09090B',
                        },
                        contentStyle: {
                            backgroundColor: '#09090B',
                        },
                    }}
                >
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>

                <StatusBar style="light" />
            </View>
        </SafeAreaProvider>
    )
}
