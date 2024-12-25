import Link from 'next/link'

import { Button } from '@quickpull/ui/components/button'

export default function PaymentsSuccessPage() {
    return (
        <div className="container mx-auto flex h-full w-full flex-col items-center justify-center gap-5">
            <h1 className="text-2xl font-bold">Payment Successful</h1>
            <p>You can now upload bigger and more images</p>
            <Button asChild>
                <Link href="/upload">Upload</Link>
            </Button>
        </div>
    )
}
