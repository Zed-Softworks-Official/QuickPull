import { eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

import { db } from '~/server/db'
import { collections } from '~/server/db/schema'

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
