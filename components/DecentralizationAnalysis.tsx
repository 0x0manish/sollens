"use client";

import { Network, Server, BarChart3 } from "lucide-react";
import { DecentralizationData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface DecentralizationAnalysisProps {
  data: DecentralizationData | null;
  loading: boolean;
}

export function DecentralizationAnalysis({ data, loading }: DecentralizationAnalysisProps) {
  if (loading) {
    return <DecentralizationSkeleton />;
  }

  if (!data || data.status !== "OK") {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center space-x-2 mb-2">
          <Network className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-semibold">Decentralization Analysis</h2>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Decentralization data is currently unavailable for this token.
        </p>
      </div>
    );
  }

  const { decentralisation_score, identified_supply } = data;
  
  // Helper function to determine score color
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-500";
    if (score >= 50) return "text-amber-400";
    return "text-red-500";
  };
  
  // Helper function to determine score description
  const getScoreDescription = (score: number) => {
    if (score >= 75) return "Highly Decentralized";
    if (score >= 50) return "Moderately Decentralized";
    if (score >= 25) return "Partially Centralized";
    return "Highly Centralized";
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Network className="h-5 w-5 text-emerald-500" />
        <h2 className="text-xl font-semibold">Decentralization Analysis</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Decentralization Score */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Network className="h-5 w-5 text-emerald-500 mr-2" />
            <h3 className="font-medium">Decentralization Score</h3>
          </div>
          
          <div className="flex items-end mb-2">
            <span className={`text-4xl font-bold ${getScoreColor(decentralisation_score)}`}>
              {decentralisation_score.toFixed(1)}
            </span>
            <span className="text-slate-400 ml-1 mb-1">/100</span>
          </div>
          
          <p className="text-sm text-slate-300">
            {getScoreDescription(decentralisation_score)}
          </p>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Centralized</span>
              <span className="text-slate-400">Decentralized</span>
            </div>
            <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  decentralisation_score >= 75 ? "bg-emerald-500" : 
                  decentralisation_score >= 50 ? "bg-amber-400" : 
                  decentralisation_score >= 25 ? "bg-amber-500" : "bg-red-500"
                }`} 
                style={{ width: `${decentralisation_score}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Supply in CEXs */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Server className="h-5 w-5 text-emerald-500 mr-2" />
            <h3 className="font-medium">Supply in Exchanges</h3>
          </div>
          
          <div className="flex items-end mb-2">
            <span className="text-4xl font-bold">
              {identified_supply.percent_in_cexs.toFixed(2)}
            </span>
            <span className="text-slate-400 ml-1 mb-1">%</span>
          </div>
          
          <p className="text-sm text-slate-300">
            Percentage of total supply held on centralized exchanges
          </p>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">0%</span>
              <span className="text-slate-400">100%</span>
            </div>
            <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${identified_supply.percent_in_cexs}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Supply in Contracts */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <BarChart3 className="h-5 w-5 text-emerald-500 mr-2" />
            <h3 className="font-medium">Supply in Contracts</h3>
          </div>
          
          <div className="flex items-end mb-2">
            <span className="text-4xl font-bold">
              {identified_supply.percent_in_contracts.toFixed(2)}
            </span>
            <span className="text-slate-400 ml-1 mb-1">%</span>
          </div>
          
          <p className="text-sm text-slate-300">
            Percentage of total supply held in smart contracts
          </p>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">0%</span>
              <span className="text-slate-400">100%</span>
            </div>
            <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500" 
                style={{ width: `${identified_supply.percent_in_contracts}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-slate-400 text-right">
        Powered by Bubblemaps
      </div>
    </div>
  );
}

function DecentralizationSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Network className="h-5 w-5 text-emerald-500" />
        <h2 className="text-xl font-semibold">Decentralization Analysis</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Skeleton className="h-5 w-5 bg-slate-700 mr-2" />
              <Skeleton className="h-5 w-32 bg-slate-700" />
            </div>
            
            <Skeleton className="h-10 w-20 bg-slate-700 mb-2" />
            <Skeleton className="h-4 w-full bg-slate-700 mb-3" />
            
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Skeleton className="h-3 w-16 bg-slate-700" />
                <Skeleton className="h-3 w-16 bg-slate-700" />
              </div>
              <Skeleton className="h-2 w-full bg-slate-700 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 