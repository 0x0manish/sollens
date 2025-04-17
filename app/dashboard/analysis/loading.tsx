import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Search } from "lucide-react"
import { TokenAnalysisLoading } from "@/components/TokenAnalysisLoading"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Search className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold">SolanaLens</h1>
        </Link>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-10 flex-grow">
        {/* Back button */}
        <div className="inline-flex items-center text-slate-300 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <Link href="/dashboard" className="hover:text-white">Back to Dashboard</Link>
        </div>
        
        {/* Card container */}
        <div className="max-w-4xl mx-auto">
          <TokenAnalysisLoading />
        </div>
      </main>

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