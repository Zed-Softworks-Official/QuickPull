import { clerkClient } from '@clerk/nextjs/server'
import { stripe } from '.'

export async function create_stripe_customer(user_id: string) {
    const clerk_client = await clerkClient()
    const user = await clerk_client.users.getUser(user_id)

    const customer = await stripe.customers.create({
        name: user.firstName + ' ' + user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
    })

    await clerk_client.users.updateUserMetadata(user_id, {
        privateMetadata: {
            customer_id: customer.id,
        },
    })

    return customer
}
