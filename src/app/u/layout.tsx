export default function UserLayout(props: { children: React.ReactNode }) {
    return (
        <div className="flex w-full justify-center items-center container mx-auto">
            {props.children}
        </div>
    )
}
