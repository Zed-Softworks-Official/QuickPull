import { env } from '~/env'

export default function imageKitLoader({
    src,
    width,
    quality,
}: {
    src: string
    width: number
    quality?: number
}) {
    const params = [`w-${width}`, `q-${quality ?? 80}`]
    return `https://ik.imagekit.io/${env.NEXT_PUBLIC_IMAGEKIT_ID}/${src}?tr=${params.join(',')}`
}
