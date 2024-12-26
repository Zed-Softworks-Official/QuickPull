import { SafeAreaView, Text, View } from 'react-native'

export default function Settings() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View>
                <Text className="text-2xl font-bold text-foreground">Account</Text>
            </View>
        </SafeAreaView>
    )
}
