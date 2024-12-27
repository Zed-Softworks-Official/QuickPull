import { api } from '~/trpc/server'
import { Display, Heading } from './display'

export async function generateMetadata(props: {
    params: Promise<{ collection_id: string }>
}) {
    const params = await props.params
    const collection = await api.collections.get_collection_metadata({
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
    const params = await props.params

    return (
        <div className="container mx-auto flex flex-col gap-4 px-5">
            <Heading collection_id={params.collection_id} />
            <Display collection_id={params.collection_id} />
        </div>
    )
}
