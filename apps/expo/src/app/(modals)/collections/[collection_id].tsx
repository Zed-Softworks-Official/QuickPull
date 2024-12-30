import {
    ActivityIndicator,
    Button,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native'
import { BlurView } from 'expo-blur'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { MoreVerticalIcon } from 'lucide-react-native'

import { api } from '~/utils/api'

export default function CollectionPage() {
    const router = useRouter()
    const { collection_id } = useLocalSearchParams()
    const { data: collection, isLoading } = api.collections.get_collection_by_id.useQuery(
        {
            collection_id: collection_id as string,
        }
    )

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <ActivityIndicator size="large" color="#ffffff" />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-background px-5 py-10">
            <BlurView
                intensity={100}
                tint="dark"
                className="absolute top-0 z-10 flex w-full flex-row items-center justify-between px-3 pb-5 pt-20"
            >
                <View>
                    <Text className="text-2xl font-bold text-foreground">
                        {collection?.name}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                        {collection?.description}
                    </Text>
                </View>
                <Pressable>
                    <MoreVerticalIcon size={16} color="#fff" />
                </Pressable>
            </BlurView>

            <ScrollView className="mx-auto flex h-full w-full flex-1 pt-20">
                <Button title="Back" onPress={() => router.back()} />
                <View className="flex h-full w-full flex-1 flex-col items-center justify-center gap-10">
                    {collection?.items.map((item) => (
                        <Image
                            key={item.ut_key}
                            src={item.url}
                            className="h-96 w-full rounded-md"
                            resizeMode="contain"
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
