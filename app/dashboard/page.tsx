import { getUser } from "@civic/auth-web3/nextjs"
import { Search, History } from "lucide-react"
import Link from "next/link"
import { redirect } from 'next/navigation'
import { UserProfile } from "@/components/UserProfile"
import { RecentTokens } from "@/components/RecentTokens"
import { TokenSearchForm } from "@/components/TokenSearchForm"

export default async function DashboardPage() {
  const user = await getUser()
  
  // Redirect to login if user is not authenticated
  if (!user) {
    redirect('/login')
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Search className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold">Sollens</h1>
        </Link>
        
        <UserProfile />
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-10 flex-grow">
        {/* Main search bar */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="absolute -inset-0.5 bg-emerald-500/30 rounded-xl blur"></div>
          <div className="relative bg-slate-800 rounded-lg p-4 flex items-center">
            <TokenSearchForm />
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mb-12">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <History className="h-5 w-5 mr-2 text-emerald-500" />
              Recent Analysis Activity
            </h3>
            
            <div className="space-y-4">
              <RecentTokens />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 w-full mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Sollens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 