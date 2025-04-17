"use client";

import { useState, useEffect } from "react";
import { Wallet, Percent, Loader2, ExternalLink } from "lucide-react";
import { formatNumber } from "@/lib/utils";

type TokenHolder = {
  address: string;
  amount: number;
  percentage: number;
  is_contract: boolean;
  is_exchange?: boolean;
  name?: string;
  transaction_count: number;
};

type TokenHoldersProps = {
  tokenAddress: string;
};

export function TokenHolders({ tokenAddress }: TokenHoldersProps) {
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<{
    symbol: string;
    full_name: string;
  } | null>(null);

  useEffect(() => {
    async function fetchHolders() {
      if (!tokenAddress) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://api-legacy.bubblemaps.io/map-data?token=${tokenAddress}&chain=sol`);
        
        if (!response.ok) {
          throw new Error(`Error fetching holder data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort by percentage (highest first) and take top 20
        const sortedHolders = [...data.nodes].sort((a, b) => b.percentage - a.percentage).slice(0, 20);
        
        setHolders(sortedHolders);
        setTokenInfo({
          symbol: data.symbol,
          full_name: data.full_name
        });
      } catch (err) {
        console.error("Error fetching token holders:", err);
        setError("Failed to load token holder data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchHolders();
  }, [tokenAddress]);

  function shortenAddress(address: string): string {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <span className="ml-3 text-slate-300">Loading holder data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="text-center py-8 text-slate-300">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Wallet className="h-5 w-5 mr-2 text-emerald-500" />
        Top 20 Token Holders {tokenInfo?.symbol && `(${tokenInfo.symbol})`}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="pb-3 pr-4 text-slate-400 font-medium text-sm">Rank</th>
              <th className="pb-3 pr-4 text-slate-400 font-medium text-sm">Address</th>
              <th className="pb-3 pr-4 text-slate-400 font-medium text-sm text-right">Balance</th>
              <th className="pb-3 text-slate-400 font-medium text-sm text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((holder, index) => (
              <tr key={holder.address} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="py-3 pr-4 font-mono text-sm">
                  <div className="flex items-center">
                    <span className="text-emerald-500 font-semibold">#{index + 1}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 font-mono text-sm">
                  <div className="flex items-center">
                    {holder.is_exchange && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full mr-2">
                        Exchange
                      </span>
                    )}
                    {holder.is_contract && !holder.is_exchange && (
                      <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full mr-2">
                        Contract
                      </span>
                    )}
                    <a 
                      href={`https://solscan.io/account/${holder.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-slate-300 hover:text-emerald-400 transition-colors"
                    >
                      {holder.name || shortenAddress(holder.address)}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right font-mono text-sm text-slate-300">
                  {formatNumber(holder.amount)}
                </td>
                <td className="py-3 text-right font-mono text-sm">
                  <div className="flex items-center justify-end">
                    <span className={`${holder.percentage > 5 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {holder.percentage.toFixed(2)}%
                    </span>
                    <div className="h-1.5 w-16 bg-slate-700 rounded-full ml-2 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(holder.percentage * 2, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 