import type { ConfigContext, ExpoConfig } from 'expo/config'
import { config } from 'dotenv'

config({ path: '../../.env' })

export default ({ config: defaultConfig }: ConfigContext): ExpoConfig => ({
    ...defaultConfig,
    name: 'quickpull',
    slug: 'quickpull',
    scheme: 'quickpull',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    newArchEnabled: true,
    userInterfaceStyle: 'dark',
    platforms: ['ios', 'android'],
    splash: {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#09090B',
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        bundleIdentifier: 'dev.zedsoftworks.quickpull',
        supportsTablet: true,
    },
    android: {
        package: 'dev.zedsoftworks.quickpull',
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#09090B',
        },
    },
    // extra: {
    //   eas: {
    //     projectId: "your-eas-project-id",
    //   },
    // },
    experiments: {
        tsconfigPaths: true,
        typedRoutes: true,
    },
    plugins: [
        'expo-router',
        [
            'expo-splash-screen',
            {
                image: './assets/images/splash-icon.png',
                imageWidth: 200,
                resizeMode: 'contain',
                backgroundColor: '#09090B',
            },
        ],
    ],
    extra: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
})
