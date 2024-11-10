import { Separator } from '~/components/ui/separator'
import { CollectionForm } from './form'

export default function UploadPage() {
    return (
        <div className="flex flex-col gap-5 w-full max-w-xl mx-auto">
            <h1 className="text-2xl font-bold">Upload</h1>
            <Separator />
            <CollectionForm />
        </div>
    )
}
