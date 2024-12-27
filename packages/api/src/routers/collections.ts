import { createId } from '@paralleldrive/cuid2'
import { UTApi } from 'uploadthing/server'
import { z } from 'zod'

import { eq } from '@quickpull/db'
import { collections } from '@quickpull/db/schema'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

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
                await ctx.db.insert(collections).values({
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
        }),

    get_collection_metadata: publicProcedure
        .input(
            z.object({
                collection_id: z.string(),
            })
        )
        .query(async ({ input, ctx }) => {
            return await ctx.db.query.collections.findFirst({
                where: eq(collections.id, input.collection_id),
            })
        }),

    get_collection_by_id: protectedProcedure
        .input(z.object({ collection_id: z.string() }))
        .query(async ({ input, ctx }) => {
            return await ctx.db.query.collections.findFirst({
                where: eq(collections.id, input.collection_id),
            })
        }),

    get_collections: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.collections.findMany({
            where: eq(collections.user_id, ctx.user.id),
        })
    }),

    get_collections_by_user_id: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return await ctx.db.query.collections.findMany({
                where: eq(collections.user_id, input),
            })
        }),

    delete_collection: protectedProcedure
        .input(z.object({ collection_id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const collection = await ctx.db.query.collections.findFirst({
                where: eq(collections.id, input.collection_id),
            })

            if (collection?.user_id !== ctx.user.id) {
                return false
            }
            const utapi = new UTApi()
            const item_keys = collection.items.map((item) => item.ut_key)

            const ut_deletion = utapi.deleteFiles(item_keys)
            const db_deletion = ctx.db
                .delete(collections)
                .where(eq(collections.id, input.collection_id))

            await Promise.all([ut_deletion, db_deletion])

            return true
        }),
})
