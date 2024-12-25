import Image from 'next/image'
import { notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

import { api } from '~/trpc/server'
import { DownloadButton, KebabMenu } from './action-buttons'

export async function generateMetadata(props: {
    params: Promise<{ collection_id: string }>
}) {
    const params = await props.params
    const collection = await api.collections.get_collection_by_id({
        collection_id: params.collection_id,
    })

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
    const collection = await api.collections.get_collection_by_id({
        collection_id: params.collection_id,
    })

    if (!collection) {
        return notFound()
    }

    return (
        <div className="container mx-auto flex flex-col gap-4 px-5">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">{collection.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        {collection.description}
                    </p>
                </div>
                <div className="flex items-center justify-end gap-5">
                    <DownloadButton collection={collection} />
                    {user?.id === collection.user_id && (
                        <KebabMenu collection={collection} />
                    )}
                </div>
            </div>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {collection.items.map((item) => (
                    <div
                        key={item.ut_key}
                        className="relative mb-4 break-inside-avoid overflow-hidden rounded-md"
                    >
                        <Image
                            src={item.url}
                            alt={item.filename}
                            className="w-full object-cover transition-transform hover:scale-105"
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
