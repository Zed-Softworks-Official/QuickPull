'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form, FormControl, FormField, FormItem, FormLabel } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'

import { useState, useCallback } from 'react'

import { CloudUpload } from 'lucide-react'

import { useDropzone } from '@uploadthing/react'
import {
    generateClientDropzoneAccept,
    generatePermittedFileTypes,
} from 'uploadthing/client'
import type { ExpandedRouteConfig } from 'uploadthing/types'

import { useUploadThing } from '~/components/uploadthing'

import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'

const schema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional(),
})

type SchemaType = z.infer<typeof schema>

export function CollectionForm(props: { account_type: AccountType }) {
    const [files, setFiles] = useState<File[]>([])
    const [progress, setProgress] = useState(0)
    const [pending, setPending] = useState(false)

    const router = useRouter()
    const mutation = api.collections.set_collection.useMutation({
        onSuccess: () => {
            return router.replace('/')
        },
    })

    const { startUpload, isUploading, routeConfig } = useUploadThing(
        props.account_type === 'standard' ? 'standardUploader' : 'premiumUploader',
        {
            onUploadProgress: (progress) => {
                setProgress(progress)
            },
        }
    )

    const form = useForm<SchemaType>({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: undefined,
        },
    })

    const handle_submit = async (data: SchemaType) => {
        setPending(true)
        const toastId = toast.loading('Uploading Files')

        const res = await startUpload(files)
        if (!res) {
            toast.error('Failed to upload files', { id: toastId })
            setPending(false)
            return
        }

        const collectionItems = res.map((item) => ({
            url: item.url,
            ut_key: item.key,
            filename: item.name,
        }))

        await mutation.mutateAsync({
            name: data.name,
            description: data.description,
            items: collectionItems,
        })

        toast.success('Files uploaded successfully', { id: toastId })
    }

    return (
        <Form {...form}>
            <form
                className="w-full flex flex-col gap-5"
                onSubmit={form.handleSubmit(handle_submit)}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={field.name}>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Name" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={field.name}>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Description"
                                    rows={6}
                                    className="resize-none"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Items</FormLabel>
                    <UploadDropzone
                        isUploading={isUploading}
                        routeConfig={routeConfig}
                        progress={progress}
                        files={files}
                        setFiles={setFiles}
                    />
                </FormItem>
                <Button type="submit" disabled={pending}>
                    Create Collection
                </Button>
            </form>
        </Form>
    )
}

export function UploadDropzone(props: {
    isUploading: boolean
    routeConfig: ExpandedRouteConfig | undefined
    progress: number
    files: File[]
    setFiles: (files: File[]) => void
}) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            props.setFiles(acceptedFiles)
        },
        [props]
    )

    const dropzone = useDropzone({
        onDrop,
        accept: generateClientDropzoneAccept(
            generatePermittedFileTypes(props.routeConfig).fileTypes
        ),
    })

    return (
        <Card {...dropzone.getRootProps()}>
            <CardHeader className="flex flex-col gap-5 items-center justify-center ">
                {props.isUploading && <Progress value={props.progress} />}
                <input {...dropzone.getInputProps()} />
                {props.files.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3">
                        <CloudUpload className="w-10 h-10" />
                        <CardTitle className="text-xl">Upload Files</CardTitle>
                        <CardDescription>
                            {generatePermittedFileTypes(props.routeConfig).fileTypes.join(
                                ', '
                            )}{' '}
                            (max {props.routeConfig?.image?.maxFileSize})
                        </CardDescription>
                    </div>
                )}
                {props.files.length !== 0 && (
                    <div className="flex flex-col items-center justify-center gap-3">
                        <CardDescription>
                            {props.files.length} files selected
                        </CardDescription>
                    </div>
                )}
            </CardHeader>
        </Card>
    )
}
