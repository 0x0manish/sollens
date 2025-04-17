import { authMiddleware } from '@civic/auth-web3/nextjs/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default authMiddleware({
  exclude: ['/', '/login']
})

export const config = {
  // Match all request paths except public assets and resources
  matcher: [
    '/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif).*)',
  ],
} 