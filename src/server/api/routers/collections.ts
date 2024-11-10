import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'

import { protectedProcedure, createTRPCRouter } from '~/server/api/trpc'
import { db } from '~/server/db'
import { collections } from '~/server/db/schema'

import { get_collection_by_id_cache, get_collections_cache } from '~/server/db/query'
import { revalidateTag } from 'next/cache'

export const collectionsRouter = createTRPCRouter({
    set_collection: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                description: z.string().optional(),
                items: z.array(
                    z.object({
                        url: z.string().url(),
                        ut_key: z.string(),
                    })
                ),
            })
        )
        .mutation(async ({ input, ctx }) => {
            try {
                await db.insert(collections).values({
                    id: createId(),
                    user_id: ctx.user.id,
                    name: input.name,
                    description: input.description,
                    items: input.items,
                    item_count: input.items.length,
                })
            } catch (e) {
                console.error(e)
            }

            revalidateTag('collections')
        }),

    get_collections: protectedProcedure.query(async ({ ctx }) => {
        const collections = await get_collections_cache(ctx.user.id)

        return collections
    }),

    get_collection_by_id: protectedProcedure
        .input(z.object({ collection_id: z.string() }))
        .query(async ({ input }) => {
            const collection = await get_collection_by_id_cache(input.collection_id)

            return collection
        }),
})
