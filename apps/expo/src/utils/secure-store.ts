import * as SecureStore from 'expo-secure-store'

interface TokenCache {
    getToken: (key: string) => string | null
    getClerkToken: (key: string) => Promise<string | null>
    deleteToken: (key: string) => Promise<void>
    saveToken: (key: string, token: string) => Promise<void>
}

const createTokenCache = (): TokenCache => {
    return {
        getToken: (key: string) => {
            try {
                const item = SecureStore.getItem(key) as unknown as string | null

                if (item) {
                    console.log(`${key} was used 🔐 \n`)
                } else {
                    console.log('No values stored under key: ' + key)
                }

                return item
            } catch (error) {
                console.error('secure store get item error: ', error)

                return null
            }
        },
        getClerkToken: async (key: string) => {
            try {
                const item = (await SecureStore.getItemAsync(key)) as unknown as
                    | string
                    | null

                if (item) {
                    console.log(`${key} was used 🔐 \n`)
                } else {
                    console.log('No values stored under key: ' + key)
                }

                return item
            } catch (error) {
                console.error('secure store get item error: ', error)
                await SecureStore.deleteItemAsync(key)

                return null
            }
        },
        deleteToken: async (key: string) => {
            return await SecureStore.deleteItemAsync(key)
        },
        saveToken: async (key: string, token: string) => {
            return await SecureStore.setItemAsync(key, token)
        },
    }
}

// SecureStore is not supported on the web
export const tokenCache = createTokenCache()
