"use client";

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  CircleDollarSign,
  Loader2,
  AlertTriangle,
  BarChart3,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  Landmark,
  Coins,
  RefreshCw
} from 'lucide-react';
import { formatUSD, formatNumber } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';

interface WalletPNLProps {
  walletAddress: string;
}

type ResolutionType = '7d' | '30d';

export function WalletPNL({ walletAddress }: WalletPNLProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPeriod, setIsChangingPeriod] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolution, setResolution] = useState<ResolutionType>('7d');

  useEffect(() => {
    async function fetchPNLData() {
      if (!walletAddress) return;
      
      try {
        // Only set full loading on initial load
        if (!data) {
          setIsLoading(true);
        } else {
          // Use a lighter loading state for period changes
          setIsChangingPeriod(true);
        }
        
        setError(null);
        
        const response = await fetch(`/api/wallet/pnl?address=${walletAddress}&resolution=${resolution}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('No trading activity found for this wallet');
          } else {
            throw new Error(`Failed to fetch PNL data: ${response.statusText}`);
          }
          setData(null);
          return;
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching wallet PNL data:', err);
        setError('Failed to load wallet PNL data');
        setData(null);
      } finally {
        setIsLoading(false);
        setIsChangingPeriod(false);
      }
    }
    
    fetchPNLData();
  }, [walletAddress, resolution]);

  // Format percentage with + sign for positive values
  const formatPercentage = (value: number) => {
    if (isNaN(value) || value === 0) return '0%';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Get color based on value (positive/negative)
  const getValueColor = (value: number) => {
    if (isNaN(value) || value === 0) return 'text-slate-400';
    return value > 0 ? 'text-emerald-400' : 'text-red-400';
  };

  // Format PNL value and add + sign for positive values
  const formatPNL = (value: number) => {
    if (isNaN(value) || value === 0) return '$0.00';
    return `${value > 0 ? '+' : ''}${formatUSD(value)}`;
  };
  
  // Get token image URL or return placeholder
  const getTokenImage = (token: any) => {
    if (!token) return null;
    if (token.tokenLogoUrl) return token.tokenLogoUrl;
    
    // Default logos for common tokens
    if (token.tokenSymbol === 'wSOL' || token.tokenSymbol === 'SOL') {
      return 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';
    }
    if (token.tokenSymbol === 'USDC') {
      return 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png';
    }
    if (token.tokenSymbol === 'USDT') {
      return 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png';
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mt-6">
        <div className="flex items-center mb-6">
          <div className="bg-slate-700/50 w-8 h-8 rounded-full flex items-center justify-center mr-3">
            <CircleDollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold">Trading Performance</h2>
        </div>
        
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <span className="ml-3 text-slate-300">Loading trading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mt-6">
        <div className="flex items-center mb-6">
          <div className="bg-slate-700/50 w-8 h-8 rounded-full flex items-center justify-center mr-3">
            <CircleDollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold">Trading Performance</h2>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Trading Data Available</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            {error === 'No trading activity found for this wallet' 
              ? "This wallet doesn't have any recent trading activity that we could analyze." 
              : "We couldn't retrieve trading performance data for this wallet at the moment."}
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.summary) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mt-6">
        <div className="flex items-center mb-6">
          <div className="bg-slate-700/50 w-8 h-8 rounded-full flex items-center justify-center mr-3">
            <CircleDollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold">Trading Performance</h2>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Trading Data Available</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            This wallet doesn't have any recorded trading activity that we could analyze.
          </p>
        </div>
      </div>
    );
  }

  const { summary, tokenMetrics } = data;
  const totalPnl = (summary.realizedPnlUsd || 0) + (summary.unrealizedPnlUsd || 0);
  
  // Sort tokens by total volume (buys + sells)
  const sortedTokens = [...tokenMetrics].sort((a, b) => {
    const totalVolumeA = a.buys.volumeUsd + a.sells.volumeUsd;
    const totalVolumeB = b.buys.volumeUsd + b.sells.volumeUsd;
    return totalVolumeB - totalVolumeA;
  });

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mt-6">
      {/* Header with time period selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="bg-slate-700/50 w-8 h-8 rounded-full flex items-center justify-center mr-3">
            <CircleDollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold">Trading Performance</h2>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-slate-400 mr-1">Period:</span>
          <button
            onClick={() => setResolution('7d')}
            className={`px-2 py-1 rounded ${resolution === '7d' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-slate-700 text-slate-400'}`}
            disabled={isChangingPeriod}
          >
            7d
          </button>
          <button
            onClick={() => setResolution('30d')}
            className={`px-2 py-1 rounded ${resolution === '30d' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-slate-700 text-slate-400'}`}
            disabled={isChangingPeriod}
          >
            30d
          </button>
          {isChangingPeriod && (
            <Loader2 className="h-4 w-4 text-emerald-500 animate-spin ml-2" />
          )}
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total PNL */}
        <div className="bg-slate-700/30 rounded-lg p-4 relative">
          {isChangingPeriod && (
            <div className="absolute inset-0 bg-slate-800/50 rounded-lg flex items-center justify-center z-10">
              <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
            </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">Total P&L</div>
              <div className={`text-xl font-bold ${getValueColor(totalPnl)}`}>
                {formatPNL(totalPnl)}
              </div>
              <div className="flex items-center text-xs mt-1">
                <span className="text-slate-400 mr-2">Realized:</span>
                <span className={getValueColor(summary.realizedPnlUsd || 0)}>
                  {formatPNL(summary.realizedPnlUsd || 0)}
                </span>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${totalPnl > 0 ? 'bg-emerald-500/20' : totalPnl < 0 ? 'bg-red-500/20' : 'bg-slate-600/50'}`}>
              {totalPnl > 0 ? (
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              ) : totalPnl < 0 ? (
                <TrendingDown className="h-5 w-5 text-red-500" />
              ) : (
                <DollarSign className="h-5 w-5 text-slate-400" />
              )}
            </div>
          </div>
        </div>
        
        {/* Trading Volume */}
        <div className="bg-slate-700/30 rounded-lg p-4 relative">
          {isChangingPeriod && (
            <div className="absolute inset-0 bg-slate-800/50 rounded-lg flex items-center justify-center z-10">
              <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
            </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">Trading Volume</div>
              <div className="text-xl font-bold">{formatUSD(summary.tradesVolumeUsd || 0)}</div>
              <div className="flex items-center text-xs mt-1 text-slate-400">
                <Activity className="h-3 w-3 mr-1" />
                <span>{summary.tradesCount || 0} trades</span>
              </div>
            </div>
            <div className="bg-slate-600/50 w-10 h-10 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
        
        {/* Win Rate */}
        <div className="bg-slate-700/30 rounded-lg p-4 relative">
          {isChangingPeriod && (
            <div className="absolute inset-0 bg-slate-800/50 rounded-lg flex items-center justify-center z-10">
              <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
            </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">Win Rate</div>
              <div className="text-xl font-bold">
                {isNaN(summary.winRate) ? '0%' : summary.winRate.toFixed(1) + '%'}
              </div>
              <div className="flex items-center text-xs mt-1 text-slate-400">
                <span className="text-emerald-400 mr-1">{summary.winningTradesCount || 0} wins</span>
                {summary.losingTradesCount > 0 && (
                  <span className="text-red-400">{summary.losingTradesCount} losses</span>
                )}
              </div>
            </div>
            <div className="bg-slate-600/50 w-10 h-10 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
        
        {/* Avg Trade Size */}
        <div className="bg-slate-700/30 rounded-lg p-4 relative">
          {isChangingPeriod && (
            <div className="absolute inset-0 bg-slate-800/50 rounded-lg flex items-center justify-center z-10">
              <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
            </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">Avg Trade Size</div>
              <div className="text-xl font-bold">{formatUSD(summary.averageTradeUsd || 0)}</div>
              <div className="flex items-center text-xs mt-1 text-slate-400">
                <Coins className="h-3 w-3 mr-1" />
                <span>{summary.uniqueTokensTraded || 0} tokens traded</span>
              </div>
            </div>
            <div className="bg-slate-600/50 w-10 h-10 rounded-lg flex items-center justify-center">
              <Landmark className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Best Performing Token */}
      {summary.bestPerformingToken && (
        <div className="bg-slate-700/30 rounded-lg p-4 mb-6 relative">
          {isChangingPeriod && (
            <div className="absolute inset-0 bg-slate-800/50 rounded-lg flex items-center justify-center z-10">
              <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
            </div>
          )}
          <div className="text-sm text-slate-400 mb-3">Best Performing Token</div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-slate-800 rounded-full mr-3 flex items-center justify-center overflow-hidden">
              {getTokenImage(summary.bestPerformingToken) ? (
                <Image 
                  src={getTokenImage(summary.bestPerformingToken) || ''} 
                  alt={summary.bestPerformingToken.tokenSymbol} 
                  width={40} 
                  height={40}
                  className="object-cover"
                />
              ) : (
                <Coins className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div className="flex-grow">
              <div className="font-medium">{summary.bestPerformingToken.tokenSymbol}</div>
              <div className="text-sm text-slate-400">{summary.bestPerformingToken.tokenName || ''}</div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${getValueColor(summary.bestPerformingToken.pnlUsd)}`}>
                {formatPNL(summary.bestPerformingToken.pnlUsd)}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Token Metrics Table */}
      {sortedTokens.length > 0 && (
        <div className="bg-slate-700/30 rounded-lg p-4 relative">
          {isChangingPeriod && (
            <div className="absolute inset-0 bg-slate-800/50 rounded-lg flex items-center justify-center z-10">
              <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
            </div>
          )}
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-slate-400">Token Performance</div>
            <div className="text-xs text-slate-500">By trading volume</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-600/50">
                  <th className="pb-2 font-medium">Token</th>
                  <th className="pb-2 font-medium text-right">Buys</th>
                  <th className="pb-2 font-medium text-right">Sells</th>
                  <th className="pb-2 font-medium text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody>
                {sortedTokens.map((token, index) => {
                  const tokenPnl = (token.realizedPnlUsd || 0) + (token.unrealizedPnlUsd || 0);
                  
                  return (
                    <tr key={token.tokenAddress} className="border-b border-slate-600/20 hover:bg-slate-700/20">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-slate-800 rounded-full mr-2 flex items-center justify-center overflow-hidden">
                            {getTokenImage({ tokenSymbol: token.tokenSymbol }) ? (
                              <Image 
                                src={getTokenImage({ tokenSymbol: token.tokenSymbol }) || ''} 
                                alt={token.tokenSymbol} 
                                width={28} 
                                height={28}
                                className="object-cover"
                              />
                            ) : (
                              <Coins className="h-3.5 w-3.5 text-slate-400" />
                            )}
                          </div>
                          <span className="font-medium">{token.tokenSymbol}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex flex-col items-end">
                          <div className="text-sm font-medium">{formatUSD(token.buys.volumeUsd)}</div>
                          <div className="text-xs text-slate-400">{token.buys.transactionCount} txns</div>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex flex-col items-end">
                          <div className="text-sm font-medium">{formatUSD(token.sells.volumeUsd)}</div>
                          <div className="text-xs text-slate-400">{token.sells.transactionCount} txns</div>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className={`font-medium ${getValueColor(tokenPnl)}`}>
                          {formatPNL(tokenPnl)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-right text-slate-500 flex items-center justify-end">
        <span className="mr-1">Data source: Vybe Network</span>
        <button 
          onClick={() => setIsLoading(true)} 
          className="text-slate-400 hover:text-emerald-400 ml-2"
          title="Refresh data"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
