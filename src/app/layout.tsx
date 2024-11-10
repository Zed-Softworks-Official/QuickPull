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

export const metadata: Metadata = {
    title: 'QuickPull',
    description: 'A tool to quickly download images/videos in bulk',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
            <body>
                <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
                    <TRPCReactProvider>
                        <main className="container mx-auto w-full">
                            <Navbar />
                            {children}
                        </main>
                    </TRPCReactProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

function Navbar() {
    return (
        <header className="flex items-center justify-between py-5">
            <Link href="/">
                <h1 className="font-bold text-3xl">QuickPull</h1>
            </Link>
            <NavigationMenu className="flex items-center gap-2">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/upload" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Upload</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
                <ModeToggle />
            </NavigationMenu>
        </header>
    )
}
