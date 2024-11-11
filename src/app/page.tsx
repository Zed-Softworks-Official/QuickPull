import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut } from '@clerk/nextjs'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { api, HydrateClient } from '~/trpc/server'

export default function Home() {
    return (
        <HydrateClient>
            <SignedIn>
                <DisplayCollections />
            </SignedIn>
            <SignedOut>
                <DisplayLanding />
            </SignedOut>
        </HydrateClient>
    )
}

async function DisplayCollections() {
    const collections = await api.collections.get_collections()

    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
                <Link
                    prefetch={true}
                    href={`/collections/${collection.id}`}
                    key={collection.id}
                >
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>{collection.name}</CardTitle>
                            <CardDescription>{collection.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-[3/2] overflow-hidden rounded-md">
                                <Image
                                    src={collection.items[0]?.url ?? ''}
                                    alt={`Cover image for ${collection.name}`}
                                    className="object-cover w-full transition-transform hover:scale-105"
                                    width={500}
                                    height={500}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

function DisplayLanding() {
    return <>Landing</>
}
