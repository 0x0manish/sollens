"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { History, ExternalLink, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatUSD } from '@/lib/utils';

interface RecentToken {
  address: string;
  name: string;
  symbol: string;
  logo: string | null;
  price: number;
  timestamp: number;
}

export function RecentTokens() {
  const [recentTokens, setRecentTokens] = useState<RecentToken[]>([]);
  
  // Load recent tokens from local storage
  useEffect(() => {
    const storedTokens = localStorage.getItem('recentTokens');
    if (storedTokens) {
      try {
        const parsedTokens = JSON.parse(storedTokens);
        setRecentTokens(parsedTokens);
      } catch (error) {
        console.error('Failed to parse recent tokens:', error);
      }
    }
  }, []);
  
  // Clear recent tokens
  const clearHistory = () => {
    localStorage.removeItem('recentTokens');
    setRecentTokens([]);
  };
  
  if (recentTokens.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-6 text-center">
        <p className="text-slate-400 mb-4">No recent token analysis activity</p>
        <p className="text-sm text-slate-500">
          Search for a Solana token above to analyze its security, liquidity and holder distribution
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {recentTokens.slice(0, 5).map((token) => (
        <div 
          key={token.address} 
          className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition"
        >
          <Link href={`/dashboard/analysis?tokenAddress=${token.address}`} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-700 rounded-full overflow-hidden flex items-center justify-center">
                {token.logo ? (
                  <Image 
                    src={token.logo} 
                    alt={token.name} 
                    width={40} 
                    height={40} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <DollarSign className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div>
                <div className="font-medium">{token.name}</div>
                <div className="text-sm text-slate-400">{token.symbol}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-medium">{formatUSD(token.price)}</div>
              <div className="text-xs text-slate-400">
                {new Date(token.timestamp).toLocaleDateString()}
              </div>
            </div>
          </Link>
        </div>
      ))}
      
      <div className="flex justify-between items-center pt-2">
        <Button 
          variant="outline" 
          className="border-emerald-500 border text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
          asChild
        >
          <Link href="/dashboard/history">View All Activity</Link>
        </Button>
        
        <Button 
          variant="ghost" 
          className="text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
          onClick={clearHistory}
        >
          Clear History
        </Button>
      </div>
    </div>
  );
} 