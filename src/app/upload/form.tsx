'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form, FormControl, FormField, FormItem, FormLabel } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'

import { useState, useCallback, type Dispatch, type SetStateAction, useRef } from 'react'

import { CloudUpload, MoreVertical, Trash2 } from 'lucide-react'

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
import { type ColumnDef } from '@tanstack/react-table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { DataTable } from '~/components/data-table'

const schema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional(),
})

type SchemaType = z.infer<typeof schema>

export function CollectionForm(props: { account_type: AccountType }) {
    const [files, setFiles] = useState<File[]>([])
    const [progress, setProgress] = useState(0)
    const [pending, setPending] = useState(false)

    const toastId = useRef<string | number>('')

    const router = useRouter()
    const utils = api.useUtils()
    const createCollection = api.collections.set_collection.useMutation({
        onSuccess: async () => {
            toast.success('Files uploaded successfully', {
                id: toastId.current,
            })

            await utils.collections.get_collections.invalidate()

            router.replace('/')
        },
    })

    const { startUpload, isUploading, routeConfig } = useUploadThing(
        props.account_type === 'standard' ? 'standardUploader' : 'premiumUploader',
        {
            onUploadProgress: (progress) => {
                setProgress(progress)
            },
            onUploadError: (error) => {
                toast.error(error.message, {
                    id: toastId.current,
                })

                setPending(false)
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
        toastId.current = toast.loading('Uploading Files')

        const res = await startUpload(files)
        if (!res) {
            setPending(false)

            return
        }

        const collectionItems = res.map((item) => ({
            url: item.url,
            ut_key: item.key,
            filename: item.name,
        }))

        createCollection.mutate({
            name: data.name,
            description: data.description,
            items: collectionItems,
        })
    }

    return (
        <Form {...form}>
            <form
                className="w-full flex flex-col gap-5 pb-5"
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
                    <FileList files={files} setFiles={setFiles} />
                </FormItem>
                <Button type="submit" disabled={pending}>
                    Create Collection
                </Button>
            </form>
        </Form>
    )
}

function UploadDropzone(props: {
    isUploading: boolean
    routeConfig: ExpandedRouteConfig | undefined
    progress: number
    files: File[]
    setFiles: Dispatch<SetStateAction<File[]>>
}) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (
                acceptedFiles.length + props.files.length >
                (props.routeConfig?.image?.maxFileCount ?? 0)
            ) {
                toast.error(`Max file count is ${props.routeConfig?.image?.maxFileCount}`)
                return
            }

            props.setFiles((prev) => [...prev, ...acceptedFiles])
        },
        [props]
    )

    const dropzone = useDropzone({
        onDrop,
        accept: generateClientDropzoneAccept(
            generatePermittedFileTypes(props.routeConfig).fileTypes
        ),
        maxFiles: props.routeConfig?.image?.maxFileCount,
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
                        <CloudUpload className="w-10 h-10" />
                        <CardTitle className="text-xl">Upload Files</CardTitle>
                        <CardDescription>
                            {generatePermittedFileTypes(props.routeConfig).fileTypes.join(
                                ', '
                            )}{' '}
                            (max {props.routeConfig?.image?.maxFileSize})
                        </CardDescription>
                        <CardDescription>
                            {props.files.length} files selected
                        </CardDescription>
                    </div>
                )}
            </CardHeader>
        </Card>
    )
}

function FileList(props: { files: File[]; setFiles: Dispatch<SetStateAction<File[]>> }) {
    if (props.files.length === 0) return null

    const columns: ColumnDef<File>[] = [
        {
            header: 'Filename',
            accessorKey: 'name',
        },
        {
            header: 'Size',
            accessorKey: 'size',
            cell: ({ row }) => {
                const bytes = row.original.size
                if (bytes < 1024 * 1024) {
                    return `${(bytes / 1024).toFixed(1)} KB`
                }
                return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const index = row.index

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'ghost'}>
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() =>
                                    props.setFiles((prev) =>
                                        prev.filter((_, i) => i !== index)
                                    )
                                }
                            >
                                <Trash2 className="w-4 h-4" />
                                Remove
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return <DataTable columns={columns} data={props.files} />
}
