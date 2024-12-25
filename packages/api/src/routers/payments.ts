import { TRPCError } from '@trpc/server'

import { eq } from '@quickpull/db'
import { users } from '@quickpull/db/schema'
import { create_portal_session } from '@quickpull/payments/portal'
import { create_checkout_session } from '@quickpull/payments/session'

import { get_redis_key } from '../cache'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export interface SessionResponse {
    url: string | null
}

export const paymentsRouter = createTRPCRouter({
    create_checkout_session: protectedProcedure.query(async ({ ctx }) => {
        const redis_key = get_redis_key('payments', 'checkout', ctx.user.id)
        const cached_checkout_session = await ctx.redis.get(redis_key)

        if (cached_checkout_session) {
            return cached_checkout_session as SessionResponse
        }

        const db_user = await ctx.db.query.users.findFirst({
            where: eq(users.clerk_id, ctx.user.id),
        })

        if (!db_user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            })
        }

        const result: SessionResponse = {
            url: null,
        }

        if (db_user.account_type === 'premium') {
            await ctx.redis.set(redis_key, result, {
                ex: 3600,
            })

            return result
        }

        const checkout_session = await create_checkout_session(ctx.user.id, db_user)

        await ctx.redis.set(
            redis_key,
            { url: checkout_session.url },
            {
                ex: 3600,
            }
        )

        return { url: checkout_session.url }
    }),

    create_portal_session: protectedProcedure.query(async ({ ctx }) => {
        const redis_key = get_redis_key('payments', 'portal', ctx.user.id)
        const cached_portal_session = await ctx.redis.get(redis_key)

        if (cached_portal_session) {
            return cached_portal_session as SessionResponse
        }

        const db_user = await ctx.db.query.users.findFirst({
            where: eq(users.clerk_id, ctx.user.id),
        })

        const result: SessionResponse = {
            url: null,
        }

        if (!db_user?.customer_id) {
            await ctx.redis.set(redis_key, result, {
                ex: 3600,
            })

            return result
        }

        const portal_session = await create_portal_session(db_user.customer_id)

        await ctx.redis.set(
            redis_key,
            { url: portal_session.url },
            {
                ex: 3600,
            }
        )

        return { url: portal_session.url }
    }),
})
