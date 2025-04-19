"use client";

import { useState, useEffect } from 'react';
import { Activity, Layers, Cpu, Zap, Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

type ChainInfoData = {
  blockHeight: number;
  currentEpoch: number;
  absoluteSlot: number;
  transactionCount: number;
};

export function SolanaChainInfo() {
  const [data, setData] = useState<ChainInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChainInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/solana/chaininfo');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Solana chain information');
        }
        
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error('Error fetching Solana chain info:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chain information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChainInfo();
    
    // Refresh data every 60 seconds
    const intervalId = setInterval(fetchChainInfo, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <span className="ml-3 text-slate-300">Loading Solana blockchain data...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="text-center py-8">
          <p className="text-red-400">{error || 'No blockchain data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-emerald-500" />
        Solana Network Status
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-700/30 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <div className="bg-emerald-500/20 rounded-full p-2 mr-2">
                <Layers className="h-5 w-5 text-emerald-500" />
              </div>
              <h4 className="text-sm font-medium text-slate-300">Block Height</h4>
            </div>
            <div className="text-2xl font-bold">{formatNumber(data.blockHeight)}</div>
            <p className="text-xs text-slate-400 mt-1">Current blockchain height</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/30 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <div className="bg-emerald-500/20 rounded-full p-2 mr-2">
                <Cpu className="h-5 w-5 text-emerald-500" />
              </div>
              <h4 className="text-sm font-medium text-slate-300">Current Epoch</h4>
            </div>
            <div className="text-2xl font-bold">{formatNumber(data.currentEpoch)}</div>
            <p className="text-xs text-slate-400 mt-1">Validator voting period</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/30 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <div className="bg-emerald-500/20 rounded-full p-2 mr-2">
                <Zap className="h-5 w-5 text-emerald-500" />
              </div>
              <h4 className="text-sm font-medium text-slate-300">Absolute Slot</h4>
            </div>
            <div className="text-2xl font-bold">{formatNumber(data.absoluteSlot)}</div>
            <p className="text-xs text-slate-400 mt-1">Total slots since genesis</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/30 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <div className="bg-emerald-500/20 rounded-full p-2 mr-2">
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
              <h4 className="text-sm font-medium text-slate-300">Transactions</h4>
            </div>
            <div className="text-2xl font-bold">{formatNumber(data.transactionCount)}</div>
            <p className="text-xs text-slate-400 mt-1">Total transactions processed</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Data source attribution */}
      <div className="flex justify-end mt-4">
        <p className="text-xs text-slate-400">Data source: Solscan Market Data API</p>
      </div>
    </div>
  );
}
