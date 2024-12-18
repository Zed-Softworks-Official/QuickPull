import { notFound } from 'next/navigation'
import Image from 'next/image'
import { currentUser } from '@clerk/nextjs/server'

import { DownloadButton, KebabMenu } from './action-buttons'
import { get_collection_by_id } from '~/server/db/query'

export async function generateMetadata(props: {
    params: Promise<{ collection_id: string }>
}) {
    const params = await props.params
    const collection = await get_collection_by_id(params.collection_id)

    if (!collection) {
        return {}
    }

    return {
        title: `QuickPull | ${collection.name}`,
        description: `Download ${collection.items.length} items from ${collection.name} on QuickPull`,
        openGraph: {
            title: `QuickPull | ${collection.name}`,
            description: `Download ${collection.items.length} items from ${collection.name} on QuickPull`,
            images: [collection.items[0]?.url],
        },
        twitter: {
            title: `QuickPull | ${collection.name}`,
            description: `Download ${collection.items.length} items from ${collection.name} on QuickPull`,
            images: [collection.items[0]?.url],
        },
    }
}

export default async function CollectionPage(props: {
    params: Promise<{ collection_id: string }>
}) {
    const user = await currentUser()

    const params = await props.params
    const collection = await get_collection_by_id(params.collection_id)

    if (!collection) {
        return notFound()
    }

    return (
        <div className="flex flex-col gap-4 container mx-auto px-5">
            <div className="flex justify-between flex-col sm:flex-row gap-4 items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">{collection.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        {collection.description}
                    </p>
                </div>
                <div className="flex items-center gap-5 justify-end">
                    <DownloadButton collection={collection} />
                    {user?.id === collection.user_id && (
                        <KebabMenu collection={collection} />
                    )}
                </div>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {collection.items.map((item) => (
                    <div
                        key={item.ut_key}
                        className="relative mb-4 overflow-hidden rounded-md break-inside-avoid"
                    >
                        <Image
                            src={item.url}
                            alt={item.filename}
                            className="object-cover w-full transition-transform hover:scale-105"
                            width={500}
                            height={500}
                            quality={40}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
