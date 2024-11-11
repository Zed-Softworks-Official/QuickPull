import { NextResponse } from 'next/server'
import { api } from '~/trpc/server'

export async function GET() {
    const checkout_session = await api.payments.create_checkout_session()

    if (!checkout_session.url) {
        return NextResponse.redirect('/')
    }

    return NextResponse.redirect(checkout_session.url)
}
