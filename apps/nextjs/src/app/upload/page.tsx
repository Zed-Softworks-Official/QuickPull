import { Suspense } from 'react'
import { RedirectToSignIn } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'

import { Card, CardHeader } from '@quickpull/ui/components/card'
import { Separator } from '@quickpull/ui/components/separator'
import { Skeleton } from '@quickpull/ui/components/skeleton'

import { api } from '~/trpc/server'
import { CollectionForm } from './form'

export default function UploadPage() {
    return (
        <div className="container mx-auto flex w-full max-w-xl flex-col gap-5 px-5">
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

    const db_user = await api.users.get_user_by_id(user.id)

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
                    <CardHeader className="flex h-40 flex-col items-center justify-center gap-5">
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
