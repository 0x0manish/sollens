import type { Metadata } from 'next'
import './globals.css'
import { CivicAuthProvider } from "@civic/auth-web3/nextjs"

export const metadata: Metadata = {
  title: 'Sollens - Verify Solana Tokens',
  description: 'Comprehensive analysis and verification for Solana tokens',
  generator: 'v0.dev',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
    apple: {
      url: '/favicon.svg',
      type: 'image/svg+xml',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <CivicAuthProvider>
          {children}
        </CivicAuthProvider>
      </body>
    </html>
  )
}
