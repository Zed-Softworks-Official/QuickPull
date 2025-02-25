/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env'

import type { NextConfig } from 'next'

const config = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                pathname: '/f/**',
                port: '',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/ingest/static/:path*',
                destination: 'https://us-assets.i.posthog.com/static/:path*',
            },
            {
                source: '/ingest/:path*',
                destination: 'https://us.i.posthog.com/:path*',
            },
        ]
    },

    transpilePackages: [
        '@quickpull/api',
        '@quickpull/db',
        '@quickpull/payments',
        '@quickpull/types',
        '@quickpull/ui',
        '@quickpull/validators',
    ],

    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
} satisfies NextConfig

export default config
