import { InferSelectModel } from '@quickpull/db'
import { users } from '@quickpull/db/schema'

import { create_stripe_customer } from './customer'
import { stripe } from './index'

export async function create_checkout_session(
    user_id: string,
    user: InferSelectModel<typeof users>
) {
    let customer_id = user?.customer_id

    if (!customer_id) {
        const customer = await create_stripe_customer(user_id)
        customer_id = customer.id
    }

    return await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_URL}/payments/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
        customer: customer_id,
        metadata: {
            user_id,
        },
        line_items: [
            {
                price:
                    process.env.NODE_ENV === 'production'
                        ? 'price_1QJoVYEtbntcN0k3DEJPDf1Y'
                        : 'price_1QJZRYEtbntcN0k30TjhXRzY',
                quantity: 1,
            },
        ],
        mode: 'subscription',
    })
}
