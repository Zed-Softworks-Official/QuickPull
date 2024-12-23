import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
}

const globalForStripe = global as unknown as { stripe: Stripe }

export const stripe =
    globalForStripe.stripe ||
    new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' })

if (process.env.NODE_ENV !== 'production') globalForStripe.stripe = stripe

export * from './portal'
export * from './session'
