import { fontFamily } from 'tailwindcss/defaultTheme'
import { withUt } from 'uploadthing/tw'

import baseConfig from '@quickpull/tailwind-config/web'

export default withUt({
    darkMode: ['class'],
    content: [...baseConfig.content, '../../packages/ui/src/*.{ts,tsx}'],
    presets: [baseConfig],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-geist-sans)', ...fontFamily.sans],
                mono: ['var(--font-geist-mono)', ...fontFamily.mono],
            },
        },
    },

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [require('tailwindcss-animate')],
})
