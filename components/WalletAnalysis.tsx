"use client";

import { useState, useEffect } from 'react';
import { 
  Shield, 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Check, 
  ExternalLink,
  Copy,
  Clock,
  Calendar,
  Wallet,
  Activity,
  CircleDollarSign,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletAnalysisData } from '@/lib/types';
import { formatUSD, shortenAddress } from '@/lib/utils';
import { WalletAnalysisLoading } from "@/components/WalletAnalysisLoading";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

interface WalletAnalysisProps {
  walletAddress: string;
}

export function WalletAnalysis({ walletAddress }: WalletAnalysisProps) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WalletAnalysisData | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [tokensLoading, setTokensLoading] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Show the loader animation for at least 2 seconds for a better UX
        setTimeout(() => {
          setInitialLoading(false);
        }, 2000);
        
        // Fetch wallet analysis data
        const response = await fetch(`/api/wallet/analysis?address=${walletAddress}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch wallet data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setData(data);
        
        // Fetch current SOL balance in parallel
        fetchCurrentBalance(walletAddress);
        
        // Fetch recent transactions
        fetchTransactions(walletAddress);
        
        // Fetch token holdings
        fetchTokenHoldings(walletAddress);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch wallet data');
      } finally {
        setLoading(false);
      }
    };
    
    if (walletAddress) {
      fetchWalletData();
    }
  }, [walletAddress]);
  
  const fetchTransactions = async (address: string) => {
    try {
      setTxLoading(true);
      const response = await fetch(`/api/wallet/transactions?address=${address}&limit=5`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setTxLoading(false);
    }
  };
  
  const fetchTokenHoldings = async (address: string) => {
    try {
      setTokensLoading(true);
      const response = await fetch(`/api/wallet/tokens?address=${address}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token holdings: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTokens(data.tokens || []);
    } catch (error) {
      console.error("Error fetching token holdings:", error);
    } finally {
      setTokensLoading(false);
    }
  };

  const fetchCurrentBalance = async (address: string) => {
    try {
      setBalanceLoading(true);
      
      const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT;
      if (!rpcEndpoint) {
        throw new Error("RPC endpoint not configured");
      }
      
      const connection = new Connection(rpcEndpoint);
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setSolBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getRiskLevel = (score: number): { color: string, label: string } => {
    if (score === 0) return { color: 'bg-emerald-500', label: 'No Risk' };
    if (score < 25) return { color: 'bg-emerald-500', label: 'Very Low Risk' };
    if (score < 50) return { color: 'bg-amber-400', label: 'Low Risk' };
    if (score < 75) return { color: 'bg-amber-500', label: 'Medium Risk' };
    return { color: 'bg-red-500', label: 'High Risk' };
  };
  
  if (initialLoading) {
    return <WalletAnalysisLoading />;
  }
  
  if (loading && !initialLoading) {
    return <WalletAnalysisLoadingSkeleton />;
  }
  
  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
        <div className="max-w-xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-3">Error Loading Wallet Data</h2>
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
  
  if (!data) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
        <div className="max-w-xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold mb-3">No Wallet Data Found</h2>
          <p className="text-slate-400 mb-4">
            No data could be found for wallet address: <span className="font-mono">{walletAddress}</span>
          </p>
          <p className="text-slate-500 mb-6">
            This wallet may be new or has no transaction history.
          </p>
        </div>
      </div>
    );
  }
  
  const { details, overallRisk } = data;
  const { address_info, dev_launched_tokens_in_24_hours } = details;
  const riskInfo = getRiskLevel(overallRisk);
  
  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="rounded-full overflow-hidden bg-slate-700 w-16 h-16 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-emerald-400" />
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl font-bold mr-2">
                Wallet Overview
              </h1>
              
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full ${riskInfo.color} text-xs font-medium text-white`}>
                  {riskInfo.label}
                </div>
                
                <div className="bg-slate-700 px-3 py-1 rounded-full text-xs font-medium text-slate-300">
                  {address_info.transaction_count} Transactions
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-2 space-x-1">
              <span className="font-mono text-sm text-slate-400">{shortenAddress(walletAddress)}</span>
              <button 
                className="text-slate-500 hover:text-slate-300 transition"
                onClick={() => copyToClipboard(walletAddress, 'address')}
              >
                {copiedText === 'address' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <a 
                href={`https://solscan.io/account/${walletAddress}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-300 transition ml-1"
                title="View on Solscan"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="md:text-right space-y-1">
            <div className="text-3xl font-bold">
              {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : (
                balanceLoading ? (
                  <span className="text-slate-400 text-lg">Loading balance...</span>
                ) : (
                  <span className="text-slate-400 text-lg">Balance unavailable</span>
                )
              )}
            </div>
            <div className="text-slate-400 text-sm">
              {solBalance !== null && `≈ $${(solBalance * 150).toFixed(2)}`}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">First Transaction</div>
              <div className="text-lg font-bold">{formatDate(address_info.time_1st_tx)}</div>
            </div>
            <div className="bg-slate-700/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">SOL Balance</div>
              <div className="text-lg font-bold">
                {address_info.balance.toFixed(4)} SOL
              </div>
            </div>
            <div className="bg-slate-700/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <CircleDollarSign className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">Transaction Count</div>
              <div className="text-lg font-bold">{address_info.transaction_count}</div>
            </div>
            <div className="bg-slate-700/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-slate-400 mb-1">New Tokens Launched</div>
              <div className="text-lg font-bold">{dev_launched_tokens_in_24_hours}</div>
            </div>
            <div className="bg-slate-700/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Risk Assessment */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-emerald-500" />
          Risk Assessment
        </h2>
        
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className={`h-3 w-3 rounded-full mr-2 ${riskInfo.color}`}></div>
              <h3 className="font-medium">Risk Level: {riskInfo.label}</h3>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Low Risk</span>
                <span className="text-slate-400">High Risk</span>
              </div>
              <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${riskInfo.color}`} 
                  style={{ width: `${Math.min(100, overallRisk)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {address_info.has_no_transactions ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <div className="ml-2">
                  <span className={address_info.has_no_transactions ? 'text-amber-400' : 'text-emerald-500'}>
                    {address_info.has_no_transactions ? 'No transaction history' : 'Has transaction history'}
                  </span>
                  <span className="text-slate-400 ml-1">
                    ({address_info.transaction_count} transactions)
                  </span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {address_info.has_no_balance ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <div className="ml-2">
                  <span className={address_info.has_no_balance ? 'text-amber-400' : 'text-emerald-500'}>
                    {address_info.has_no_balance ? 'No balance' : 'Has balance'}
                  </span>
                  <span className="text-slate-400 ml-1">
                    ({address_info.balance.toFixed(4)} SOL)
                  </span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {address_info.wash_trading > 0.5 ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <div className="ml-2">
                  <span className={address_info.wash_trading > 0.5 ? 'text-amber-400' : 'text-emerald-500'}>
                    {address_info.wash_trading > 0.5 ? 'Potential wash trading' : 'No wash trading detected'}
                  </span>
                  <span className="text-slate-400 ml-1">
                    (Score: {address_info.wash_trading})
                  </span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {address_info.automated_trading ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <div className="ml-2">
                  <span className={address_info.automated_trading ? 'text-amber-400' : 'text-emerald-500'}>
                    {address_info.automated_trading ? 'Automated trading detected' : 'No automated trading detected'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {address_info.is_spam_sns ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <div className="ml-2">
                  <span className={address_info.is_spam_sns ? 'text-red-400' : 'text-emerald-500'}>
                    {address_info.is_spam_sns ? 'Flagged as spam SNS' : 'Not flagged as spam'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {dev_launched_tokens_in_24_hours > 0 ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <div className="ml-2">
                  <span className={dev_launched_tokens_in_24_hours > 0 ? 'text-amber-400' : 'text-emerald-500'}>
                    {dev_launched_tokens_in_24_hours > 0 ? 'Recently launched tokens' : 'No recently launched tokens'}
                  </span>
                  <span className="text-slate-400 ml-1">
                    ({dev_launched_tokens_in_24_hours} in 24h)
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
      
      {/* Recent Transactions */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-emerald-500" />
          Recent Transactions
        </h2>
        
        {txLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-48 bg-slate-700" />
                  <Skeleton className="h-5 w-24 bg-slate-700" />
                </div>
                <div className="mt-2 flex justify-between">
                  <Skeleton className="h-4 w-32 bg-slate-700" />
                  <Skeleton className="h-4 w-16 bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.status === 'Success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      {tx.type === 'Transfer' ? (
                        tx.amount > 0 ? 
                          <ArrowDownRight className={`h-4 w-4 ${tx.status === 'Success' ? 'text-emerald-500' : 'text-red-400'}`} /> : 
                          <ArrowUpRight className={`h-4 w-4 ${tx.status === 'Success' ? 'text-emerald-500' : 'text-red-400'}`} />
                      ) : (
                        <Activity className={`h-4 w-4 ${tx.status === 'Success' ? 'text-emerald-500' : 'text-red-400'}`} />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{tx.type || 'Transaction'}</div>
                      <div className="text-xs text-slate-400">
                        <span className="font-mono">{shortenAddress(tx.signature, 8)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${tx.status === 'Success' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.status}
                    </div>
                    <div className="text-xs text-slate-400">{formatDate(tx.timestamp)}</div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                  <div className="text-sm text-slate-400">
                    Fee: {tx.fee.toFixed(6)} SOL
                  </div>
                  <a 
                    href={`https://solscan.io/tx/${tx.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center text-slate-400 hover:text-emerald-400 transition"
                  >
                    View Details <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-700/30 rounded-lg p-6 text-center">
            <div className="text-slate-400">No recent transactions found for this wallet</div>
          </div>
        )}
        
        <div className="mt-4">
          <a 
            href={`https://solscan.io/account/${walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-sm text-slate-400 hover:text-emerald-400 transition"
          >
            View all transactions on Solscan <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
      
      {/* Token Holdings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Coins className="h-5 w-5 mr-2 text-emerald-500" />
          Token Holdings
        </h2>
        
        {tokensLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full bg-slate-700 mr-3" />
                  <div>
                    <Skeleton className="h-5 w-24 bg-slate-700 mb-1" />
                    <Skeleton className="h-4 w-32 bg-slate-700" />
                  </div>
                  <div className="ml-auto text-right">
                    <Skeleton className="h-5 w-20 bg-slate-700 mb-1" />
                    <Skeleton className="h-4 w-16 bg-slate-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tokens.length > 0 ? (
          <div className="space-y-3">
            {tokens.map((token, index) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                    <Coins className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">Token</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {shortenAddress(token.mint, 8)}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-medium">{token.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: token.decimals > 6 ? 6 : token.decimals
                    })}</div>
                    <div className="text-xs text-slate-400">{token.decimals} decimals</div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700 flex justify-end">
                  <a 
                    href={`https://solscan.io/token/${token.mint}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs flex items-center text-slate-400 hover:text-emerald-400 transition"
                  >
                    View Token <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-700/30 rounded-lg p-6 text-center">
            <div className="text-slate-400">No token holdings found for this wallet</div>
          </div>
        )}
      </div>
    </div>
  );
}

function WalletAnalysisLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Wallet Overview Skeleton */}
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
      
      {/* Risk Assessment Skeleton */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <Skeleton className="h-8 w-48 bg-slate-700 mb-4" />
        
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <Skeleton className="h-6 w-32 bg-slate-700 mb-3" />
            <Skeleton className="h-4 w-full bg-slate-700 mb-4" />
            
            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex items-start">
                  <Skeleton className="h-4 w-4 bg-slate-700 rounded-full mt-0.5" />
                  <Skeleton className="h-4 w-48 bg-slate-700 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions Skeleton */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <Skeleton className="h-8 w-48 bg-slate-700 mb-4" />
        
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-48 bg-slate-700" />
                <Skeleton className="h-5 w-24 bg-slate-700" />
              </div>
              <div className="mt-2 flex justify-between">
                <Skeleton className="h-4 w-32 bg-slate-700" />
                <Skeleton className="h-4 w-16 bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Token Holdings Skeleton */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <Skeleton className="h-8 w-48 bg-slate-700 mb-4" />
        
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full bg-slate-700 mr-3" />
                <div>
                  <Skeleton className="h-5 w-24 bg-slate-700 mb-1" />
                  <Skeleton className="h-4 w-32 bg-slate-700" />
                </div>
                <div className="ml-auto text-right">
                  <Skeleton className="h-5 w-20 bg-slate-700 mb-1" />
                  <Skeleton className="h-4 w-16 bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
