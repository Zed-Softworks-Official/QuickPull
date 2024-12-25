import type { NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { db } from '@quickpull/db/client'
import { users } from '@quickpull/db/schema'
import { stripe } from '@quickpull/payments'

import { env } from '~/env'

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature')
    const endpoint_secret = env.STRIPE_WEBHOOK_SECRET

    if (!sig || !endpoint_secret) {
        return NextResponse.json(
            { error: 'No stripe signature or endpoint secret' },
            { status: 400 }
        )
    }

    const payload = await req.text()

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpoint_secret)
    } catch (err) {
        console.error('Webhook Error:', err)
        return NextResponse.json(
            { error: 'Webhook Error: ' + (err as Error).message },
            { status: 400 }
        )
    }

    switch (event.type) {
        case 'checkout.session.completed':
            {
                const data = event.data.object
                const user_id = data.metadata?.user_id

                if (!user_id) {
                    console.log('No user id found in checkout session metadata')
                    break
                }

                try {
                    await db
                        .update(users)
                        .set({
                            account_type: 'premium',
                        })
                        .where(eq(users.clerk_id, user_id))
                } catch (err) {
                    console.error('Error updating user account type', err)
                }
            }
            break
        case 'customer.subscription.deleted':
            {
                const data = event.data.object
                const customer_id = data.customer as string

                const user = await db.query.users.findFirst({
                    where: eq(users.customer_id, customer_id),
                })

                if (!user) {
                    console.log('No user found with customer id', customer_id)
                    break
                }

                try {
                    await db
                        .update(users)
                        .set({
                            account_type: 'standard',
                        })
                        .where(eq(users.clerk_id, user.clerk_id))
                } catch (err) {
                    console.error('Error updating user account type', err)
                }
            }
            break
        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    revalidateTag('users')
    revalidateTag('portal')
    revalidateTag('checkout')

    return NextResponse.json({ status: 200 })
}
