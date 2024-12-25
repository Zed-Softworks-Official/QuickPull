import { clerkClient } from '@clerk/nextjs/server'

import { eq } from '@quickpull/db'
import { db } from '@quickpull/db/client'
import { users } from '@quickpull/db/schema'

import { stripe } from '.'

export async function create_stripe_customer(user_id: string) {
    const clerk_client = await clerkClient()
    const user = await clerk_client.users.getUser(user_id)

    const customer = await stripe.customers.create({
        name: user.firstName + ' ' + user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
    })

    await db
        .update(users)
        .set({ customer_id: customer.id })
        .where(eq(users.clerk_id, user_id))

    return customer
}
