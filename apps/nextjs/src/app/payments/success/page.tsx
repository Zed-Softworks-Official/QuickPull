import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function PaymentsSuccessPage() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center w-full h-full container mx-auto">
      <h1 className="text-2xl font-bold">Payment Successful</h1>
      <p>You can now upload bigger and more images</p>
      <Button asChild>
        <Link href="/upload">Upload</Link>
      </Button>
    </div>
  );
}
