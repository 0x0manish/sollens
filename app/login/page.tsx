import { UserButton } from "@civic/auth-web3/react"
import { getUser } from "@civic/auth-web3/nextjs"
import { Search, CircleUser } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // Check if user is already authenticated
  const user = await getUser()
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Search className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold">SolanaLens</h1>
        </Link>
      </header>

      {/* Login Section */}
      <div className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-emerald-500/30 rounded-2xl blur-xl"></div>
            <div className="relative bg-slate-800 p-8 rounded-xl border border-slate-700">
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  <CircleUser className="h-12 w-12 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Sign in to SolanaLens</h2>
                <p className="text-slate-300">
                  Your secure gateway to comprehensive Solana token analysis
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                  <p className="mb-4">Sign in securely with Civic Identity</p>
                  <div className="flex justify-center">
                    <UserButton />
                  </div>
                </div>
                
                <div className="text-center text-sm text-slate-400">
                  <p>
                    By signing in, you agree to our terms and privacy policy. Your data is encrypted and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 w-full mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center text-slate-400">
            <p>© {new Date().getFullYear()} SolanaLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 