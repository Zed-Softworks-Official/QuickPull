import React from 'react'
import { Platform } from 'react-native'
import { Tabs } from 'expo-router'

import { HapticTab } from '~/components/haptic-tab'
import { IconSymbol } from '~/components/ui/icon-symbol'
import TabBarBackground from '~/components/ui/tab-bar-background'

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                        backgroundColor: '#0e0e11',
                        borderTopColor: '#09090B',
                    },
                    default: {
                        backgroundColor: '#09090B',
                    },
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="square.stack.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{
                    title: 'Upload',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="cloud.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="person.fill" color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
