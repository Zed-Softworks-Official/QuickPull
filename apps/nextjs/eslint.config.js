import baseConfig, { restrictEnvAccess } from '@quickpull/eslint-config/base'
import nextjsConfig from '@quickpull/eslint-config/nextjs'
import reactConfig from '@quickpull/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
    {
        ignores: ['.next/**'],
    },
    ...baseConfig,
    ...reactConfig,
    ...nextjsConfig,
    ...restrictEnvAccess,
]
