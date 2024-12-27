import '@bacons/text-decoder/install'

import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Slot, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ClerkLoaded, ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo'

import { tokenCache } from '~/utils/secure-store'

import '../styles.css'

import { env } from '~/env'
import { TRPCProvider } from '~/utils/api'

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ClerkProvider
                tokenCache={{
                    getToken: tokenCache.getClerkToken,
                    saveToken: tokenCache.saveToken,
                }}
                publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
            >
                <ClerkLoaded>
                    <TRPCProvider>
                        <Slot />
                    </TRPCProvider>
                </ClerkLoaded>
            </ClerkProvider>
        </SafeAreaProvider>
    )
}

export function Layout() {
    return (
        <View className="flex-1 bg-background">
            <Stack
                screenOptions={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: '#09090B',
                    },
                    contentStyle: {
                        backgroundColor: '#09090B',
                    },
                }}
            >
                <SignedIn>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </SignedIn>
                <SignedOut>
                    <Stack.Screen
                        name="sign-in"
                        options={{
                            headerShown: false,
                            presentation: 'modal',
                            animation: 'slide_from_bottom',
                        }}
                    />
                </SignedOut>
            </Stack>

            <StatusBar style="light" />
        </View>
    )
}
