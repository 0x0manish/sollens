import { getUser } from "@civic/auth-web3/nextjs"
import { Search, ArrowLeft, ExternalLink, Copy, Shield, FileText, Activity, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { redirect } from 'next/navigation'
import { UserProfile } from "@/components/UserProfile"
import { EnhancedSearchForm } from "@/components/EnhancedSearchForm"
import { TransactionDetails } from "@/components/TransactionDetails"

// Define types for the async params
type PageProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TransactionDetailsPage({ params, searchParams }: PageProps) {
  const user = await getUser()
  
  // Redirect to login if user is not authenticated
  if (!user) {
    redirect('/login')
  }
  
  // Get transaction signature from query parameters using await
  const resolvedSearchParams = await searchParams;
  const signature = resolvedSearchParams.signature as string || "";
  const hasSignature = !!signature;
  
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
        {/* Search box centered */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-3xl">
            <EnhancedSearchForm />
          </div>
        </div>
        
        {!hasSignature ? (
          // No signature provided - show empty state
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">
            <div className="max-w-md mx-auto">
              <FileText className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h2 className="text-2xl font-bold mb-3">No Transaction Selected</h2>
              <p className="text-slate-400 mb-6">
                Please enter a Solana transaction signature in the search bar above to view 
                detailed information about the transaction.
              </p>
              
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                <Link href="/dashboard">Go to Search</Link>
              </Button>
            </div>
          </div>
        ) : (
          // Transaction data via our component
          <TransactionDetails signature={signature} />
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
