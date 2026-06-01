import { treaty } from '@elysiajs/eden'
import type { app } from '@/app/api/v1/[[...slugs]]/route'
import { APP_URL } from '@/constants/env'

const baseUrl = typeof window === 'undefined' ? APP_URL : ''

export const api = treaty<typeof app>(baseUrl).api
