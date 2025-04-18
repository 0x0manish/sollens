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
  Coins,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Globe,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletAnalysisData } from '@/lib/types';
import { formatUSD } from '@/lib/utils';
import { WalletAnalysisLoading } from "@/components/WalletAnalysisLoading";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

interface WalletAnalysisProps {
  walletAddress: string;
}

export function WalletAnalysis({ walletAddress }: WalletAnalysisProps) {
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  
  const [tokensData, setTokensData] = useState<any[]>([]);
  const [tokensLoading, setTokensLoading] = useState(true);
  const [tokensError, setTokensError] = useState<string | null>(null);
  
  const [sanctionedData, setSanctionedData] = useState<{ is_sanctioned: boolean } | null>(null);
  const [sanctionedLoading, setSanctionedLoading] = useState(true);
  const [sanctionedError, setSanctionedError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWalletData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/wallet/analysis?address=${walletAddress}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch wallet data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setWalletData(data);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchWalletData();
  }, [walletAddress]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setTransactionsLoading(true);
        setTransactionsError(null);
        
        const response = await fetch(`/api/wallet/transactions?address=${walletAddress}&limit=5`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTransactionsData(data.transactions || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setTransactionsError('Failed to load transactions');
      } finally {
        setTransactionsLoading(false);
      }
    }
    
    fetchTransactions();
  }, [walletAddress]);

  useEffect(() => {
    async function fetchTokens() {
      try {
        setTokensLoading(true);
        setTokensError(null);
        
        const response = await fetch(`/api/wallet/tokens?address=${walletAddress}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch token holdings: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTokensData(data.tokens || []);
      } catch (err) {
        console.error('Error fetching token holdings:', err);
        setTokensError('Failed to load token holdings');
      } finally {
        setTokensLoading(false);
      }
    }
    
    fetchTokens();
  }, [walletAddress]);

  useEffect(() => {
    async function fetchSanctionedStatus() {
      try {
        setSanctionedLoading(true);
        setSanctionedError(null);
        
        const response = await fetch(`/api/wallet/sanctioned?address=${walletAddress}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch sanctioned status: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSanctionedData(data);
      } catch (err) {
        console.error('Error fetching sanctioned status:', err);
        setSanctionedError('Failed to load sanctioned status');
      } finally {
        setSanctionedLoading(false);
      }
    }
    
    fetchSanctionedStatus();
  }, [walletAddress]);

  // Helper function to shorten an address for display
  function shortenAddress(address: string, chars: number = 4): string {
    if (!address) return '';
    return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
  }

  // Format date function
  function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }

  // Show the loading state if any of the core data is still loading
  if (loading) {
    return <WalletAnalysisLoading />;
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl border border-red-700 p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-red-500">Error Loading Wallet Data</h3>
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="bg-slate-800 rounded-xl border border-amber-700 p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-amber-500">No Wallet Data Found</h3>
        <p className="text-slate-400">
          No data could be found for wallet address: <span className="font-mono">{walletAddress}</span>
        </p>
      </div>
    );
  }

  const { risk_factors = [] } = walletData;
  const { address_info = {}, dev_launched_tokens_in_24_hours = 0 } = walletData.details || {};
  
  // Get SOL balance from address_info
  const solBalance = address_info.balance || 0;

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
              <h1 className="text-xl font-bold mb-2 flex items-center">
                <Users className="h-5 w-5 mr-2 text-emerald-500" />
                Wallet Analysis
              </h1>
              
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full ${getRiskLevelStyle(walletData.overallRisk || 0)} text-xs font-medium text-white`}>
                  {getRiskLevelLabel(walletData.overallRisk || 0)}
                </div>
                
                <div className="bg-slate-700 px-3 py-1 rounded-full text-xs font-medium text-slate-300">
                  {address_info.transaction_count || 0} Transactions
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-2 space-x-1">
              <span className="font-mono text-sm text-slate-400">{shortenAddress(walletAddress)}</span>
              <button 
                className="text-slate-500 hover:text-slate-300 transition"
                onClick={() => navigator.clipboard.writeText(walletAddress)}
              >
                <Copy className="h-4 w-4" />
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
              {solBalance.toFixed(solBalance < 0.01 ? 6 : 4)} SOL
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
              <div className="text-lg font-bold">
                {formatDate(address_info.time_1st_tx)}
              </div>
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
                {solBalance.toFixed(solBalance < 0.01 ? 6 : 4)} SOL
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
              <div className="text-lg font-bold">{address_info.transaction_count || 0}</div>
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-slate-700/50 w-8 h-8 rounded-full flex items-center justify-center mr-3">
              <ShieldAlert className="h-4 w-4 text-emerald-500" />
            </div>
            <h2 className="text-lg font-semibold">Risk Assessment</h2>
          </div>
          
          {/* Webacy DD Logo - Circular */}
          <div className="flex items-center">
            <span className="text-xs text-slate-400 mr-2">Wallet data from</span>
            <a 
              href="https://dd.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 flex items-center justify-center hover:border-emerald-500 transition-colors"
              title="Visit DD by Webacy"
            >
              <img 
                src="/DD.jpg" 
                alt="DD by Webacy" 
                className="w-full h-full object-cover" 
              />
            </a>
          </div>
        </div>
        
        {/* Sanctioned Status - Improved layout */}
        <div className="mb-6 bg-slate-900/50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <Lock className="mr-2 h-4 w-4 text-slate-400" />
              <span className="text-slate-300">Sanctioned Status:</span>
            </div>
            
            {sanctionedLoading ? (
              <div className="flex items-center">
                <Skeleton className="h-5 w-32 bg-slate-700" />
              </div>
            ) : sanctionedError ? (
              <div className="text-red-500 text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Error loading data
              </div>
            ) : (
              <div className={`flex items-center ${sanctionedData?.is_sanctioned ? 'text-red-500' : 'text-emerald-500'}`}>
                {sanctionedData?.is_sanctioned ? (
                  <>
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Sanctioned Address</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    <span className="font-medium">Not Sanctioned</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {risk_factors.map((factor: any, index: number) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {factor.is_risky ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <Check className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              <div className="ml-2">
                <span className={factor.is_risky ? 'text-amber-400' : 'text-emerald-500'}>
                  {factor.is_risky ? factor.name : `No ${factor.name.toLowerCase()}`}
                </span>
                <span className="text-slate-400 ml-1">
                  ({factor.score})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-emerald-500" />
          Recent Transactions
        </h2>
        
        {transactionsLoading ? (
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
        ) : transactionsData.length > 0 ? (
          <div className="space-y-3">
            {transactionsData.map((tx, index) => (
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
                    <div className="text-xs text-slate-400">{tx.timestamp}</div>
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
                    className="text-slate-400 hover:text-emerald-500 transition"
                  >
                    View <ExternalLink className="h-3 w-3 inline" />
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
        <h2 className="text-lg font-semibold mb-4 flex items-center">
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
        ) : tokensData.length > 0 ? (
          <div className="space-y-3">
            {tokensData.map((token, index) => (
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
                    className="text-slate-400 hover:text-emerald-500 transition"
                  >
                    View <ExternalLink className="h-3 w-3 inline" />
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

function getRiskLevelStyle(riskScore: number): string {
  if (riskScore === 0) return 'bg-emerald-500';
  if (riskScore < 25) return 'bg-emerald-500';
  if (riskScore < 50) return 'bg-amber-400';
  if (riskScore < 75) return 'bg-amber-500';
  return 'bg-red-500';
}

function getRiskLevelLabel(riskScore: number): string {
  if (riskScore === 0) return 'No Risk';
  if (riskScore < 25) return 'Very Low Risk';
  if (riskScore < 50) return 'Low Risk';
  if (riskScore < 75) return 'Medium Risk';
  return 'High Risk';
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
        <div className="flex items-center mb-4">
          <Skeleton className="h-5 w-5 rounded mr-2 bg-slate-700" />
          <Skeleton className="h-6 w-40 bg-slate-700" />
        </div>
        
        {/* Sanctioned Status Skeleton */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Skeleton className="h-4 w-4 rounded mr-2 bg-slate-700" />
            <Skeleton className="h-5 w-32 bg-slate-700" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 rounded-full mr-2 bg-slate-700" />
            <Skeleton className="h-5 w-32 bg-slate-700" />
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-start">
              <Skeleton className="h-4 w-4 bg-slate-700 rounded-full mt-0.5" />
              <Skeleton className="h-4 w-48 bg-slate-700 ml-2" />
            </div>
          ))}
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
