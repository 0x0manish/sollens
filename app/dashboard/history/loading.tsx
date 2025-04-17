import { Search, ArrowLeft, History } from "lucide-react"
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
          <h1 className="text-xl font-bold">Sollens</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full bg-slate-700" />
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-10 flex-grow">
        {/* Back button */}
        <div className="inline-flex items-center text-slate-300 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <Skeleton className="h-5 w-32 bg-slate-700" />
        </div>
        
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center mb-6">
            <History className="h-5 w-5 mr-2 text-emerald-500" />
            <Skeleton className="h-7 w-48 bg-slate-700" />
          </div>
          
          <div className="flex justify-end mb-4">
            <Skeleton className="h-9 w-32 bg-slate-700 rounded-md" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-slate-700">
                  <th className="py-3 px-4">
                    <Skeleton className="h-5 w-20 bg-slate-700" />
                  </th>
                  <th className="py-3 px-4">
                    <Skeleton className="h-5 w-16 bg-slate-700" />
                  </th>
                  <th className="py-3 px-4">
                    <Skeleton className="h-5 w-24 bg-slate-700" />
                  </th>
                  <th className="py-3 px-4 text-right">
                    <Skeleton className="h-5 w-16 bg-slate-700 ml-auto" />
                  </th>
                  <th className="py-3 px-4 text-right">
                    <Skeleton className="h-5 w-20 bg-slate-700 ml-auto" />
                  </th>
                  <th className="py-3 px-4 text-right">
                    <Skeleton className="h-5 w-16 bg-slate-700 ml-auto" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-8 h-8 bg-slate-700 rounded-full" />
                        <Skeleton className="h-5 w-24 bg-slate-700" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-5 w-12 bg-slate-700" />
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-5 w-32 bg-slate-700" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Skeleton className="h-5 w-20 bg-slate-700 ml-auto" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Skeleton className="h-5 w-24 bg-slate-700 ml-auto" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Skeleton className="h-8 w-8 bg-slate-700 rounded-md" />
                        <Skeleton className="h-8 w-8 bg-slate-700 rounded-md" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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