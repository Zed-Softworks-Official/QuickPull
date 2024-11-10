import { notFound } from 'next/navigation'
import Image from 'next/image'

import { api } from '~/trpc/server'
import { DownloadButton, DeleteButton } from './action-buttons'

export default async function CollectionPage(props: {
    params: Promise<{ collection_id: string }>
}) {
    const params = await props.params
    const collection = await api.collections.get_collection_by_id({
        collection_id: params.collection_id,
    })

    if (!collection) {
        return notFound()
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between flex-col sm:flex-row gap-4 items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">{collection.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        {collection.description}
                    </p>
                </div>
                <div className="flex items-center gap-5 justify-end">
                    <DownloadButton collection={collection} />
                    <DeleteButton collection={collection} />
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
