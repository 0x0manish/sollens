import type { Metadata } from 'next'
import './globals.css'
import { CivicAuthProvider } from "@civic/auth-web3/nextjs"

export const metadata: Metadata = {
  title: 'Sollens - Verify Solana Tokens',
  description: 'Comprehensive analysis and verification for Solana tokens',
  generator: 'v0.dev',
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
