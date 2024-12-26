import React from 'react'
import { Platform } from 'react-native'
import { Tabs } from 'expo-router'

import { HapticTab } from '~/components/haptic-tab'
import { IconSymbol } from '~/components/ui/icon-symbol'
import BlurTabBarBackground from '~/components/ui/tab-bar-background-ios'

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: BlurTabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{
                    title: 'Upload',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="paperplane.fill" color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
