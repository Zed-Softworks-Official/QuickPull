import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'

import { publicProcedure, createTRPCRouter } from '~/server/api/trpc'
import { db } from '~/server/db'
import { collections } from '~/server/db/schema'

export const collectionsRouter = createTRPCRouter({
    set_collection: publicProcedure
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
        .mutation(async ({ input }) => {
            try {
                await db.insert(collections).values({
                    id: createId(),
                    name: input.name,
                    description: input.description,
                    items: input.items,
                })
            } catch (e) {
                console.error(e)
            }
        }),
})
