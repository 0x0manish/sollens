"use client";

import { Search } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-emerald-500 p-3 rounded-lg">
            <Search className="h-6 w-6 text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold">SolanaLens</h1>
        </div>
        
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold">Loading your dashboard</h2>
          <p className="text-slate-400">Preparing your token analysis tools...</p>
        </div>
      </div>
    </div>
  );
} 