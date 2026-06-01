import { treaty } from '@elysiajs/eden'
import type { app } from '@/app/api/v1/[[...slugs]]/route'

const baseUrl =
  typeof window === 'undefined'
    ? (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000')
    : ''

export const api = treaty<typeof app>(baseUrl).api
