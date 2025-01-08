import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useOAuth, useSignIn } from '@clerk/clerk-expo'
import { OAuthStrategy } from '@clerk/types'
import { Zap } from 'lucide-react-native'

import { IconSymbol } from '~/components/ui/icon-symbol.ios'

export default function SignInPage() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    if (!isLoaded) {
        return <Text>Loading...</Text>
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 items-center justify-center gap-5 px-10 pt-5">
                <Zap className="text-blue-600" size={35} />
                <View className="flex flex-col items-center justify-center gap-1 pb-5">
                    <Text className="text-2xl font-bold text-foreground">
                        Sign In To QuickPull
                    </Text>
                    <Text className="text-lg text-muted-foreground">
                        Welcome back! Please sign in to continue
                    </Text>
                </View>
                <View className="flex flex-row items-center justify-between gap-10 pb-5">
                    <OAuthButton
                        strategy={'oauth_discord'}
                        title="Discord"
                        image={<IconSymbol name="dishwasher" color="#000" />}
                    />
                    <OAuthButton
                        strategy={'oauth_google'}
                        title="Google"
                        image={<IconSymbol name="arrow.uturn.down" color="#000" />}
                    />
                </View>
                <View className="flex w-full flex-row items-center justify-between gap-5 pb-5">
                    <View className="h-px flex-1 bg-muted-foreground/60" />
                    <Text className="text-muted-foreground">OR</Text>
                    <View className="h-px flex-1 bg-muted-foreground/60" />
                </View>
                <TextInput
                    placeholder="Email"
                    className="w-full rounded-md bg-input p-5 text-foreground"
                    inputMode="email"
                />
                <Pressable className="flex w-full flex-row items-center justify-center gap-3 rounded-md bg-primary px-5 py-3 transition-all duration-200 ease-in-out active:bg-primary/80">
                    <Text className="text-center">Continue</Text>
                    <IconSymbol name="chevron.right" color="#000" size={10} />
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

function OAuthButton(props: {
    strategy: OAuthStrategy
    title: string
    image: React.ReactNode
}) {
    const { startOAuthFlow } = useOAuth({ strategy: props.strategy })

    return (
        <Pressable
            className="flex flex-row items-center gap-2 rounded-md bg-white px-5 py-2 active:bg-white/80"
            onPress={async () => {
                await startOAuthFlow()
            }}
        >
            {props.image}
            <Text>{props.title}</Text>
        </Pressable>
    )
}
