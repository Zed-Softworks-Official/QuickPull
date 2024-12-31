import { createRouteHandler } from 'uploadthing/next'

import { quickPullFileRouter } from './core'

export const { GET, POST } = createRouteHandler({
    router: quickPullFileRouter,
})
