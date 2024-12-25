import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { eq, InferSelectModel } from '@quickpull/db'
import { users } from '@quickpull/db/schema'

import { get_redis_key } from '../cache'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const usersRouter = createTRPCRouter({
    get_user_by_id: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
        const cached_user = await ctx.redis.get(get_redis_key('users', input))

        if (cached_user) {
            return cached_user as InferSelectModel<typeof users>
        }

        const user = await ctx.db.query.users.findFirst({
            where: eq(users.clerk_id, input),
        })

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            })
        }

        await ctx.redis.set(get_redis_key('users', input), user, {
            ex: 3600,
        })

        return user
    }),
})
