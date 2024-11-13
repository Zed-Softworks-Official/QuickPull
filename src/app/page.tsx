import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { api, HydrateClient } from '~/trpc/server'
import { Download, ImageIcon, Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'

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

    if (collections.length === 0) {
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
    return (
        <main className="flex-1 ">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                Download Images in Collections
                            </h1>
                            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                QuickPull makes it easy to download collections of images.
                                Save time and streamline your workflow.
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Button asChild>
                                <SignInButton>Get Started</SignInButton>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <section
                id="features"
                className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900"
            >
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                        Features
                    </h2>
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                        <Card>
                            <CardHeader>
                                <Download className="h-10 w-10 mb-2 text-blue-600" />
                                <CardTitle>Bulk Downloads</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Download multiple files simultaneously, saving you
                                    time and effort.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <ImageIcon className="h-10 w-10 mb-2 text-blue-600" />
                                <CardTitle>Image Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Support for various image formats including JPEG, PNG,
                                    GIF, and more.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                        Pricing
                    </h2>
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>Free Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>10 images per collection</li>
                                    <li>4mb max file size</li>
                                </ul>
                                <Button asChild className="w-full mt-6">
                                    <SignInButton>Get Started</SignInButton>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Premium Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>20 images per collection</li>
                                    <li>8mb max file size</li>
                                </ul>
                                <p className="mt-4 text-2xl font-bold">$10/month</p>
                                <Button asChild className="w-full mt-6">
                                    <SignInButton>Get Started</SignInButton>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <section
                id="cta"
                className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white"
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Ready to start downloading?
                            </h2>
                            <p className="mx-auto max-w-[600px] text-blue-100 md:text-xl">
                                Sign up now and experience the power of QuickPull. Start
                                downloading your images in bulk today!
                            </p>
                        </div>
                        <Button asChild>
                            <SignInButton>Get Started Now</SignInButton>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}
