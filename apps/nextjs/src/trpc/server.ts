import 'server-only'

import { cache } from 'react'
import { headers } from 'next/headers'
import { auth } from '@clerk/nextjs/server'
import { createHydrationHelpers } from '@trpc/react-query/rsc'

import type { AppRouter } from '@quickpull/api'
import { createCaller, createTRPCContext } from '@quickpull/api'

import { createQueryClient } from './query-client'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
    const heads = new Headers(await headers())
    heads.set('x-trpc-source', 'rsc')

    const auth_data = await auth()

    return createTRPCContext({
        headers: heads,
        auth: auth_data,
    })
})

const getQueryClient = cache(createQueryClient)
const caller = createCaller(createContext)

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
    caller,
    getQueryClient
)
