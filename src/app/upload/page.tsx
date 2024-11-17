import { Suspense } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'

import { Separator } from '~/components/ui/separator'
import { CollectionForm } from './form'
import { get_user_by_id_cache } from '~/server/db/query'
import { Card, CardHeader } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

export default function UploadPage() {
    return (
        <div className="flex flex-col gap-5 w-full max-w-xl mx-auto container">
            <h1 className="text-2xl font-bold">Upload</h1>
            <Separator />
            <Suspense fallback={<UploadFormSkeleton />}>
                <UploadForm />
            </Suspense>
        </div>
    )
}

async function UploadForm() {
    const user = await currentUser()

    if (!user) {
        return <RedirectToSignIn />
    }

    const db_user = await get_user_by_id_cache(user.id)
    if (!db_user) {
        return <div>User not found</div>
    }

    return <CollectionForm account_type={db_user.account_type} />
}

function UploadFormSkeleton() {
    return (
        <div className="flex flex-col gap-5">
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-24 w-full" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Card>
                    <CardHeader className="flex flex-col gap-5 items-center justify-center h-40">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                </Card>
            </div>

            <Skeleton className="h-10 w-full" />
        </div>
    )
}
