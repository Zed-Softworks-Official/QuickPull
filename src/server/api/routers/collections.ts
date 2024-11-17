import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'
import { eq } from 'drizzle-orm'
import { UTApi } from 'uploadthing/server'

import { protectedProcedure, createTRPCRouter } from '~/server/api/trpc'
import { db } from '~/server/db'
import { collections } from '~/server/db/schema'

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
        }),

    get_collection: protectedProcedure.query(async ({ ctx }) => {
        console.log('Fetching collections')

        return await ctx.db.query.collections.findMany({
            where: eq(collections.user_id, ctx.user.id),
        })
    }),

    delete_collection: protectedProcedure
        .input(z.object({ collection_id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const collection = await db.query.collections.findFirst({
                where: eq(collections.id, input.collection_id),
            })

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

            return true
        }),
})
