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
import { ClerkProvider, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs'
import { Button } from '~/components/ui/button'
import { currentUser } from '@clerk/nextjs/server'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Menu, UserIcon, Zap } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { get_user_by_id_cache } from '~/server/db/query'
import { PosthogProvider } from '~/components/posthog-provider'
import { env } from '~/env'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '~/components/ui/sheet'

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
                <ClerkProvider
                    publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
                    appearance={{
                        elements: {
                            rootBox: 'rounded-lg border bg-card text-card-foreground',
                            card: 'rounded-lg border bg-card text-card-foreground',
                            headerTitle: 'text-foreground',
                            headerSubtitle: 'text-muted-foreground',
                            button: 'bg-primary text-primary-foreground hover:bg-primary/80',
                            formFieldInput: 'border rounded-md',
                            formFieldLabel: 'text-foreground',
                            dividerLine: 'bg-foreground/[0.1]',
                            footer: '!bg-card !rounded-md !text-card-foreground [&>*]:!bg-card [&>*]:!text-card-foreground bg-transparent',
                            footerActionText:
                                '!text-muted-foreground [&>*]:!text-muted-foreground',
                            footerActionLink:
                                '!text-muted-foreground hover:!text-foreground [&>*]:!text-muted-foreground hover:[&>*]:!text-foreground',
                            footerActionButton:
                                '!text-muted-foreground hover:!text-foreground [&>*]:!text-muted-foreground hover:[&>*]:!text-foreground',
                        },
                    }}
                    dynamic
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
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

                            <TRPCReactProvider>
                                <Navbar />
                                <main className="flex flex-col min-h-screen">
                                    {children}
                                </main>
                                <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                                    <div className="container mx-auto w-full flex flex-col sm:flex-row gap-2 items-center justify-center sm:justify-between">
                                        <p className="text-xs text-center sm:text-left text-gray-500 dark:text-gray-400">
                                            &copy; {new Date().getFullYear()}{' '}
                                            <Link href="https://zedsoftworks.dev">
                                                Zed Softworks LLC
                                            </Link>
                                            . All rights reserved.
                                        </p>
                                        <nav className="flex gap-4 sm:gap-6 justify-center">
                                            <Button variant={'link'} asChild>
                                                <Link href={'/terms'}>
                                                    Terms of Service
                                                </Link>
                                            </Button>
                                            <Button variant={'link'} asChild>
                                                <Link href={'/privacy'}>Privacy</Link>
                                            </Button>
                                            <ModeToggle />
                                        </nav>
                                    </div>
                                </footer>
                                <Toaster richColors />
                            </TRPCReactProvider>
                        </PosthogProvider>
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}

async function Navbar() {
    const user = await currentUser()

    return (
        <header className="border-b mb-10 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex items-center justify-between py-5 px-5 sm:px-0">
                <Link href="/" className="flex flex-row gap-2 items-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl font-bold">
                        Quick<span className="font-normal">pull</span>
                    </h1>
                </Link>
                <NavigationMenu className="hidden sm:flex items-center gap-5">
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
                            <NavigationMenuItem>
                                <PremiumButton user={user} variant="nav" />
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <AccountMenu user={user} />
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </SignedIn>
                    <SignedOut>
                        <Button asChild variant={'outline'}>
                            <Link prefetch={true} href={'/u/login'}>
                                Login
                            </Link>
                        </Button>
                    </SignedOut>
                </NavigationMenu>
                <Sheet>
                    <SheetTrigger asChild className="sm:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <div className="flex flex-col gap-4">
                            <SignedIn>
                                <SheetClose asChild>
                                    <Link
                                        href="/upload"
                                        className="flex items-center gap-2"
                                    >
                                        Upload
                                    </Link>
                                </SheetClose>
                                <PremiumButton user={user} variant="sheet" />
                                <SheetClose asChild>
                                    <Link href={'/api/payments/portal'}>
                                        Manage Subscription
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href={'/u/account'}>Account Settings</Link>
                                </SheetClose>
                                <Button asChild>
                                    <SignOutButton />
                                </Button>
                            </SignedIn>
                            <SignedOut>
                                <SheetClose asChild>
                                    <Link prefetch={true} href={'/u/login'}>
                                        Login
                                    </Link>
                                </SheetClose>
                            </SignedOut>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}

async function PremiumButton(props: { user: User | null; variant?: 'nav' | 'sheet' }) {
    if (!props.user) return null

    const db_user = await get_user_by_id_cache(props.user.id)

    if (db_user?.account_type === 'premium') {
        return null
    }

    if (props.variant === 'nav') {
        return (
            <Link href={'/api/payments/checkout'} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Go Premium
                </NavigationMenuLink>
            </Link>
        )
    }

    return (
        <Link href={'/api/payments/checkout'} className="flex items-center gap-2">
            Go Premium
        </Link>
    )
}

function AccountMenu(props: { user: User | null }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild aria-label="Open Account Menu">
                <Avatar>
                    <AvatarFallback>
                        <UserIcon />
                    </AvatarFallback>
                    <AvatarImage src={props.user?.imageUrl} alt={'User Avatar'} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuItem asChild>
                    <Link href={'/api/payments/portal'}>Manage Subscription</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={'/u/account'}>Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="w-full">
                    <SignOutButton />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
