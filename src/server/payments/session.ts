import { clerkClient } from '@clerk/nextjs/server'

import { stripe } from './index'
import { env } from '~/env'
import { create_stripe_customer } from './customer'

export async function create_checkout_session(user_id: string) {
    const clerk_client = await clerkClient()
    let customer_id = await clerk_client.users
        .getUser(user_id)
        .then((user) => user.privateMetadata.customer_id as string | undefined)

    if (!customer_id) {
        const customer = await create_stripe_customer(user_id)
        customer_id = customer.id
    }

    return await stripe.checkout.sessions.create({
        success_url: `${env.NEXT_PUBLIC_URL}/payments/success`,
        customer: customer_id,
        line_items: [
            {
                price: `price_1QJZRYEtbntcN0k30TjhXRzY`,
                quantity: 1,
            },
        ],
        mode: 'subscription',
    })
}
