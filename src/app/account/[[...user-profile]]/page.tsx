import { UserProfile } from '@clerk/nextjs'

export default function AccountPage() {
    return (
        <div className="flex w-full justify-center items-center">
            <UserProfile />
        </div>
    )
}
