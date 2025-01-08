'use client'

import { generateReactHelpers } from '@uploadthing/react'

import type { QuickpullFileRouter } from '@quickpull/uploadthing'

export const { useUploadThing } = generateReactHelpers<QuickpullFileRouter>()
