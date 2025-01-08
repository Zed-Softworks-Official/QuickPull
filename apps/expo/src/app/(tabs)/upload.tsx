import { useState } from 'react'
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { openSettings } from 'expo-linking'
import { UploadCloudIcon } from 'lucide-react-native'
import { z } from 'zod'

import { useUploadThing } from '~/utils/uploadthing'

const uploadSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    images_length: z.number().min(1).max(10, 'Maximum 10 images'),
})

export default function Upload() {
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const { startUpload, isUploading } = useUploadThing('standardUploader', {
        onClientUploadComplete: (res) => {
            Alert.alert('Upload complete', JSON.stringify(res))
        },
        onUploadError: (err) => {
            Alert.alert('Upload error', JSON.stringify(err))
        },
    })

    const handleUpload = async () => {
        const validated = uploadSchema.safeParse({
            title,
            description,
            images_length: images.length,
        })

        if (!validated.success) {
            Alert.alert('Invalid input', validated.error.message)

            return
        }

        const res = await startUpload(images.map((image) => image.file))

        console.log('values: ', validated.data)
        console.log('files: ', res)

        //TODO: API Call
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex flex-1 flex-col gap-2 px-10 pt-5">
                <Text className="text-foreground">Title</Text>
                <TextInput
                    className="h-10 rounded-md border border-border bg-background px-2 text-foreground"
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <Text className="text-foreground">Description</Text>
                <TextInput
                    className="h-24 rounded-md border border-border bg-background px-2 text-foreground"
                    placeholder="Description"
                    multiline
                    numberOfLines={5}
                    value={description}
                    onChangeText={setDescription}
                />
                <Text className="text-foreground">Select Images</Text>
                <Pressable
                    className="flex max-h-36 w-full flex-1 flex-col items-center justify-center gap-3 rounded-md border border-border"
                    onPress={async () => {
                        const res = await ImagePicker.launchImageLibraryAsync({
                            allowsMultipleSelection: true,
                        })

                        if (res.assets) {
                            setImages(res.assets)
                        }
                    }}
                >
                    <UploadCloudIcon
                        className="text-muted-foreground"
                        color="#fff"
                        size={40}
                    />
                    <Text className="text-foreground">Upload</Text>
                </Pressable>

                <Pressable
                    className="mt-5 flex w-full items-center justify-center rounded-md bg-primary px-3 py-2"
                    onPress={handleUpload}
                >
                    <Text>Create Collection</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}
