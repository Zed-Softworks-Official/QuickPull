import baseConfig from '@quickpull/eslint-config/base'
import reactConfig from '@quickpull/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
    {
        ignores: ['.expo/**', 'expo-plugins/**'],
    },
    ...baseConfig,
    ...reactConfig,
]
