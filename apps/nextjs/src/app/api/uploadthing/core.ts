import { NextRequest } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'

import { eq } from '@quickpull/db'
import { db } from '@quickpull/db/client'
import { users } from '@quickpull/db/schema'
import { createFileRouter } from '@quickpull/uploadthing'

export const quickPullFileRouter = createFileRouter(async (req, account_type) => {
    const auth = getAuth(req as NextRequest)

    if (!auth.userId) {
        throw new Error('Unauthorized')
    }

    const db_user = await db.query.users.findFirst({
        where: eq(users.clerk_id, auth.userId),
    })

    if (!db_user) {
        throw new Error('User not found')
    }

    if (db_user.account_type !== account_type) {
        throw new Error('Unauthorized account type')
    }

    return { userId: auth.userId }
})
