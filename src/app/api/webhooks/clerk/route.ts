import { NextResponse, type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    return NextResponse.json({ message: 'Hello, world!' })
}
