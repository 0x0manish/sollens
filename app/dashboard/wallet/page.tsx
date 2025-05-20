import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/UserProfile"
import { WalletAnalysis } from "@/components/WalletAnalysis"
import { EnhancedSearchForm } from "@/components/EnhancedSearchForm"
import { DashboardHeader } from "@/components/DashboardHeader"

// Define types for the async params
type PageProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function WalletAnalysisPage({ params, searchParams }: PageProps) {
  
  // Get wallet address from query parameters using await
  const resolvedSearchParams = await searchParams;
  const walletAddress = resolvedSearchParams.address as string || "";
  const hasWallet = !!walletAddress;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header with Back to Dashboard button */}
      <DashboardHeader showBackButton={true} />

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-10 flex-grow">
        {/* Search box centered */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-3xl">
            <EnhancedSearchForm />
          </div>
        </div>
        
        {!hasWallet ? (
          // No wallet address provided - show empty state
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h2 className="text-2xl font-bold mb-3">No Wallet Selected</h2>
              <p className="text-slate-400 mb-6">
                Please enter a Solana wallet address in the search bar to analyze its transaction history, 
                risk factors, and token holdings.
              </p>
              
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                <Link href="/dashboard">Go to Search</Link>
              </Button>
            </div>
          </div>
        ) : (
          // Wallet data via our component
          <WalletAnalysis walletAddress={walletAddress} />
        )}
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
