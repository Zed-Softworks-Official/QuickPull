import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { useUser } from '@clerk/clerk-expo'

import type { RouterOutputs } from '~/utils/api'
import { api } from '~/utils/api'

export default function Index() {
    const { user, isLoaded } = useUser()

    if (!isLoaded || !user) {
        return <Text>Loading...</Text>
    }

    const { data, isLoading } = api.collections.get_collections_by_user_id.useQuery(
        user.id
    )

    if (isLoading) {
        return <Text>Loading...</Text>
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex h-full flex-1 flex-col gap-10 px-10 pt-5">
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
    return (
        <View className="flex h-full w-full flex-1 flex-col rounded-xl border-2 border-foreground/10 p-5">
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
        </View>
    )
}
