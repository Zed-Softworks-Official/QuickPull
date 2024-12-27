'use client'

import Image from 'next/image'
import { notFound } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

import { api } from '~/trpc/react'
import { DownloadButton, KebabMenu } from './action-buttons'

export function Display(props: { collection_id: string }) {
    const { data: collection, isLoading } = api.collections.get_collection_by_id.useQuery(
        {
            collection_id: props.collection_id,
        }
    )

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {collection?.items.map((item) => (
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
    )
}

export function Heading(props: { collection_id: string }) {
    const { user, isLoaded } = useUser()
    const { data: collection, isLoading } = api.collections.get_collection_by_id.useQuery(
        {
            collection_id: props.collection_id,
        }
    )

    if (isLoading || !isLoaded) {
        return <div>Loading...</div>
    }

    if (!collection) {
        return notFound()
    }

    return (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{collection.name}</h1>
                <p className="text-sm text-muted-foreground">{collection.description}</p>
            </div>
            <div className="flex items-center justify-end gap-5">
                <DownloadButton collection={collection} />
                {user?.id === collection.user_id && <KebabMenu collection={collection} />}
            </div>
        </div>
    )
}
