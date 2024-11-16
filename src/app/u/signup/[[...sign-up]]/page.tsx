import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
    return <SignUp routing="path" path="/u/signup" signInUrl="/u/login" />
}
