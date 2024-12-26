import { SafeAreaView, Text, View } from 'react-native'

export default function Upload() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="p-5">
                <Text className="pb-2 text-5xl font-bold text-foreground">
                    Upload Something
                </Text>
            </View>
        </SafeAreaView>
    )
}
