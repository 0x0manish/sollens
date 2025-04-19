"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ArrowLeft } from "lucide-react";
import { UserProfile } from "@/components/UserProfile";

interface DashboardHeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
}

export function DashboardHeader({ showBackButton = false, backUrl = "/dashboard" }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [isInsideAnalysisPage, setIsInsideAnalysisPage] = useState(false);
  
  useEffect(() => {
    // Check if we're not on the main dashboard page
    const isDashboardPath = pathname === "/dashboard";
    setIsInsideAnalysisPage(!isDashboardPath);
  }, [pathname]);
  
  return (
    <header className="container mx-auto py-6 px-4 flex justify-between items-center border-b border-slate-800">
      <div className="flex items-center gap-2">
        {/* Logo that links to dashboard for authenticated users */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Search className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold">Sollens</h1>
        </Link>
        
        {/* Conditional back button */}
        {showBackButton && isInsideAnalysisPage && (
          <Link 
            href={backUrl}
            className="ml-4 flex items-center text-slate-400 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-slate-700/50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Dashboard</span>
          </Link>
        )}
      </div>
      
      <UserProfile />
    </header>
  );
}
