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
import { User } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

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

async function Navbar() {
    const user = await currentUser()

    return (
        <header className="border-b mb-10">
            <div className="container mx-auto flex items-center justify-between py-5">
                <Link href="/">
                    <h1 className="font-bold text-3xl">QuickPull</h1>
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
                            <NavigationMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar>
                                            <AvatarFallback>
                                                <User />
                                            </AvatarFallback>
                                            <AvatarImage src={user?.imageUrl} />
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <Link href={'/account'}>
                                                Account Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <SignOutButton />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <ModeToggle />
                            </NavigationMenuItem>
                        </NavigationMenuList>
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
