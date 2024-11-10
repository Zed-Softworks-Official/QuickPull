import { Download } from 'lucide-react'
import { notFound } from 'next/navigation'
import Image from 'next/image'

import { Button } from '~/components/ui/button'
import { api } from '~/trpc/server'

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
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">{collection.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        {collection.description}
                    </p>
                </div>
                <Button>
                    <Download className="w-4 h-4" />
                    Download
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {collection.items.map((item) => (
                    <div
                        key={item.ut_key}
                        className="relative aspect-[3/2] overflow-hidden rounded-md"
                    >
                        <Image
                            src={item.url}
                            alt={item.url}
                            className="object-cover w-full transition-transform hover:scale-105"
                            width={500}
                            height={500}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
