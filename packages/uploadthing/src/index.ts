import { createUploadthing, FileRouter } from 'uploadthing/server'
import { z } from 'zod'

import { AccountType } from '@quickpull/types'

export type AuthMiddlewareFnc = (
    req: Request,
    account_type: AccountType
) => Promise<{ userId: string }>

const f = createUploadthing({
    errorFormatter: (err) => {
        return {
            message: err.message,
            zodError: err.cause instanceof z.ZodError ? err.cause.flatten() : null,
        }
    },
})

export const createFileRouter = (auth_middleware: AuthMiddlewareFnc) => {
    return {
        standardUploader: f({
            image: { maxFileSize: '4MB', maxFileCount: 10 },
        })
            .middleware(({ req }) => auth_middleware(req, 'standard'))
            .onUploadComplete(({ metadata, file }) => {
                console.log('Upload Complete')

                console.log('file url', file.url)

                return { uploadedBy: metadata.userId }
            }),
        premiumUploader: f({
            image: { maxFileSize: '8MB', maxFileCount: 20 },
        })
            .middleware(({ req }) => auth_middleware(req, 'premium'))
            .onUploadComplete(({ metadata, file }) => {
                console.log('Upload Complete')

                console.log('file url', file.url)

                return { uploadedBy: metadata.userId }
            }),
    } satisfies FileRouter
}

export type QuickpullFileRouter = ReturnType<typeof createFileRouter>
