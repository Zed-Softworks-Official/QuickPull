import { useAuth } from '@clerk/clerk-expo'
import { createRouteHandler } from 'uploadthing/server'

import { createFileRouter } from '@quickpull/uploadthing'

export const quickpullFileRouter = createFileRouter(() => {
    const { userId } = useAuth()

    if (!userId) {
        throw new Error('User not found')
    }

    return { userId }
})

const handlers = createRouteHandler({
    router: quickpullFileRouter,
})

export { handlers as GET, handlers as POST }
