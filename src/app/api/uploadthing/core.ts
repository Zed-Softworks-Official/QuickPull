/* eslint-disable @typescript-eslint/only-throw-error */
import { getAuth } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

import { get_user_by_id_cache } from '~/server/db/query'

const f = createUploadthing()

const auth_middleware = async (req: NextRequest, account_type: AccountType) => {
    const user = getAuth(req)

    if (!user?.userId) {
        console.log('No User ID found in uploadthing middleware')
        throw new UploadThingError('Unauthorized')
    }

    const db_user = await get_user_by_id_cache(user.userId)

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
    standardUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 5 } })
        // Set permissions and file types for this FileRoute
        .middleware(({ req }) => auth_middleware(req, 'standard'))
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log('Upload complete for userId:', metadata.userId)

            console.log('file url', file.url)

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId }
        }),
    premiumUploader: f({ image: { maxFileSize: '8MB', maxFileCount: 10 } })
        .middleware(({ req }) => auth_middleware(req, 'premium'))
        .onUploadComplete(({ metadata, file }) => {
            console.log('Upload complete for userId:', metadata.userId)
            console.log('file url', file.url)
            return { uploadedBy: metadata.userId }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
