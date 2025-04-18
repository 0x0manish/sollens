"use client";

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, Database, Loader2 } from 'lucide-react';
import { formatNumber, formatUSD } from '@/lib/utils';

type DexData = {
  name: string;
  volume24Hour: number;
  trades24Hour: number;
  assetsCount: number;
  marketsCount: number;
  type: string;
};

export function SolanaDexMetrics() {
  const [dexData, setDexData] = useState<DexData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDexData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dex/metrics');
        
        if (!response.ok) {
          throw new Error('Failed to fetch DEX data');
        }
        
        const data = await response.json();
        
        // Filter only Solana DEXes
        const solanaDexes = data.data.filter((dex: any) => 
          ['Orca (whirlpool)', 'Meteora (dlmm)', 'Raydium (CLMM)', 'Lifinity V2'].includes(dex.name)
        );
        
        // Map to our simplified format
        const formattedData = solanaDexes.map((dex: any) => ({
          name: dex.name,
          volume24Hour: dex.metrics.volume24Hour,
          trades24Hour: dex.metrics.trades24Hour,
          assetsCount: dex.metrics.assetsCount,
          marketsCount: dex.metrics.marketsCount,
          type: dex.type
        }));
        
        setDexData(formattedData);
      } catch (err) {
        console.error('Error fetching DEX metrics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load DEX data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDexData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        <span className="ml-3 text-slate-300">Loading DEX data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (dexData.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="text-center py-8">
          <p className="text-slate-400">No DEX data available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-emerald-500" />
        Solana DEX Activity
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dexData.map((dex) => (
          <div key={dex.name} className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-lg">{dex.name.split(' ')[0]}</h4>
              <div className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded-full">
                {dex.name.includes('(') ? dex.name.split('(')[1].replace(')', '') : 'DEX'}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-slate-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>24h Volume</span>
                </div>
                <div className="font-medium">{formatUSD(dex.volume24Hour)}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-slate-400">
                  <Activity className="h-4 w-4 mr-1" />
                  <span>24h Trades</span>
                </div>
                <div className="font-medium">{formatNumber(dex.trades24Hour)}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-slate-400">
                  <Database className="h-4 w-4 mr-1" />
                  <span>Markets</span>
                </div>
                <div className="font-medium">{formatNumber(dex.marketsCount)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-right text-slate-500">
        Data source: Messari Metrics API
      </div>
    </div>
  );
}
