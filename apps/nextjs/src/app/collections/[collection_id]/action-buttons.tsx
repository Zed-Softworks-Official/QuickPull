'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import JSZip from 'jszip'
import { Download, MoreVertical, Share, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import type { InferSelectModel } from '@quickpull/db'
import { collections } from '@quickpull/db/schema'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@quickpull/ui/components/alert-dialog'
import { Button } from '@quickpull/ui/components/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@quickpull/ui/components/dropdown-menu'

import { env } from '~/env'
import { api } from '~/trpc/react'

export function DownloadButton(props: {
    collection: InferSelectModel<typeof collections>
}) {
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = async () => {
        setIsDownloading(true)
        const toastId = toast.loading('Preparing download...')

        try {
            // Original zip download logic for desktop
            const zip = new JSZip()

            // Download each image and add to zip
            for (const item of props.collection.items) {
                try {
                    const response = await fetch(item.url)
                    const blob = await response.blob()

                    zip.file(item.filename, blob)
                } catch (err) {
                    console.error(
                        `Failed to download ${item.url}:`,
                        err instanceof Error ? err.message : String(err)
                    )
                    toast.error(`Failed to download ${item.filename}`, {
                        id: toastId,
                    })
                    setIsDownloading(false)
                    return
                }
            }

            // Generate and download zip file
            const content = await zip.generateAsync({ type: 'blob' })
            const downloadUrl = URL.createObjectURL(content)

            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = `${props.collection.name} from Quickpull.zip`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(downloadUrl)

            toast.success('Download complete!', { id: toastId })
        } catch (err) {
            console.error('Failed to process downloads', err)
            toast.error('Failed to process downloads', { id: toastId })
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Button onClick={handleDownload} disabled={isDownloading}>
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download All'}
        </Button>
    )
}

export function KebabMenu(props: { collection: InferSelectModel<typeof collections> }) {
    const [toastId, setToastId] = useState<string | number | null>(null)

    const router = useRouter()
    const utils = api.useUtils()

    const deleteCollection = api.collections.delete_collection.useMutation({
        onMutate: () => {
            setToastId(toast.loading('Deleting collection...'))
        },
        onSuccess: async (res) => {
            if (!toastId) return

            if (res) {
                toast.success('Collection deleted!', {
                    id: toastId,
                })

                await utils.collections.get_collections.invalidate()
                router.replace('/')
            } else {
                toast.error('Failed to delete collection!', {
                    id: toastId,
                })
            }
        },
    })

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical className="h-4 w-4 text-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        asChild
                        onClick={async () => {
                            await navigator.clipboard.writeText(
                                `${env.NEXT_PUBLIC_URL}/collections/${props.collection.id}`
                            )

                            toast.info('Copied to clipboard!')
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <Share className="mr-2 h-4 w-4" />
                            Share
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <AlertDialogTrigger asChild>
                            <div className="flex items-center gap-2">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </div>
                        </AlertDialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={deleteCollection.isPending}
                        onClick={() => {
                            deleteCollection.mutate({
                                collection_id: props.collection.id,
                            })
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteCollection.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
