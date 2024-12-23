# QuickPull Monorepo

This is a Turborepo monorepo for QuickPull, a bulk image downloader that allows you to download images in collections. The platform offers both free and premium tiers with different upload limits and capabilities.

## Using this repository

Clone the repository and install dependencies:

```sh
git clone https://github.com/zedsoftworks-official/quickpull.git
pnpm install
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

-   `apps/nextjs`: a [Next.js](https://nextjs.org/) app for the web interface with features like:
    -   Authentication via Clerk
    -   File uploads with UploadThing
    -   Analytics with PostHog
    -   Database with Vercel Postgres
-   `apps/expo`: an [Expo](https://expo.dev/) app for iOS/Android (coming soon)
-   `@quickpull/ui`: shared React component library using shadcn/ui
-   `@quickpull/db`: database schema and utilities using Drizzle ORM
-   `@quickpull/eslint-config`: shared `eslint` configurations
-   `@quickpull/typescript-config`: shared `tsconfig.json`s
-   `@quickpull/tailwind-config`: shared Tailwind CSS configuration
-   `@quickpull/prettier-config`: shared Prettier configuration

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Tech Stack

-   [Next.js](https://nextjs.org/) for the web application
-   [TypeScript](https://www.typescriptlang.org/) for type safety
-   [Tailwind CSS](https://tailwindcss.com/) for styling
-   [tRPC](https://trpc.io/) for type-safe APIs
-   [Drizzle ORM](https://orm.drizzle.team/) for database operations
-   [shadcn/ui](https://ui.shadcn.com/) for UI components
-   [Clerk](https://clerk.com/) for authentication
-   [PostHog](https://posthog.com/) for analytics
-   [UploadThing](https://uploadthing.com/) for file uploads
-   [Vercel Postgres](https://vercel.com/storage/postgres) for database

### Utilities

This Turborepo has some additional tools already setup for you:

-   [TypeScript](https://www.typescriptlang.org/) for static type checking
-   [ESLint](https://eslint.org/) for code linting
-   [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm dev
```

### Remote Caching

Turborepo can use [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

To enable Remote Caching with Vercel:

```
npx turbo login
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

-   [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
-   [Caching](https://turbo.build/repo/docs/core-concepts/caching)
-   [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
-   [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
-   [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
-   [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
