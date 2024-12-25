import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error(
        'UPSTASH_REDIS_REST_URL and/or UPSTASH_REDIS_REST_TOKEN is not defined'
    )
}

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const get_redis_key = (key: 'users' | 'collections' | 'payments', ...args: string[]) => {
    return `${key}:${args.join(':')}`
}

export { redis, get_redis_key }
