"use client";

import { Lock, Info, Coins, Users, Crown, Key, AlertTriangle, ExternalLink, Copy, Check } from "lucide-react";
import { formatNumber, shortenAddress } from "@/lib/utils";
import { DexPaidBadge } from "@/components/DexPaidBadge";
import { useState } from "react";

interface RugCheckData {
  mint: string;
  token: {
    supply: number;
    decimals: number;
    mintAuthority: string | null;
  };
  creator: string;
  tokenMeta: {
    name: string;
    symbol: string;
  };
  totalHolders: number;
  totalMarketLiquidity: number;
  markets: any[];
}

interface DexScreenerData {
  isPaid: boolean;
  message: string;
  details?: any;
}

interface TokenOverviewProps {
  data: RugCheckData | null;
  dexScreenerData: DexScreenerData | null;
  loading: boolean;
}

export function TokenOverview({ data, dexScreenerData, loading }: TokenOverviewProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (loading) {
    return <TokenOverviewSkeleton />;
  }

  if (!data) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-semibold">Token Overview</h2>
        </div>
        <p className="text-slate-400 text-sm">
          RugCheck data is unavailable for this token.
        </p>
      </div>
    );
  }

  // Calculate LP locked percentage from the first market (if available)
  const firstMarket = data.markets && data.markets.length > 0 ? data.markets[0] : null;
  const lpLockedPct = firstMarket?.lp?.lpLockedPct || 0;
  
  // Format supply with decimals
  const formattedSupply = formatNumber(data.token.supply / Math.pow(10, data.token.decimals));
  
  // Format market cap
  const marketCap = data.totalMarketLiquidity ? `$${formatNumber(data.totalMarketLiquidity)}` : '$0';

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-semibold">Token Overview</h2>
        </div>
        
        {dexScreenerData && (
          <DexPaidBadge 
            isPaid={dexScreenerData.isPaid} 
            message={dexScreenerData.message}
          />
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Mint */}
        <div>
          <div className="flex items-center mb-1 text-slate-400 text-sm">
            <Coins className="h-4 w-4 mr-1" />
            <span>Mint</span>
          </div>
          <div className="text-white font-medium">
            {data.tokenMeta.symbol}
          </div>
        </div>
        
        {/* Supply */}
        <div>
          <div className="flex items-center mb-1 text-slate-400 text-sm">
            <Coins className="h-4 w-4 mr-1" />
            <span>Supply</span>
          </div>
          <div className="text-white font-medium">
            {formattedSupply}
          </div>
        </div>
        
        {/* Creator */}
        <div>
          <div className="flex items-center mb-1 text-slate-400 text-sm">
            <Crown className="h-4 w-4 mr-1" />
            <span>Creator</span>
          </div>
          <div className="text-white font-mono text-sm flex items-center">
            <span>{shortenAddress(data.creator)}</span>
            <button 
              className="text-slate-500 hover:text-emerald-400 transition ml-1"
              onClick={() => copyToClipboard(data.creator, 'creator')}
              title="Copy creator address"
            >
              {copiedText === 'creator' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <a 
              href={`https://solscan.io/account/${data.creator}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-emerald-400 transition ml-1"
              title="View on Solscan"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        
        {/* Market Cap */}
        <div>
          <div className="flex items-center mb-1 text-slate-400 text-sm">
            <Coins className="h-4 w-4 mr-1" />
            <span>Market Cap</span>
          </div>
          <div className="text-white font-medium">
            {marketCap}
          </div>
        </div>
        
        {/* Holders */}
        <div>
          <div className="flex items-center mb-1 text-slate-400 text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span>Holders</span>
          </div>
          <div className="text-white font-medium">
            {formatNumber(data.totalHolders)}
          </div>
        </div>
        
        {/* Mint Authority */}
        <div>
          <div className="flex items-center mb-1 text-slate-400 text-sm">
            <Key className="h-4 w-4 mr-1" />
            <span>Mint Authority</span>
          </div>
          <div className="text-white font-medium">
            {data.token.mintAuthority ? shortenAddress(data.token.mintAuthority) : "-"}
          </div>
        </div>
        
        {/* LP Locked */}
        <div>
          <div className="flex items-center mb-1 text-slate-400 text-sm">
            <Lock className="h-4 w-4 mr-1" />
            <span>LP Locked</span>
          </div>
          <div className="text-white font-medium">
            {lpLockedPct.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenOverviewSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 animate-pulse">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-5 h-5 bg-slate-700 rounded-full"></div>
        <div className="h-6 bg-slate-700 w-40 rounded"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(7)].map((_, index) => (
          <div key={index}>
            <div className="h-4 bg-slate-700 w-24 rounded mb-2"></div>
            <div className="h-6 bg-slate-700 w-20 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
