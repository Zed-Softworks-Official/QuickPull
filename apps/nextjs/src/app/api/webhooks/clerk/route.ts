import type { WebhookEvent } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'

import { db } from '@quickpull/db/client'
import { users } from '@quickpull/db/schema'

import { env } from '~/env'

export async function POST(req: NextRequest) {
    const header_payload = await headers()
    const svix_id = header_payload.get('svix-id')
    const svix_timestamp = header_payload.get('svix-timestamp')
    const svix_signature = header_payload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
    }

    // Get the body
    const payload = (await req.json()) as unknown
    const body = JSON.stringify(payload)

    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET)

    let webhook_event: WebhookEvent
    try {
        webhook_event = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid Request:' + (error as Error).message },
            { status: 400 }
        )
    }

    const { type, data } = webhook_event
    switch (type) {
        case 'user.created':
            {
                try {
                    await db.insert(users).values({
                        clerk_id: data.id,
                        account_type: 'standard',
                    })
                } catch (error) {
                    console.error('Error inserting user into database', error)
                }
            }
            break
        default:
            console.log('Unhandled event type', type)
    }

    revalidateTag('users')

    return NextResponse.json({ message: 'Hello, world!' })
}
