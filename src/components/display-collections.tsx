'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'

import { api } from '~/trpc/react'

export function DisplayCollections() {
    const { data, isLoading } = api.collections.get_collection.useQuery()

    if (isLoading) {
        return (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 container mx-auto">
                {[...Array<unknown>(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-4 w-[200px]" />
                            </CardTitle>
                            <CardDescription>
                                <Skeleton className="h-4 w-[160px]" />
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-[3/2] overflow-hidden rounded-md">
                                <Skeleton className="h-full w-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="container mx-auto flex flex-col gap-5 items-center justify-center w-full ">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center">
                    No collections found
                </h1>
                <Button asChild>
                    <Link href="/upload">
                        <Plus className="w-4 h-4 mr-2" />
                        Create a collection
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 container mx-auto">
            {data.map((collection) => (
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
