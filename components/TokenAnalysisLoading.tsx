"use client";

import { Search, Shield, BarChart3, Users } from "lucide-react";

export function TokenAnalysisLoading() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col items-center">
      <div className="py-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Main animated loader */}
        <div className="relative w-64 h-64 mb-8">
          {/* Rotating dashed circle */}
          <div className="absolute inset-0 -rotate-45 border-dashed border-2 border-emerald-500/30 rounded-full animate-pulse"></div>
          
          {/* Orbiting icons */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-700 p-2 rounded-full border border-slate-600 shadow-lg">
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s', animationDelay: '1s' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-slate-700 p-2 rounded-full border border-slate-600 shadow-lg">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s', animationDelay: '2s' }}>
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 bg-slate-700 p-2 rounded-full border border-slate-600 shadow-lg">
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          
          {/* Center pulsing search icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-500/40 rounded-full animate-pulse"></div>
              <div className="relative bg-emerald-500 p-4 rounded-full shadow-lg shadow-emerald-500/20">
                <Search className="h-8 w-8 text-slate-900" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold mb-2">Analyzing Token</h2>
          <p className="text-slate-400 mb-4 max-w-xs">
            Processing on-chain data and market metrics...
          </p>
          <div className="relative bg-slate-700/50 h-1.5 w-48 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/70 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 