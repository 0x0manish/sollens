"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { ExternalLink, DollarSign, Trash2 } from 'lucide-react';
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

export function TokenHistory() {
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
  
  // Remove a single token
  const removeToken = (address: string) => {
    const updatedTokens = recentTokens.filter(token => token.address !== address);
    setRecentTokens(updatedTokens);
    localStorage.setItem('recentTokens', JSON.stringify(updatedTokens));
  };
  
  if (recentTokens.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-8 text-center">
        <p className="text-slate-400 mb-4">No token analysis history</p>
        <p className="text-sm text-slate-500 mb-6">
          Your analyzed tokens will appear here.
        </p>
        <Button 
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
          asChild
        >
          <Link href="/dashboard">Analyze a Token</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="ghost" 
          className="text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
          onClick={clearHistory}
        >
          Clear All History
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-slate-700">
              <th className="py-3 px-4 text-slate-400 font-medium">Token</th>
              <th className="py-3 px-4 text-slate-400 font-medium">Symbol</th>
              <th className="py-3 px-4 text-slate-400 font-medium">Address</th>
              <th className="py-3 px-4 text-slate-400 font-medium text-right">Price</th>
              <th className="py-3 px-4 text-slate-400 font-medium text-right">Date</th>
              <th className="py-3 px-4 text-slate-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentTokens.map((token) => (
              <tr key={token.address} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-full overflow-hidden flex items-center justify-center">
                      {token.logo ? (
                        <Image 
                          src={token.logo} 
                          alt={token.name} 
                          width={32} 
                          height={32} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <DollarSign className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    <span className="font-medium">{token.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-300">{token.symbol}</td>
                <td className="py-4 px-4">
                  <span className="font-mono text-xs text-slate-400">
                    {token.address.substring(0, 8)}...{token.address.substring(token.address.length - 8)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right font-medium">{formatUSD(token.price)}</td>
                <td className="py-4 px-4 text-right text-slate-400 text-sm">
                  {new Date(token.timestamp).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                      asChild
                    >
                      <Link href={`/dashboard/analysis?tokenAddress=${token.address}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-slate-700/50"
                      onClick={() => removeToken(token.address)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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