"use client";

import { useState, useEffect } from 'react';
import { 
  Shield, 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Globe,
  Copy
} from "lucide-react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenAnalysisData } from '@/lib/types';
import { 
  formatUSD, 
  formatNumber, 
  formatPercentage, 
  getRiskColor, 
  getRiskLabel,
  shortenAddress 
} from '@/lib/utils';
import { TokenAnalysisLoading } from "@/components/TokenAnalysisLoading";
import { DecentralizationAnalysis } from "@/components/DecentralizationAnalysis";
import { TokenHolders } from "@/components/TokenHolders";
import { XLogo } from "@/components/icons/XLogo";
import { TokenOverview } from "@/components/TokenOverview";

interface TokenAnalysisProps {
  tokenAddress: string;
}

export function TokenAnalysis({ tokenAddress }: TokenAnalysisProps) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TokenAnalysisData | null>(null);
  const [rugCheckData, setRugCheckData] = useState<any>(null);
  const [dexScreenerData, setDexScreenerData] = useState<any>(null);
  const [expandedExchange, setExpandedExchange] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Show the loader animation for at least 2 seconds for a better UX
        setTimeout(() => {
          setInitialLoading(false);
        }, 2000);
        
        // Fetch token analysis data
        const response = await fetch(`/api/token/analysis?address=${tokenAddress}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch token data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setData(data);
        
        // Fetch RugCheck data
        try {
          const rugCheckResponse = await fetch(`/api/token/rugcheck?address=${tokenAddress}`);
          if (rugCheckResponse.ok) {
            const rugCheckData = await rugCheckResponse.json();
            if (!rugCheckData.error) {
              setRugCheckData(rugCheckData);
            }
          }
        } catch (rugCheckError) {
          console.error('Error fetching RugCheck data:', rugCheckError);
          // Don't set main error - allow analysis to continue even if RugCheck fails
        }
        
        // Fetch DexScreener data
        try {
          const dexScreenerResponse = await fetch(`/api/token/dexscreener?address=${tokenAddress}`);
          if (dexScreenerResponse.ok) {
            const dexScreenerData = await dexScreenerResponse.json();
            setDexScreenerData(dexScreenerData);
          }
        } catch (dexScreenerError) {
          console.error('Error fetching DexScreener data:', dexScreenerError);
          // Don't set main error - allow analysis to continue even if DexScreener fails
        }
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch token data');
      } finally {
        setLoading(false);
      }
    };
    
    if (tokenAddress) {
      fetchTokenData();
    }
  }, [tokenAddress]);
  
  // Save token to recent searches when data is loaded
  useEffect(() => {
    if (data?.tokenInfo) {
      const { tokenInfo } = data;
      
      // Create a record of the token for recent searches
      const tokenRecord = {
        address: tokenInfo.address,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        logo: tokenInfo.logo,
        price: tokenInfo.price,
        timestamp: Date.now()
      };
      
      // Get existing recent tokens
      const existingTokensStr = localStorage.getItem('recentTokens');
      let recentTokens = [];
      
      if (existingTokensStr) {
        try {
          recentTokens = JSON.parse(existingTokensStr);
        } catch (error) {
          console.error('Failed to parse recent tokens:', error);
        }
      }
      
      // Filter out the current token if it exists already
      recentTokens = recentTokens.filter(
        (token: any) => token.address !== tokenInfo.address
      );
      
      // Add the token to the beginning of the array
      recentTokens.unshift(tokenRecord);
      
      // Limit to 10 recent tokens
      recentTokens = recentTokens.slice(0, 10);
      
      // Save back to localStorage
      localStorage.setItem('recentTokens', JSON.stringify(recentTokens));
    }
  }, [data]);
  
  const toggleExchange = (exchangeAddress: string) => {
    if (expandedExchange === exchangeAddress) {
      setExpandedExchange(null);
    } else {
      setExpandedExchange(exchangeAddress);
    }
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };
  
  if (initialLoading) {
    return <TokenAnalysisLoading />;
  }
  
  if (loading && !initialLoading) {
    return (
      <div className="space-y-6">
        <TokenAnalysisLoadingSkeleton />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
        <div className="max-w-xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-3">Error Loading Token Data</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button 
            className="bg-slate-700 hover:bg-slate-600 text-white"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  if (!data || !data.tokenInfo) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
        <div className="max-w-xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold mb-3">No Token Data Found</h2>
          <p className="text-slate-400 mb-4">
            No data could be found for token address: <span className="font-mono">{tokenAddress}</span>
          </p>
          <p className="text-slate-500 mb-6">
            This token may not be listed on any exchanges, or the address may be incorrect.
          </p>
        </div>
      </div>
    );
  }
  
  const { tokenInfo, pairs, analytics, decentralization } = data;
  
  return (
    <div className="space-y-6">
      {/* Token Overview */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="rounded-full overflow-hidden bg-slate-700 w-16 h-16 flex items-center justify-center">
            {tokenInfo.logo ? (
              <Image 
                src={tokenInfo.logo} 
                alt={tokenInfo.name} 
                width={64} 
                height={64} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <DollarSign className="h-8 w-8 text-slate-400" />
            )}
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl font-bold mr-2">
                {tokenInfo.name} 
                <span className="text-slate-400 ml-2">({tokenInfo.symbol})</span>
              </h1>
              
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full ${getRiskColor(analytics.riskScore)} text-xs font-medium text-white`}>
                  {getRiskLabel(analytics.riskScore)}
                </div>
                
                <div className="bg-slate-700 px-3 py-1 rounded-full text-xs font-medium text-slate-300">
                  {analytics.activePools} Active Pools
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-2 space-x-1">
              <span className="font-mono text-sm text-slate-400">{shortenAddress(tokenInfo.address)}</span>
              <button 
                className="text-slate-500 hover:text-slate-300 transition"
                onClick={() => copyToClipboard(tokenInfo.address, 'address')}
              >
                {copiedText === 'address' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <a 
                href={`https://x.com/search?q=${tokenInfo.address}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-300 transition ml-1"
                title="Search on X"
              >
                <XLogo className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="md:text-right space-y-1">
            <div className="text-3xl font-bold">
              {formatUSD(tokenInfo.price)}
            </div>
            <div className={`flex items-center ${tokenInfo.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {tokenInfo.priceChange24h >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{formatPercentage(tokenInfo.priceChange24h)}</span>
              <span className="text-slate-500 text-sm ml-1">24h</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* RugCheck Token Overview */}
      <TokenOverview 
        data={rugCheckData} 
        dexScreenerData={dexScreenerData}
        loading={loading} 
      />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">Total Liquidity</div>
              <div className="text-2xl font-bold">{formatUSD(analytics.totalLiquidity)}</div>
            </div>
            <div className="bg-slate-700/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">24h Volume</div>
              <div className="text-2xl font-bold">{formatUSD(analytics.totalVolume)}</div>
            </div>
            <div className="bg-slate-700/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">Active Pools</div>
              <div className="text-2xl font-bold">{analytics.activePools} / {analytics.activePools + analytics.inactivePools}</div>
            </div>
            <div className="bg-slate-700/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">Exchanges</div>
              <div className="text-2xl font-bold">{analytics.exchanges.length}</div>
            </div>
            <div className="bg-slate-700/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decentralization Analysis */}
      <DecentralizationAnalysis 
        data={data?.decentralization} 
        loading={loading}
      />
      
      {/* Exchange Liquidity */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold mb-4">Exchange Liquidity</h2>
        
        <div className="space-y-4">
          {pairs.sort((a, b) => b.liquidityUsd - a.liquidityUsd).map((pair) => (
            <div 
              key={pair.pairAddress} 
              className="bg-slate-700/30 rounded-lg overflow-hidden"
            >
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-700/50 transition"
                onClick={() => toggleExchange(pair.pairAddress)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-600 rounded-full overflow-hidden flex items-center justify-center">
                    {pair.exchangeLogo ? (
                      <Image 
                        src={pair.exchangeLogo} 
                        alt={pair.exchangeName} 
                        width={32} 
                        height={32} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Globe className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{pair.exchangeName}</div>
                    <div className="text-sm text-slate-400">{pair.pairLabel}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <div className="font-medium">{formatUSD(pair.liquidityUsd)}</div>
                    <div className="text-sm text-slate-400">
                      {pair.inactivePair ? 'Inactive' : 'Active'}
                    </div>
                  </div>
                  {expandedExchange === pair.pairAddress ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </div>
              
              {expandedExchange === pair.pairAddress && (
                <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-slate-400 mb-2">Pair Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Price</span>
                          <span>{formatUSD(pair.usdPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">24h Change</span>
                          <span className={pair.usdPrice24hrPercentChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {formatPercentage(pair.usdPrice24hrPercentChange)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">24h Volume</span>
                          <span>{formatUSD(pair.volume24hrUsd)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pair Address</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-mono text-xs">{shortenAddress(pair.pairAddress, 4)}</span>
                            <button 
                              className="text-slate-500 hover:text-slate-300 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(pair.pairAddress, pair.pairAddress);
                              }}
                            >
                              {copiedText === pair.pairAddress ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-slate-400 mb-2">Token Liquidity</h4>
                      <div className="space-y-3">
                        {pair.pair.map((token) => (
                          <div key={token.tokenAddress} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-slate-700 rounded-full overflow-hidden flex items-center justify-center">
                                {token.tokenLogo ? (
                                  <Image 
                                    src={token.tokenLogo} 
                                    alt={token.tokenName} 
                                    width={24} 
                                    height={24} 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <DollarSign className="h-3 w-3 text-slate-400" />
                                )}
                              </div>
                              <span className="text-sm">{token.tokenSymbol}</span>
                            </div>
                            <span>{formatUSD(token.liquidityUsd)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-slate-300"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://solscan.io/account/${pair.pairAddress}`, "_blank");
                    }}
                  >
                    View on Solscan <ExternalLink className="h-3.5 w-3.5 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Risk Assessment */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-emerald-500" />
          Security Assessment
        </h2>
        
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className={`h-3 w-3 rounded-full mr-2 ${getRiskColor(analytics.riskScore)}`}></div>
              <h3 className="font-medium">Risk Level: {getRiskLabel(analytics.riskScore)}</h3>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Safer</span>
                <span className="text-slate-400">Riskier</span>
              </div>
              <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getRiskColor(analytics.riskScore)}`} 
                  style={{ width: `${analytics.riskScore * 20}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {analytics.totalLiquidity > 50000 ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="ml-2">
                  <span className={analytics.totalLiquidity > 50000 ? 'text-emerald-500' : 'text-amber-400'}>
                    {analytics.totalLiquidity > 50000 ? 'Sufficient' : 'Low'} liquidity
                  </span>
                  <span className="text-slate-400 ml-1">
                    ({formatUSD(analytics.totalLiquidity)})
                  </span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {analytics.exchanges.length >= 2 ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="ml-2">
                  <span className={analytics.exchanges.length >= 2 ? 'text-emerald-500' : 'text-amber-400'}>
                    {analytics.exchanges.length >= 2 ? 'Multiple' : 'Limited'} exchanges
                  </span>
                  <span className="text-slate-400 ml-1">
                    ({analytics.exchanges.length} exchanges)
                  </span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {analytics.activePools >= 1 ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="ml-2">
                  <span className={analytics.activePools >= 1 ? 'text-emerald-500' : 'text-red-400'}>
                    {analytics.activePools >= 1 ? 'Active' : 'No active'} trading pools
                  </span>
                  <span className="text-slate-400 ml-1">
                    ({analytics.activePools} active pools)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-slate-400 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          <p>
            This assessment is based on on-chain data and is not financial advice. Always do your own research.
          </p>
        </div>
      </div>
      
      {/* Token Holders */}
      <TokenHolders tokenAddress={tokenAddress} />
    </div>
  );
}

function TokenAnalysisLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Token Overview Skeleton */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Skeleton className="rounded-full bg-slate-700 w-16 h-16" />
          
          <div className="flex-grow">
            <Skeleton className="h-8 w-48 bg-slate-700 mb-2" />
            <Skeleton className="h-4 w-32 bg-slate-700" />
          </div>
          
          <div className="md:text-right">
            <Skeleton className="h-8 w-24 bg-slate-700 mb-2" />
            <Skeleton className="h-4 w-20 bg-slate-700" />
          </div>
        </div>
      </div>
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <Skeleton className="h-4 w-24 bg-slate-700 mb-2" />
                <Skeleton className="h-8 w-20 bg-slate-700" />
              </div>
              <Skeleton className="bg-slate-700 w-10 h-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Exchange Liquidity Skeleton */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <Skeleton className="h-8 w-48 bg-slate-700 mb-4" />
        
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 bg-slate-700 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-24 bg-slate-700 mb-1" />
                    <Skeleton className="h-4 w-16 bg-slate-700" />
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-5 w-20 bg-slate-700 mb-1" />
                  <Skeleton className="h-4 w-12 bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Risk Assessment Skeleton */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <Skeleton className="h-8 w-48 bg-slate-700 mb-4" />
        
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <Skeleton className="h-6 w-32 bg-slate-700 mb-3" />
            <Skeleton className="h-4 w-full bg-slate-700 mb-4" />
            
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-start">
                  <Skeleton className="h-4 w-4 bg-slate-700 rounded-full mt-0.5" />
                  <Skeleton className="h-4 w-48 bg-slate-700 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Token Holders Skeleton */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <Skeleton className="h-8 w-48 bg-slate-700 mb-4" />
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="pb-3 pr-4">
                  <Skeleton className="h-4 w-10 bg-slate-700" />
                </th>
                <th className="pb-3 pr-4">
                  <Skeleton className="h-4 w-32 bg-slate-700" />
                </th>
                <th className="pb-3 pr-4 text-right">
                  <Skeleton className="h-4 w-20 bg-slate-700 ml-auto" />
                </th>
                <th className="pb-3 text-right">
                  <Skeleton className="h-4 w-16 bg-slate-700 ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(8)].map((_, index) => (
                <tr key={index} className="border-b border-slate-700/50">
                  <td className="py-3 pr-4">
                    <Skeleton className="h-4 w-6 bg-slate-700" />
                  </td>
                  <td className="py-3 pr-4">
                    <Skeleton className="h-4 w-32 bg-slate-700" />
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <Skeleton className="h-4 w-20 bg-slate-700 ml-auto" />
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end">
                      <Skeleton className="h-4 w-12 bg-slate-700" />
                      <Skeleton className="h-2 w-16 bg-slate-700 ml-2" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 