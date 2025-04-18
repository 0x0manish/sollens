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
  RefreshCw,
  Copy
} from 'lucide-react';
import { formatUSD, formatNumber } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import toast from 'react-hot-toast';

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
            className={`px-2 py-1 rounded ${resolution === '7d' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-slate-700'}`}
          >
            7D
          </button>
          <button
            onClick={() => setResolution('30d')}
            className={`px-2 py-1 rounded ${resolution === '30d' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-slate-700'}`}
          >
            30D
          </button>
          
          {isChangingPeriod && (
            <RefreshCw className="h-3 w-3 text-slate-400 animate-spin ml-2" />
          )}
        </div>
      </div>
      
      {/* Summary stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center text-slate-400 mb-2 text-sm">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
            <span>Total P&L</span>
          </div>
          <div className={`text-xl font-semibold ${getValueColor(totalPnl)}`}>
            {formatPNL(totalPnl)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Realized: {formatPNL(summary.realizedPnlUsd || 0)}
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center text-slate-400 mb-2 text-sm">
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
            <span>Win Rate</span>
          </div>
          <div className="text-xl font-semibold text-slate-100">
            {summary.winRate ? summary.winRate.toFixed(1) : '0'}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {summary.winningTradesCount || 0}/{summary.tradesCount || 0} trades
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center text-slate-400 mb-2 text-sm">
            <DollarSign className="h-3.5 w-3.5 mr-1.5" />
            <span>Volume</span>
          </div>
          <div className="text-xl font-semibold text-slate-100">
            {formatUSD(summary.tradesVolumeUsd || 0)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {summary.uniqueTokensTraded || 0} tokens traded
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center text-slate-400 mb-2 text-sm">
            <Activity className="h-3.5 w-3.5 mr-1.5" />
            <span>Trades</span>
          </div>
          <div className="text-xl font-semibold text-slate-100">
            {summary.tradesCount || 0}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Avg: {formatUSD(summary.averageTradeUsd || 0)}
          </div>
        </div>
      </div>
      
      {/* Token performance section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Best performing token */}
        {summary.bestPerformingToken && (
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-emerald-500/20 w-7 h-7 rounded-full flex items-center justify-center mr-2">
                  <ArrowUp className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <span className="text-sm text-slate-300">Best Performing</span>
              </div>
              <div className={`font-medium ${getValueColor(summary.bestPerformingToken.pnlUsd || 0)}`}>
                {formatPNL(summary.bestPerformingToken.pnlUsd || 0)}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-800 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                {getTokenImage(summary.bestPerformingToken) ? (
                  <Image 
                    src={getTokenImage(summary.bestPerformingToken) || ''} 
                    alt={summary.bestPerformingToken.tokenSymbol} 
                    width={32} 
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <Coins className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <div>
                <div className="font-medium">{summary.bestPerformingToken.tokenSymbol}</div>
                {summary.bestPerformingToken.tokenAddress ? (
                  <div 
                    className="text-xs text-slate-400 flex items-center cursor-pointer group"
                    onClick={() => {
                      navigator.clipboard.writeText(summary.bestPerformingToken.tokenAddress);
                      toast.success('Address copied', {
                        style: {
                          background: '#1e293b',
                          color: '#e2e8f0',
                          border: '1px solid #334155'
                        }
                      });
                    }}
                  >
                    <span className="group-hover:text-emerald-500 transition-colors">
                      {summary.bestPerformingToken.tokenAddress.substring(0, 8)}...{summary.bestPerformingToken.tokenAddress.substring(summary.bestPerformingToken.tokenAddress.length - 8)}
                    </span>
                    <Copy className="h-2.5 w-2.5 ml-1 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">{summary.bestPerformingToken.tokenName || 'Unknown'}</div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Worst performing token */}
        {summary.worstPerformingToken && (
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-red-500/20 w-7 h-7 rounded-full flex items-center justify-center mr-2">
                  <ArrowDown className="h-3.5 w-3.5 text-red-500" />
                </div>
                <span className="text-sm text-slate-300">Worst Performing</span>
              </div>
              <div className={`font-medium ${getValueColor(summary.worstPerformingToken.pnlUsd || 0)}`}>
                {formatPNL(summary.worstPerformingToken.pnlUsd || 0)}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-800 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                {getTokenImage(summary.worstPerformingToken) ? (
                  <Image 
                    src={getTokenImage(summary.worstPerformingToken) || ''} 
                    alt={summary.worstPerformingToken.tokenSymbol} 
                    width={32} 
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <Coins className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <div>
                <div className="font-medium">{summary.worstPerformingToken.tokenSymbol}</div>
                {summary.worstPerformingToken.tokenAddress ? (
                  <div 
                    className="text-xs text-slate-400 flex items-center cursor-pointer group"
                    onClick={() => {
                      navigator.clipboard.writeText(summary.worstPerformingToken.tokenAddress);
                      toast.success('Address copied', {
                        style: {
                          background: '#1e293b',
                          color: '#e2e8f0',
                          border: '1px solid #334155'
                        }
                      });
                    }}
                  >
                    <span className="group-hover:text-emerald-500 transition-colors">
                      {summary.worstPerformingToken.tokenAddress.substring(0, 8)}...{summary.worstPerformingToken.tokenAddress.substring(summary.worstPerformingToken.tokenAddress.length - 8)}
                    </span>
                    <Copy className="h-2.5 w-2.5 ml-1 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">{summary.worstPerformingToken.tokenName || 'Unknown'}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Token metrics table */}
      <div className="bg-slate-700/30 rounded-lg overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="border-b border-slate-600/30">
              <tr className="text-xs text-slate-400">
                <th className="py-2 pl-4 text-left">Token</th>
                <th className="py-2 text-right">Buy Volume</th>
                <th className="py-2 text-right">Sell Volume</th>
                <th className="py-2 pr-4 text-right">Net P&L</th>
              </tr>
            </thead>
            <tbody>
              {sortedTokens.map((token, index) => {
                const tokenPnl = (token.realizedPnlUsd || 0) + (token.unrealizedPnlUsd || 0);
                
                return (
                  <tr key={token.tokenAddress ? token.tokenAddress : `token-${token.tokenSymbol || ''}-${index}`} className="border-b border-slate-600/20 hover:bg-slate-700/20">
                    <td className="py-3 pl-4">
                      <div className="flex items-center">
                        <div className="w-7 h-7 bg-slate-800 rounded-full mr-2 flex items-center justify-center overflow-hidden">
                          {getTokenImage(token) ? (
                            <Image 
                              src={getTokenImage(token) || ''} 
                              alt={token.tokenSymbol || 'token'} 
                              width={28} 
                              height={28}
                              className="object-cover"
                            />
                          ) : (
                            <div className="text-[10px] text-slate-300 font-medium">
                              {token.tokenSymbol ? token.tokenSymbol.substring(0, 1) : '?'}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{token.tokenSymbol || 'Unknown'}</span>
                          {token.tokenAddress && (
                            <div 
                              className="text-[10px] text-slate-400 flex items-center cursor-pointer group"
                              onClick={() => {
                                navigator.clipboard.writeText(token.tokenAddress);
                                toast.success('Address copied', {
                                  style: {
                                    background: '#1e293b',
                                    color: '#e2e8f0',
                                    border: '1px solid #334155'
                                  }
                                });
                              }}
                            >
                              <span className="group-hover:text-emerald-500 transition-colors">
                                {token.tokenAddress.substring(0, 8)}...{token.tokenAddress.substring(token.tokenAddress.length - 8)}
                              </span>
                              <Copy className="h-2.5 w-2.5 ml-1 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">{formatUSD(token.buys.volumeUsd || 0)}</div>
                        <div className="text-xs text-slate-400">{token.buys.transactionCount || 0} txns</div>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">{formatUSD(token.sells.volumeUsd || 0)}</div>
                        <div className="text-xs text-slate-400">{token.sells.transactionCount || 0} txns</div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right">
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
      
      {/* PNL chart */}
      {summary.pnlTrendSevenDays && summary.pnlTrendSevenDays.length > 0 && summary.pnlTrendSevenDays.some((day: [number, number]) => Math.abs(day[1] || 0) > 0) ? (
        <div className="bg-slate-700/30 rounded-xl border border-slate-700/50 p-5 mb-4">
          <div className="flex items-center mb-4">
            <div className="bg-slate-700/50 w-8 h-8 rounded-full flex items-center justify-center mr-3">
              <Landmark className="h-4 w-4 text-emerald-500" />
            </div>
            <h2 className="text-base font-semibold">P&L Trend (7 days)</h2>
          </div>
          
          <div className="h-40 flex items-end space-x-2 px-2 mt-6">
            {summary.pnlTrendSevenDays.map((dayData: [number, number], index: number) => {
              // Each dayData is an array [timestamp, pnlValue]
              const timestamp = dayData[0] || 0;
              const pnlValue = dayData[1] || 0;
              
              // Get day of week
              const date = new Date(timestamp);
              const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
              
              // Scale bar height based on the relative PNL value
              const maxPnlAbs = Math.max(...summary.pnlTrendSevenDays.map((d: [number, number]) => Math.abs(d[1] || 0)));
              const heightPercentage = maxPnlAbs === 0 ? 0 : (Math.abs(pnlValue) / maxPnlAbs) * 100;
              
              // Ensure minimum visibility for non-zero values
              const displayHeight = pnlValue === 0 ? 0 : Math.max(15, heightPercentage);
              
              // Format PNL for display
              const formattedPNL = pnlValue.toFixed(2);
              const displayPNL = parseFloat(formattedPNL);
              
              return (
                <div key={`pnl-day-${timestamp || index}-${index}`} className="flex-1 flex flex-col items-center">
                  {/* Value label */}
                  <div className={`text-xs mb-2 font-medium ${Math.abs(pnlValue) > 0 ? (pnlValue > 0 ? 'text-emerald-500' : 'text-red-500') : 'text-slate-500'}`}>
                    {pnlValue > 0 ? '+' : ''}{displayPNL}
                  </div>
                  
                  {/* Bar container with relative positioning */}
                  <div className="w-full flex justify-center items-end h-[100px] relative">
                    {/* Bar */}
                    {Math.abs(pnlValue) > 0 && (
                      <div 
                        className={`w-8 rounded-t-md ${pnlValue >= 0 ? 'bg-emerald-500/90' : 'bg-red-500/90'}`}
                        style={{ height: `${displayHeight}%` }}
                      ></div>
                    )}
                    {Math.abs(pnlValue) === 0 && (
                      <div className="w-8 h-[1px] bg-slate-600"></div>
                    )}
                  </div>
                  
                  {/* Day label */}
                  <div className="text-xs mt-3 text-slate-400 font-medium">{dayOfWeek}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
