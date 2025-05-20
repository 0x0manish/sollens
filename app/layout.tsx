import type { Metadata } from 'next'
import './globals.css'
import { SolanaWalletProvider } from "@/components/SolanaWalletProvider"
import '@solana/wallet-adapter-react-ui/styles.css'
import { GlobalLoadingProvider } from '@/components/GlobalLoadingProvider'

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
    <html lang="en" className="bg-slate-900">
      <body className="bg-slate-900 text-white min-h-screen">
        <GlobalLoadingProvider>
          <SolanaWalletProvider>
            {children}
          </SolanaWalletProvider>
        </GlobalLoadingProvider>
      </body>
    </html>
  )
}
