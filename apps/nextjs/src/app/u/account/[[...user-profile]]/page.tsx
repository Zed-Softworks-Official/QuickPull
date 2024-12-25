import { UserProfile } from '@clerk/nextjs'

export default function AccountPage() {
    return <UserProfile path="/u/account" routing="path" />
}
