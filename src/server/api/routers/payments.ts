import { unstable_cache } from 'next/cache'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { create_checkout_session, create_portal_session } from '~/server/payments'

const create_checkout_session_cache = unstable_cache(
    async (user_id: string) => {
        return await create_checkout_session(user_id)
    },
    ['checkout'],
    {
        revalidate: 3600,
        tags: ['checkout'],
    }
)

const create_portal_session_cache = unstable_cache(
    async (customer_id: string) => {
        return await create_portal_session(customer_id)
    },
    ['portal']
)

export const paymentsRouter = createTRPCRouter({
    create_checkout_session: protectedProcedure.query(async ({ ctx }) => {
        return await create_checkout_session_cache(ctx.user.id)
    }),

    create_portal_session: protectedProcedure.query(async ({ ctx }) => {
        return await create_portal_session_cache(
            ctx.user.privateMetadata.customer_id as string
        )
    }),
})
