import { type Config } from 'drizzle-kit'

if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not set')
}

export default {
    schema: './src/server/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL,
    },
    tablesFilter: ['quickpull_*'],
} satisfies Config
