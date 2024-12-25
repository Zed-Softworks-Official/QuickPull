import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return <SignIn routing="path" path="/u/login" signUpUrl="/u/signup" />
}
