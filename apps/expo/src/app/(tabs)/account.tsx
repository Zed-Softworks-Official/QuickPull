import { Pressable, SafeAreaView, Text, View } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'

export default function Settings() {
    const { signOut } = useAuth()

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 px-10 pt-5">
                <Text className="pb-2 text-2xl font-bold text-foreground">Account</Text>
                <Pressable
                    className="flex flex-row items-center justify-center rounded-md bg-white px-2 py-3"
                    onPress={() => {
                        void signOut()
                    }}
                >
                    <Text className="text-black">Logout</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}
