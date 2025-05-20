import { Search, ArrowLeft, History } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@/components/UserProfile";
import { TokenHistory } from "@/components/TokenHistory";

export default async function TokenHistoryPage() {
  
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
        {/* Back button */}
        <Link href="/dashboard" className="inline-flex items-center text-slate-300 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <History className="h-5 w-5 mr-2 text-emerald-500" />
            Token Analysis History
          </h3>
          
          <TokenHistory />
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
  );
} 