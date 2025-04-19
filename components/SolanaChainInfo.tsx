"use client";

import { useState, useEffect } from 'react';
import { Activity, Layers, Cpu, Zap, Loader2, AlertTriangle } from 'lucide-react';
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
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const fetchChainInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/solana/chaininfo', {
          // Add a timeout to prevent the request from hanging
          signal: AbortSignal.timeout(8000)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Solana chain information (${response.status})`);
        }
        
        const result = await response.json();
        
        // Check for API warnings (like when using fallback data)
        if (result.warning) {
          setWarning(result.warning);
          console.warn('Solscan API warning:', result.warning);
        }
        
        // Handle API errors that still return a 200 status
        if (!result.success) {
          throw new Error(result.error || 'Unknown error from chain info API');
        }
        
        // Validate the data structure
        if (!result.data) {
          throw new Error('Missing data in API response');
        }
        
        // Type check and ensure all fields exist
        const chainData: ChainInfoData = {
          blockHeight: typeof result.data.blockHeight === 'number' ? result.data.blockHeight : 0,
          currentEpoch: typeof result.data.currentEpoch === 'number' ? result.data.currentEpoch : 0,
          absoluteSlot: typeof result.data.absoluteSlot === 'number' ? result.data.absoluteSlot : 0,
          transactionCount: typeof result.data.transactionCount === 'number' ? result.data.transactionCount : 0
        };
        
        setData(chainData);
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

  if (error && !data) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="text-center py-8">
          <p className="text-red-400 mb-2">{error}</p>
          <p className="text-slate-400 text-sm">Please check your network connection and Solscan API configuration.</p>
        </div>
      </div>
    );
  }

  // Zero values might indicate fallback/placeholder data
  const isUsingFallbackData = data && 
    data.blockHeight === 0 && 
    data.currentEpoch === 0 && 
    data.absoluteSlot === 0 && 
    data.transactionCount === 0;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h3 className="text-xl font-semibold mb-2 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-emerald-500" />
        Solana Network Status
      </h3>
      
      {/* Display warning if using placeholder data */}
      {(warning || isUsingFallbackData) && (
        <div className="mb-6 flex items-center bg-amber-500/20 text-amber-200 text-sm p-2 rounded">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <p>{warning || "Using placeholder data. Live data unavailable."}</p>
        </div>
      )}
      {!warning && !isUsingFallbackData && <div className="mb-6"></div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-700/30 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <div className="bg-emerald-500/20 rounded-full p-2 mr-2">
                <Layers className="h-5 w-5 text-emerald-500" />
              </div>
              <h4 className="text-sm font-medium text-slate-300">Block Height</h4>
            </div>
            <div className="text-2xl font-bold">{formatNumber(data?.blockHeight || 0)}</div>
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
            <div className="text-2xl font-bold">{formatNumber(data?.currentEpoch || 0)}</div>
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
            <div className="text-2xl font-bold">{formatNumber(data?.absoluteSlot || 0)}</div>
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
            <div className="text-2xl font-bold">{formatNumber(data?.transactionCount || 0)}</div>
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
