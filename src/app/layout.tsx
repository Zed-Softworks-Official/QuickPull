import '~/styles/globals.css'

import { GeistSans } from 'geist/font/sans'
import { type Metadata } from 'next'
import Link from 'next/link'

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
import { Toaster } from 'sonner'
import { ClerkProvider, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { Button } from '~/components/ui/button'

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
                        defaultTheme="light"
                        disableTransitionOnChange
                    >
                        <TRPCReactProvider>
                            <Navbar />
                            <main className="container mx-auto w-full">{children}</main>
                            <Toaster richColors />
                        </TRPCReactProvider>
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}

function Navbar() {
    return (
        <header className="border-b mb-10">
            <div className="container mx-auto flex items-center justify-between py-5">
                <Link href="/">
                    <h1 className="font-bold text-3xl">QuickPull</h1>
                </Link>
                <NavigationMenu className="flex items-center gap-2">
                    <SignedIn>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/upload" legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        Upload
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                        <ModeToggle />
                    </SignedIn>
                    <SignedOut>
                        <Button asChild variant={'outline'}>
                            <SignInButton />
                        </Button>
                    </SignedOut>
                </NavigationMenu>
            </div>
        </header>
    )
}
