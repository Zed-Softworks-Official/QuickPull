import { eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

import { db } from '~/server/db'
import { collections, users } from '~/server/db/schema'

export const get_collections_cache = unstable_cache(
    async (user_id: string) => {
        return await db.query.collections.findMany({
            where: eq(collections.user_id, user_id),
        })
    },
    ['collections'],
    {
        tags: ['collections'],
        revalidate: 3600,
    }
)

export const get_collection_by_id_cache = unstable_cache(
    async (collection_id: string) => {
        return await db.query.collections.findFirst({
            where: eq(collections.id, collection_id),
        })
    },
    ['collections_id'],
    {
        tags: ['collections_id'],
        revalidate: 3600,
    }
)

export const get_user_by_id_cache = unstable_cache(
    async (clerk_id: string) => {
        return await db.query.users.findFirst({
            where: eq(users.clerk_id, clerk_id),
        })
    },
    ['users'],
    {
        tags: ['users'],
        revalidate: 3600,
    }
)

export const get_user_by_customer_id_cache = unstable_cache(
    async (customer_id: string) => {
        return await db.query.users.findFirst({
            where: eq(users.customer_id, customer_id),
        })
    },
    ['users'],
    {
        tags: ['users'],
        revalidate: 3600,
    }
)
