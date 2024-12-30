import '@bacons/text-decoder/install'

import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
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
                        <Layout />
                    </TRPCProvider>
                </ClerkLoaded>
            </ClerkProvider>
        </SafeAreaProvider>
    )
}

export function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: '#09090B',
                },
            }}
        >
            <SignedIn>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                    name="(modals)/collections/[collection_id]"
                    options={{
                        headerShown: true,
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                />
            </SignedIn>
            <SignedOut>
                <Stack.Screen
                    name="(modals)/sign-in"
                    options={{
                        headerShown: false,
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                />
            </SignedOut>
            <StatusBar style="light" />
        </Stack>
    )
}
