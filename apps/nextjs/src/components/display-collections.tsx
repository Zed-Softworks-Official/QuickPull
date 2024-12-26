'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { Button } from '@quickpull/ui/components/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@quickpull/ui/components/card'
import { Skeleton } from '@quickpull/ui/components/skeleton'

import { api } from '~/trpc/react'

export function DisplayCollections() {
    const { data, isLoading, error } = api.collections.get_collections.useQuery()

    console.log(error)

    if (isLoading) {
        return (
            <div className="container mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="container mx-auto flex w-full flex-col items-center justify-center gap-5">
                <h1 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl">
                    No collections found
                </h1>
                <Button asChild>
                    <Link href="/upload">
                        <Plus className="mr-2 h-4 w-4" />
                        Create a collection
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                                    className="w-full object-cover transition-transform hover:scale-105"
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
