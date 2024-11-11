import Link from 'next/link'

export default function PaymentsSuccessPage() {
    return (
        <div className="flex flex-col gap-5 items-center justify-center w-full h-full">
            <h1 className="text-2xl font-bold">Payment Successful</h1>
            <p>You can now upload bigger and more images</p>
            <Link href="/upload">Upload</Link>
        </div>
    )
}
