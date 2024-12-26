import { SafeAreaView, Text, View } from 'react-native'

export default function Index() {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <View className="flex-1 p-5">
                <Text className="pb-2 text-5xl font-bold text-foreground">
                    Hello, World!
                </Text>
            </View>
        </SafeAreaView>
    )
}
