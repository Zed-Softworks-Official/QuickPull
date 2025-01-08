import { generateReactNativeHelpers } from '@uploadthing/expo'

import type { QuickpullFileRouter } from '@quickpull/uploadthing'

import { env } from '~/env'

export const { useUploadThing } = generateReactNativeHelpers<QuickpullFileRouter>({
    url: `${env.NEXT_PUBLIC_URL}/api/uploadthing`,
})
