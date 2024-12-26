/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Constants from 'expo-constants'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const extra = Constants.expoConfig?.extra ?? {}

export const env = createEnv({
    server: {},
    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: extra.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    clientPrefix: 'NEXT_PUBLIC_',
    emptyStringAsUndefined: true,
})
