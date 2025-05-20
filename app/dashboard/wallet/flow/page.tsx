import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/UserProfile"
import { TransactionFlowVisualization } from "@/components/TransactionFlowVisualization"
import { EnhancedSearchForm } from "@/components/EnhancedSearchForm"

// Define types for the async params
type PageProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TransactionFlowPage({ params, searchParams }: PageProps) {
  
  // Get wallet address from query parameters using await
  const resolvedSearchParams = await searchParams;
  const walletAddress = resolvedSearchParams.address as string || "";
  const hasWallet = !!walletAddress;
  
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
        {/* Back to wallet analysis */}
        {hasWallet && (
          <div className="mb-6">
            <Button variant="link" className="text-slate-400 hover:text-white px-0" asChild>
              <Link href={`/dashboard/wallet?address=${walletAddress}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Wallet Analysis
              </Link>
            </Button>
          </div>
        )}
        
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
                Please enter a Solana wallet address in the search bar to visualize its transaction flows
                and understand the connections between wallets.
              </p>
              
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                <Link href="/dashboard">Go to Search</Link>
              </Button>
            </div>
          </div>
        ) : (
          // Transaction Flow Visualization
          <div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-full">
                  <h1 className="text-xl font-bold mb-2">Transaction Flow Analysis</h1>
                  <p className="text-slate-400">
                    Visualize how funds move between this wallet and other addresses. Explore transaction paths,
                    filter by date and amount, and identify critical fund flows.
                  </p>
                </div>
              </div>
            </div>
            
            <TransactionFlowVisualization walletAddress={walletAddress} />
          </div>
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
