import '@bacons/text-decoder/install'

import { View } from 'react-native'
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
                                    <Stack.Screen
                                        name="(tabs)"
                                        options={{ headerShown: false }}
                                    />
                                </SignedIn>
                                <SignedOut>
                                    <Stack.Screen
                                        name="sign-in"
                                        options={{ headerShown: false }}
                                    />
                                </SignedOut>
                                <Stack.Screen name="+not-found" />
                            </Stack>

                            <StatusBar style="light" />
                        </View>
                    </TRPCProvider>
                </ClerkLoaded>
            </ClerkProvider>
        </SafeAreaProvider>
    )
}
