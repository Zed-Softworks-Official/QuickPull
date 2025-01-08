import {
    ActivityIndicator,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native'
import { useRouter } from 'expo-router'

import type { RouterOutputs } from '~/utils/api'
import { api } from '~/utils/api'

export default function Index() {
    const { data, isLoading } = api.collections.get_collections.useQuery()

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="flex h-full w-full flex-1 flex-col items-center justify-center">
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView
                className="flex h-full flex-1 flex-col gap-10 px-10 pt-5"
                contentContainerStyle={{
                    gap: 20,
                }}
            >
                {data?.map((collection) => (
                    <CollectionCard key={collection.id} collection={collection} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

function CollectionCard(props: {
    collection: RouterOutputs['collections']['get_collections_by_user_id'][number]
}) {
    const router = useRouter()

    return (
        <Pressable
            className="flex h-full w-full flex-1 flex-col rounded-md border-2 border-foreground/10 p-5"
            onPress={() => {
                router.push({
                    pathname: '/(modals)/collections/[collection_id]',
                    params: {
                        collection_id: props.collection.id,
                    },
                })
            }}
        >
            <Text className="text-xl font-bold text-foreground">
                {props.collection.name}
            </Text>
            <Text className="text-md text-muted-foreground">
                {props.collection.description}
            </Text>
            <Image
                src={props.collection.items[0]?.url}
                className="h-48 w-full"
                resizeMode="contain"
            />
        </Pressable>
    )
}
