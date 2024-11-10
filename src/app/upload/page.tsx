import { Suspense } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'

import { Separator } from '~/components/ui/separator'
import { CollectionForm } from './form'

export default function UploadPage() {
    return (
        <div className="flex flex-col gap-5 w-full max-w-xl mx-auto">
            <h1 className="text-2xl font-bold">Upload</h1>
            <Separator />
            <Suspense fallback={<div>Loading...</div>}>
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

    return (
        <CollectionForm account_type={user.privateMetadata.account_type as AccountType} />
    )
}
