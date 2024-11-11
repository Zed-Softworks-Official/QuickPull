import { env } from '~/env'
import Stripe from 'stripe'

const globalForStripe = global as unknown as { stripe: Stripe }

export const stripe =
    globalForStripe.stripe ||
    new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-10-28.acacia' })

if (env.NODE_ENV !== 'production') globalForStripe.stripe = stripe

export * from './portal'
export * from './session'
