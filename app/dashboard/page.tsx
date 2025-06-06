import { Search, History } from "lucide-react"
import Link from "next/link"
import { UserProfile } from "@/components/UserProfile"
import { RecentActivity } from "@/components/RecentActivity"
import { EnhancedSearchForm } from "@/components/EnhancedSearchForm"
import { SolanaDexMetrics } from "@/components/SolanaDexMetrics"
import { SolanaMindshare } from "@/components/SolanaMindshare"
import { SolanaChainInfo } from "@/components/SolanaChainInfo"
import { DashboardHeader } from "@/components/DashboardHeader"

export default async function DashboardPage() {
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Dashboard header without back button */}
      <DashboardHeader showBackButton={false} />

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-10 flex-grow">
        {/* Main search bar */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="absolute -inset-0.5 bg-emerald-500/30 rounded-xl blur"></div>
          <div className="relative bg-slate-800 rounded-lg p-4 flex items-center">
            <EnhancedSearchForm />
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
              <RecentActivity />
            </div>
          </div>
        </div>
        
        {/* Solana Chain Info */}
        <div className="mb-12">
          <SolanaChainInfo />
        </div>
        
        {/* Solana Mindshare */}
        <div className="mb-12">
          <SolanaMindshare />
        </div>
        
        {/* Solana DEX Metrics */}
        <div className="mb-12">
          <SolanaDexMetrics />
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