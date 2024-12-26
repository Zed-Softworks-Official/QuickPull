import { SafeAreaView, Text, View } from 'react-native'

export default function Settings() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 px-10 pt-5">
                <Text className="pb-2 text-2xl font-bold text-foreground">Account</Text>
            </View>
        </SafeAreaView>
    )
}
