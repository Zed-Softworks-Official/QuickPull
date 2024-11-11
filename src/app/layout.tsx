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
import { UserIcon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { get_user_by_id_cache } from '~/server/db/query'

export const metadata: Metadata = {
    title: 'QuickPull',
    description: 'A tool to quickly download images/videos in bulk',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
            <body>
                <ClerkProvider dynamic>
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
                            <main className="flex flex-col min-h-screen">{children}</main>
                            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    &copy; {new Date().getFullYear()}{' '}
                                    <Link href="https://zedsoftworks.dev">
                                        Zed Softworks LLC
                                    </Link>
                                    . All rights reserved.
                                </p>
                                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                                    <Button variant={'link'} asChild>
                                        <Link href={'/terms'}>Terms of Service</Link>
                                    </Button>
                                    <Button variant={'link'} asChild>
                                        <Link href={'/privacy'}>Privacy</Link>
                                    </Button>
                                </nav>
                            </footer>
                            <Toaster richColors />
                        </TRPCReactProvider>
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}

async function Navbar() {
    const user = await currentUser()

    return (
        <header className="border-b mb-10">
            <div className="container mx-auto flex items-center justify-between py-5">
                <Link href="/">
                    <QuickPullLogo />
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
                    <DropdownMenuItem asChild>
                        <SignOutButton />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </NavigationMenuItem>
    )
}

function QuickPullLogo() {
    return (
        <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 196.65 42.73"
            className="fill-black dark:fill-white"
            width="190"
            height="40"
        >
            <g>
                <path d="M24.01,34.37l-2.47-3.21c-.69.32-1.51.56-2.45.74s-1.93.26-2.97.26c-2.98,0-5.53-.71-7.65-2.12-2.12-1.42-3.75-3.33-4.88-5.74-1.13-2.41-1.69-5.14-1.69-8.17s.55-5.73,1.65-8.17c1.1-2.44,2.71-4.38,4.83-5.81,2.12-1.43,4.7-2.15,7.74-2.15s5.69.72,7.8,2.15c2.11,1.43,3.71,3.37,4.81,5.81,1.1,2.44,1.65,5.17,1.65,8.17,0,2.83-.5,5.4-1.5,7.72-1,2.31-2.43,4.19-4.31,5.63l3.9,4.9h-4.46ZM16.12,27.87c.55,0,1.05-.03,1.5-.09.45-.06.83-.16,1.15-.3l-4.38-5.5h4.46l2.95,3.9c2.48-2.08,3.73-5.33,3.73-9.75,0-2.14-.34-4.1-1.02-5.89-.68-1.79-1.71-3.23-3.1-4.31-1.39-1.08-3.15-1.63-5.29-1.63s-3.86.54-5.24,1.63c-1.39,1.08-2.42,2.52-3.1,4.31-.68,1.79-1.02,3.76-1.02,5.89s.35,4.06,1.04,5.85c.69,1.79,1.73,3.22,3.12,4.29,1.39,1.07,3.12,1.6,5.2,1.6Z" />
                <path d="M43.13,31.99c-2.34,0-4.19-.77-5.55-2.3-1.36-1.53-2.04-3.68-2.04-6.46v-14.82h4.59v13.65c0,2.08.36,3.61,1.08,4.59.72.98,1.82,1.47,3.29,1.47,1.68,0,2.98-.54,3.92-1.63.94-1.08,1.41-2.61,1.41-4.57v-13.52h4.59v23.06h-4.29l-.04-3.77c-1.24,2.86-3.57,4.29-6.98,4.29Z" />
                <path d="M60.29,5.07V.48h4.77v4.59h-4.77ZM60.38,31.47V8.41h4.59v23.06h-4.59Z" />
                <path d="M80.53,31.99c-2.2,0-4.12-.5-5.76-1.5-1.65-1-2.92-2.4-3.81-4.2-.9-1.81-1.34-3.92-1.34-6.35s.45-4.54,1.34-6.35c.9-1.81,2.17-3.21,3.81-4.2,1.65-1,3.57-1.5,5.76-1.5,2.8,0,5.13.73,6.98,2.19,1.85,1.46,2.96,3.52,3.34,6.18l-4.81.26c-.23-1.5-.84-2.65-1.82-3.45-.98-.79-2.21-1.19-3.69-1.19-1.94,0-3.45.71-4.53,2.15-1.08,1.43-1.63,3.4-1.63,5.92s.54,4.52,1.63,5.94c1.08,1.42,2.59,2.12,4.53,2.12,1.47,0,2.7-.41,3.69-1.24.98-.82,1.59-2.07,1.82-3.75l4.81.26c-.38,2.66-1.48,4.78-3.32,6.35-1.83,1.58-4.17,2.36-7,2.36Z" />
                <path d="M95.01,31.47V.69h4.59v19.11l10.36-11.4h5.81l-9.02,9.71,9.36,13.35h-5.29l-7.15-10.49-4.07,4.33v6.15h-4.59Z" />
                <path d="M121.71,37.97V8.5h2.6l.09,4.29c.67-1.56,1.65-2.75,2.97-3.58,1.31-.82,2.81-1.23,4.49-1.23,2.17,0,3.97.53,5.42,1.6,1.45,1.07,2.53,2.51,3.25,4.33s1.08,3.84,1.08,6.07-.36,4.25-1.08,6.07-1.81,3.27-3.25,4.33c-1.45,1.07-3.25,1.6-5.42,1.6-1.62,0-3.09-.42-4.42-1.26-1.33-.84-2.28-1.89-2.86-3.16v10.4h-2.86ZM131.63,29.26c2.14,0,3.83-.82,5.07-2.47s1.86-3.92,1.86-6.81-.62-5.16-1.86-6.8-2.95-2.47-5.11-2.47-3.81.82-5.09,2.47c-1.29,1.65-1.93,3.92-1.93,6.8s.64,5.16,1.93,6.81c1.29,1.65,3,2.47,5.14,2.47Z" />
                <path d="M154.26,31.99c-2.31,0-4.15-.77-5.5-2.32-1.36-1.55-2.04-3.68-2.04-6.39v-14.78h2.86v13.91c0,4.68,1.81,7.02,5.42,7.02,1.99,0,3.56-.64,4.7-1.93,1.14-1.29,1.71-3.06,1.71-5.31v-13.7h2.86v22.97h-2.69l-.04-4.16c-.55,1.5-1.46,2.66-2.73,3.47-1.27.81-2.79,1.21-4.55,1.21Z" />
            </g>
            <path d="M191.07,42.73H5.57c-3.07,0-5.57-2.5-5.57-5.57v-7.43c0-1.03.83-1.86,1.86-1.86s1.86.83,1.86,1.86v7.43c0,1.03.83,1.86,1.86,1.86h185.5c1.03,0,1.86-.83,1.86-1.86v-7.43c0-1.03.83-1.86,1.86-1.86s1.86.83,1.86,1.86v7.43c0,3.07-2.5,5.57-5.57,5.57Z" />
            <g>
                <path d="M173.22,31.99c-.26,0-.51-.1-.71-.29l-5-5c-.39-.39-.39-1.02,0-1.41s1.02-.39,1.41,0l4.29,4.29,4.29-4.29c.39-.39,1.02-.39,1.41,0s.39,1.02,0,1.41l-5,5c-.2.2-.45.29-.71.29Z" />
                <path d="M173.22,31.99c-.55,0-1-.45-1-1V1.19c0-.55.45-1,1-1s1,.45,1,1v29.79c0,.55-.45,1-1,1Z" />
            </g>
            <g>
                <path d="M186.38,31.99c-.26,0-.51-.1-.71-.29l-5-5c-.39-.39-.39-1.02,0-1.41s1.02-.39,1.41,0l4.29,4.29,4.29-4.29c.39-.39,1.02-.39,1.41,0s.39,1.02,0,1.41l-5,5c-.2.2-.45.29-.71.29Z" />
                <path d="M186.38,31.99c-.55,0-1-.45-1-1V1.19c0-.55.45-1,1-1s1,.45,1,1v29.79c0,.55-.45,1-1,1Z" />
            </g>
        </svg>
    )
}
