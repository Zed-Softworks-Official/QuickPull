import { get_user_by_id_cache } from '../db/query'

import { stripe } from './index'
import { env } from '~/env'
import { create_stripe_customer } from './customer'

export async function create_checkout_session(user_id: string) {
    const db_user = await get_user_by_id_cache(user_id)
    let customer_id = db_user?.customer_id

    if (!customer_id) {
        const customer = await create_stripe_customer(user_id)
        customer_id = customer.id
    }

    return await stripe.checkout.sessions.create({
        success_url: `${env.NEXT_PUBLIC_URL}/payments/success`,
        customer: customer_id,
        metadata: {
            user_id,
        },
        line_items: [
            {
                price:
                    env.NODE_ENV === 'production'
                        ? 'price_1QJoVYEtbntcN0k3DEJPDf1Y'
                        : 'price_1QJZRYEtbntcN0k30TjhXRzY',
                quantity: 1,
            },
        ],
        mode: 'subscription',
    })
}
