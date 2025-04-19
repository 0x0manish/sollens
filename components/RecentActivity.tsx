"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { History, ExternalLink, DollarSign, Wallet, FileText, LayoutGrid } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatUSD } from '@/lib/utils';

// Define types for different activities
interface BaseActivity {
  type: 'token' | 'wallet' | 'transaction';
  timestamp: number;
}

interface TokenActivity extends BaseActivity {
  type: 'token';
  address: string;
  name: string;
  symbol: string;
  logo: string | null;
  price: number;
}

interface WalletActivity extends BaseActivity {
  type: 'wallet';
  address: string;
  balance?: number;
  tokenCount?: number;
}

interface TransactionActivity extends BaseActivity {
  type: 'transaction';
  signature: string;
  status?: 'Success' | 'Failed';
}

type Activity = TokenActivity | WalletActivity | TransactionActivity;

export function RecentActivity() {
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Load recent activity from local storage
  useEffect(() => {
    // Get token activity
    const storedTokens = localStorage.getItem('recentTokens');
    const tokenActivities: TokenActivity[] = storedTokens 
      ? JSON.parse(storedTokens).map((token: any) => ({
          ...token, 
          type: 'token',
          // Ensure price is a valid number or null
          price: typeof token.price === 'number' ? token.price : null
        }))
      : [];
    
    // Get wallet activity
    const storedWallets = localStorage.getItem('recentWallets');
    const walletActivities: WalletActivity[] = storedWallets 
      ? JSON.parse(storedWallets)
      : [];
    
    // Get transaction activity
    const storedTransactions = localStorage.getItem('recentTransactions');
    const transactionActivities: TransactionActivity[] = storedTransactions 
      ? JSON.parse(storedTransactions)
      : [];
    
    // Combine and sort by timestamp (newest first)
    const allActivities = [...tokenActivities, ...walletActivities, ...transactionActivities]
      .sort((a, b) => b.timestamp - a.timestamp);
    
    setRecentActivity(allActivities);
  }, []);
  
  // Clear recent activity
  const clearHistory = () => {
    if (activeTab === "all" || activeTab === "tokens") {
      localStorage.removeItem('recentTokens');
    }
    if (activeTab === "all" || activeTab === "wallets") {
      localStorage.removeItem('recentWallets');
    }
    if (activeTab === "all" || activeTab === "transactions") {
      localStorage.removeItem('recentTransactions');
    }
    
    // Reload activities based on what was cleared
    if (activeTab === "all") {
      setRecentActivity([]);
    } else {
      setRecentActivity(prev => prev.filter(activity => activity.type !== activeTab.slice(0, -1)));
    }
  };
  
  // Helper function to format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Helper function to shorten address/signature
  const shortenString = (str: string, chars: number = 4) => {
    if (!str) return '';
    return `${str.substring(0, chars)}...${str.substring(str.length - chars)}`;
  };
  
  // Filter activities based on the active tab
  const filteredActivity = activeTab === "all" 
    ? recentActivity 
    : recentActivity.filter(activity => {
        const targetType = activeTab.slice(0, -1); // Remove 's' to get singular type
        return activity.type === targetType;
      });
  
  const renderTokenActivity = (activity: TokenActivity) => (
    <Link href={`/dashboard/analysis?tokenAddress=${activity.address}`} className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full overflow-hidden flex items-center justify-center">
          {activity.logo ? (
            <Image 
              src={activity.logo} 
              alt={activity.name} 
              width={40} 
              height={40} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <DollarSign className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <div>
          <div className="font-medium">{activity.name}</div>
          <div className="text-sm text-slate-400">{activity.symbol}</div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-medium">{formatUSD(activity.price)}</div>
        <div className="text-xs text-slate-400">
          {formatDate(activity.timestamp)}
        </div>
      </div>
    </Link>
  );
  
  const renderWalletActivity = (activity: WalletActivity) => (
    <Link href={`/dashboard/wallet?address=${activity.address}`} className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full overflow-hidden flex items-center justify-center">
          <Wallet className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <div className="font-medium">Wallet</div>
          <div className="text-sm font-mono text-slate-400">{shortenString(activity.address, 6)}</div>
        </div>
      </div>
      
      <div className="text-right">
        {activity.tokenCount && (
          <div className="font-medium">{activity.tokenCount} Tokens</div>
        )}
        <div className="text-xs text-slate-400">
          {formatDate(activity.timestamp)}
        </div>
      </div>
    </Link>
  );
  
  const renderTransactionActivity = (activity: TransactionActivity) => (
    <Link href={`/dashboard/transaction?signature=${activity.signature}`} className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full overflow-hidden flex items-center justify-center">
          <FileText className="h-5 w-5 text-sky-400" />
        </div>
        <div>
          <div className="font-medium">Transaction</div>
          <div className="text-sm font-mono text-slate-400">{shortenString(activity.signature, 6)}</div>
        </div>
      </div>
      
      <div className="text-right">
        {activity.status && (
          <div className={`font-medium ${activity.status === 'Success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {activity.status}
          </div>
        )}
        <div className="text-xs text-slate-400">
          {formatDate(activity.timestamp)}
        </div>
      </div>
    </Link>
  );
  
  if (recentActivity.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-6 text-center">
        <p className="text-slate-400 mb-4">No recent analysis activity</p>
        <p className="text-sm text-slate-500">
          Search for a Solana token, wallet address, or transaction hash above to begin tracking your activity
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 w-full bg-slate-700/30">
          <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <LayoutGrid className="h-4 w-4 mr-2" />
            All
          </TabsTrigger>
          <TabsTrigger value="tokens" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <DollarSign className="h-4 w-4 mr-2" />
            Tokens
          </TabsTrigger>
          <TabsTrigger value="wallets" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Wallet className="h-4 w-4 mr-2" />
            Wallets
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {filteredActivity.slice(0, 5).map((activity, index) => (
            <div 
              key={`${activity.type}-${index}`} 
              className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition"
            >
              {activity.type === 'token' && renderTokenActivity(activity as TokenActivity)}
              {activity.type === 'wallet' && renderWalletActivity(activity as WalletActivity)}
              {activity.type === 'transaction' && renderTransactionActivity(activity as TransactionActivity)}
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="tokens" className="mt-4">
          {filteredActivity.length === 0 ? (
            <div className="bg-slate-700/30 rounded-lg p-6 text-center">
              <p className="text-slate-400">No token analysis activity</p>
            </div>
          ) : (
            filteredActivity.slice(0, 5).map((activity, index) => (
              <div 
                key={`token-${index}`} 
                className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition"
              >
                {renderTokenActivity(activity as TokenActivity)}
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="wallets" className="mt-4">
          {filteredActivity.length === 0 ? (
            <div className="bg-slate-700/30 rounded-lg p-6 text-center">
              <p className="text-slate-400">No wallet analysis activity</p>
            </div>
          ) : (
            filteredActivity.slice(0, 5).map((activity, index) => (
              <div 
                key={`wallet-${index}`} 
                className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition"
              >
                {renderWalletActivity(activity as WalletActivity)}
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          {filteredActivity.length === 0 ? (
            <div className="bg-slate-700/30 rounded-lg p-6 text-center">
              <p className="text-slate-400">No transaction analysis activity</p>
            </div>
          ) : (
            filteredActivity.slice(0, 5).map((activity, index) => (
              <div 
                key={`transaction-${index}`} 
                className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition"
              >
                {renderTransactionActivity(activity as TransactionActivity)}
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
      
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
