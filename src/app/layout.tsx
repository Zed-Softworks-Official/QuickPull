import '~/styles/globals.css'

import { GeistSans } from 'geist/font/sans'
import { type Metadata } from 'next'
import Link from 'next/link'
import type { User } from '@clerk/nextjs/server'

import { TRPCReactProvider } from '~/trpc/react'
import { ThemeProvider } from '~/components/theme-provider'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'
import { ModeToggle } from '~/components/mode-toggle'

import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'

import { ourFileRouter } from '~/app/api/uploadthing/core'
import { Toaster } from '~/components/ui/sonner'
import {
    ClerkProvider,
    SignedIn,
    SignedOut,
    SignInButton,
    SignOutButton,
} from '@clerk/nextjs'
import { Button } from '~/components/ui/button'
import { currentUser } from '@clerk/nextjs/server'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { UserIcon, Zap } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { get_user_by_id_cache } from '~/server/db/query'
import { PosthogProvider } from '~/components/posthog-provider'

export const metadata: Metadata = {
    title: 'QuickPull',
    description: 'A tool to quickly download images in bulk',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
            <body>
                <ClerkProvider dynamic>
                    <PosthogProvider>
                        <NextSSRPlugin
                            /**
                             * The `extractRouterConfig` will extract **only** the route configs
                             * from the router to prevent additional information from being
                             * leaked to the client. The data passed to the client is the same
                             * as if you were to fetch `/api/uploadthing` directly.
                             */
                            routerConfig={extractRouterConfig(ourFileRouter)}
                        />
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <TRPCReactProvider>
                                <Navbar />
                                <main className="flex flex-col min-h-screen">
                                    {children}
                                </main>
                                <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                                    <div className="container mx-auto w-full flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            &copy; {new Date().getFullYear()}{' '}
                                            <Link href="https://zedsoftworks.dev">
                                                Zed Softworks LLC
                                            </Link>
                                            . All rights reserved.
                                        </p>
                                        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                                            <Button variant={'link'} asChild>
                                                <Link href={'/terms'}>
                                                    Terms of Service
                                                </Link>
                                            </Button>
                                            <Button variant={'link'} asChild>
                                                <Link href={'/privacy'}>Privacy</Link>
                                            </Button>
                                        </nav>
                                    </div>
                                </footer>
                                <Toaster richColors />
                            </TRPCReactProvider>
                        </ThemeProvider>
                    </PosthogProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}

async function Navbar() {
    const user = await currentUser()

    return (
        <header className="border-b mb-10 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex items-center justify-between py-5">
                <Link href="/" className="flex flex-row gap-2 items-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl font-bold">
                        Quick<span className="font-normal">pull</span>
                    </h1>
                </Link>
                <NavigationMenu className="flex items-center gap-5">
                    <SignedIn>
                        <NavigationMenuList className="space-x-5">
                            <NavigationMenuItem>
                                <Link href="/upload" legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        Upload
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <PremiumButton user={user} />
                            <AccountMenu user={user} />
                        </NavigationMenuList>
                    </SignedIn>
                    <SignedOut>
                        <Button asChild variant={'outline'}>
                            <SignInButton />
                        </Button>
                    </SignedOut>
                    <NavigationMenuItem asChild>
                        <ModeToggle />
                    </NavigationMenuItem>
                </NavigationMenu>
            </div>
        </header>
    )
}

async function PremiumButton(props: { user: User | null }) {
    if (!props.user) return null

    const db_user = await get_user_by_id_cache(props.user.id)

    if (db_user?.account_type === 'premium') {
        return null
    }

    return (
        <NavigationMenuItem>
            <Link href={'/api/payments/checkout'} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Go Premium
                </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>
    )
}

function AccountMenu(props: { user: User | null }) {
    return (
        <NavigationMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar>
                        <AvatarFallback>
                            <UserIcon />
                        </AvatarFallback>
                        <AvatarImage src={props.user?.imageUrl} />
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <Link href={'/api/payments/portal'}>Manage Subscription</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/account'}>Account Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="w-full">
                        <SignOutButton />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </NavigationMenuItem>
    )
}
