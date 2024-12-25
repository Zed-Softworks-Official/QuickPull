import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { Download, ImageIcon } from 'lucide-react'

import { Button } from '@quickpull/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@quickpull/ui/components/card'

import { DisplayCollections } from '~/components/display-collections'
import { HydrateClient } from '~/trpc/server'

export default function Home() {
    return (
        <>
            <SignedIn>
                <HydrateClient>
                    <DisplayCollections />
                </HydrateClient>
            </SignedIn>
            <SignedOut>
                <DisplayLanding />
            </SignedOut>
        </>
    )
}

function DisplayLanding() {
    return (
        <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                Download Images in Collections
                            </h1>
                            <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                                QuickPull makes it easy to download collections of images.
                                Save time and streamline your workflow.
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Button asChild>
                                <Link href="/u/login">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <section
                id="features"
                className="w-full bg-gray-100 py-12 dark:bg-gray-900 md:py-24 lg:py-32"
            >
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
                        Features
                    </h2>
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                        <Card>
                            <CardHeader>
                                <Download className="mb-2 h-10 w-10 text-blue-600" />
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
                                <ImageIcon className="mb-2 h-10 w-10 text-blue-600" />
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
                    <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
                        Pricing
                    </h2>
                    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2 lg:gap-12">
                        <Card>
                            <CardHeader>
                                <CardTitle>Free Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-inside list-disc space-y-2">
                                    <li>10 images per collection</li>
                                    <li>4mb max file size</li>
                                </ul>
                                <Button asChild className="mt-6 w-full">
                                    <Link href="/u/login">Get Started</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Premium Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-inside list-disc space-y-2">
                                    <li>20 images per collection</li>
                                    <li>8mb max file size</li>
                                </ul>
                                <p className="mt-4 text-2xl font-bold">$10/month</p>
                                <Button asChild className="mt-6 w-full">
                                    <Link href="/u/login">Get Started</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <section
                id="cta"
                className="w-full bg-blue-600 py-12 text-white md:py-24 lg:py-32"
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
                            <Link href="/u/login">Get Started Now</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}
