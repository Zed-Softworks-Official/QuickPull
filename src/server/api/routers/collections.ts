import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'
import { revalidatePath, revalidateTag } from 'next/cache'
import { eq } from 'drizzle-orm'

import { protectedProcedure, createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { db } from '~/server/db'
import { collections } from '~/server/db/schema'

import { get_collection_by_id_cache, get_collections_cache } from '~/server/db/query'
import { UTApi } from 'uploadthing/server'

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
                        filename: z.string(),
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
            revalidatePath('/')
        }),

    get_collections: protectedProcedure.query(async ({ ctx }) => {
        const collections = await get_collections_cache(ctx.user.id)

        return collections
    }),

    get_collection_by_id: publicProcedure
        .input(z.object({ collection_id: z.string() }))
        .query(async ({ input }) => {
            const collection = await get_collection_by_id_cache(input.collection_id)

            return collection
        }),

    delete_collection: protectedProcedure
        .input(z.object({ collection_id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const collection = await get_collection_by_id_cache(input.collection_id)

            if (collection?.user_id !== ctx.user.id) {
                return false
            }
            const utapi = new UTApi()
            const item_keys = collection?.items.map((item) => item.ut_key)

            const ut_deletion = utapi.deleteFiles(item_keys)
            const db_deletion = db
                .delete(collections)
                .where(eq(collections.id, input.collection_id))

            await Promise.all([ut_deletion, db_deletion])

            revalidateTag('collections')
            revalidatePath('/')

            return true
        }),
})
