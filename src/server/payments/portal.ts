import { stripe } from '.'

export async function create_portal_session(customer_id: string) {
    return await stripe.billingPortal.sessions.create({
        customer: customer_id,
    })
}
