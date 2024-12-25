/* eslint-disable @typescript-eslint/only-throw-error */
import type { NextRequest } from 'next/server'
import type { FileRouter } from 'uploadthing/next'
import { getAuth } from '@clerk/nextjs/server'
import { createUploadthing } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { z } from 'zod'

import type { AccountType } from '@quickpull/types'
import { eq } from '@quickpull/db'
import { db } from '@quickpull/db/client'
import { users } from '@quickpull/db/schema'

const f = createUploadthing({
    errorFormatter: (err) => {
        return {
            message: err.message,
            zodError: err.cause instanceof z.ZodError ? err.cause.flatten() : null,
        }
    },
})

const auth_middleware = async (req: NextRequest, account_type: AccountType) => {
    const user = getAuth(req)

    if (!user.userId) {
        console.log('No User ID found in uploadthing middleware')
        throw new UploadThingError('Unauthorized')
    }

    const db_user = await db.query.users.findFirst({
        where: eq(users.clerk_id, user.userId),
    })

    if (!db_user) {
        console.log('User does not exist')
        throw new UploadThingError('User not found')
    }

    if ((db_user.account_type as AccountType) !== account_type) {
        console.log('Unauthorized Account Type')
        throw new UploadThingError('Unauthorized Account Type')
    }

    return { userId: user.userId }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    standardUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 10 } })
        // Set permissions and file types for this FileRoute
        .middleware(({ req }) => auth_middleware(req, 'standard'))
        .onUploadComplete(({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log('Upload complete for userId:', metadata.userId)

            console.log('file url', file.url)

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId }
        }),
    premiumUploader: f({ image: { maxFileSize: '8MB', maxFileCount: 20 } })
        .middleware(({ req }) => auth_middleware(req, 'premium'))
        .onUploadComplete(({ metadata, file }) => {
            console.log('Upload complete for userId:', metadata.userId)
            console.log('file url', file.url)
            return { uploadedBy: metadata.userId }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
