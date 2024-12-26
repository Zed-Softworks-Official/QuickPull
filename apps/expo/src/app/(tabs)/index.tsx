import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'

export default function Index() {
    return (
        <SafeAreaView className="bg-background">
            {/* Changes page title visible on the header */}
            <Stack.Screen
                options={{
                    title: 'Collections',
                    headerTintColor: '#fff',
                }}
            />
            <View className="h-full w-full bg-background p-4">
                <Text className="pb-2 text-5xl font-bold text-foreground">
                    Hello, World!
                </Text>
            </View>
        </SafeAreaView>
    )
}
