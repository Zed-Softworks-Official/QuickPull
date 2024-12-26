import { SafeAreaView, Text, View } from 'react-native'

export default function SignIn() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 items-center justify-center px-10 pt-5">
                <Text className="text-2xl font-bold text-foreground">Sign In</Text>
            </View>
        </SafeAreaView>
    )
}
