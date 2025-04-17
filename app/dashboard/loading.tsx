import { Search, Shield, BarChart3, Users, Sparkles, History } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

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
        
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full bg-slate-700" />
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-10 flex-grow">
        {/* Main search bar */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="absolute -inset-0.5 bg-emerald-500/30 rounded-xl blur"></div>
          <div className="relative bg-slate-800 rounded-lg p-4 flex items-center">
            <Skeleton className="bg-slate-700 rounded-lg h-12 flex-grow" />
            <Skeleton className="h-12 w-32 bg-emerald-500/50 ml-3 rounded-lg" />
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mb-12">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center mb-6">
              <History className="h-5 w-5 mr-2 text-emerald-500" />
              <Skeleton className="h-7 w-48 bg-slate-700" />
            </div>
            
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 bg-slate-700 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 bg-slate-700 mb-1" />
                        <Skeleton className="h-4 w-16 bg-slate-700" />
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Skeleton className="h-5 w-20 bg-slate-700 mb-1" />
                      <Skeleton className="h-4 w-16 bg-slate-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Analysis Tools */}
        <div className="flex items-center mb-6">
          <Sparkles className="h-6 w-6 mr-2 text-emerald-500" />
          <Skeleton className="h-8 w-48 bg-slate-700" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <Skeleton className="bg-slate-700/50 w-12 h-12 rounded-lg mb-4" />
              <Skeleton className="h-7 w-40 bg-slate-700 mb-2" />
              <Skeleton className="h-4 w-full bg-slate-700 mb-2" />
              <Skeleton className="h-4 w-5/6 bg-slate-700 mb-6" />
              <Skeleton className="h-10 w-full bg-slate-700 rounded-lg" />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 w-full mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Skeleton className="h-5 w-64 bg-slate-800 mx-auto" />
          </div>
        </div>
      </footer>
    </div>
  )
} 