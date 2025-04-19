"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Connection } from "@solana/web3.js";
import { analyzeAddress } from "@/lib/address-utils";
import { AlertCircle } from "lucide-react";
import { createSolanaConnection, handleSolanaError } from "@/lib/solana-connection";

export function EnhancedSearchForm() {
  const [address, setAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Reset state on component mount and URL changes
  useEffect(() => {
    const currentAddress = searchParams.get('address') || 
                         searchParams.get('tokenAddress') || 
                         searchParams.get('signature');
    if (currentAddress) {
      setAddress(currentAddress);
    }
    setIsProcessing(false);
    setError(null);
  }, [searchParams]);
  
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedAddress = address.trim();
    
    if (!trimmedAddress) {
      setError("Please enter a Solana address or transaction signature");
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      // Auto-detect address type
      const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT;
      if (!rpcEndpoint) {
        throw new Error("RPC endpoint not configured");
      }
      
      // Use our enhanced connection with retry logic for rate limiting
      const connection = createSolanaConnection(rpcEndpoint);
      
      try {
        const analysis = await analyzeAddress(trimmedAddress, connection);
        
        if (!analysis.isValid) {
          setError(analysis.error || "Invalid address or signature");
          setIsProcessing(false);
          return;
        }
        
        // Save search to history based on type
        if (analysis.type === 'token') {
          // Token searches are already saved elsewhere in the codebase
          router.push(`/dashboard/analysis?tokenAddress=${trimmedAddress}`);
        } else if (analysis.type === 'transaction') {
          // Save transaction to history
          saveToSearchHistory('recentTransactions', {
            type: 'transaction',
            signature: trimmedAddress,
            timestamp: Date.now()
          });
          router.push(`/dashboard/transaction?signature=${trimmedAddress}`);
        } else {
          // Save wallet to history
          saveToSearchHistory('recentWallets', {
            type: 'wallet',
            address: trimmedAddress,
            timestamp: Date.now()
          });
          
          const currentUrl = window.location.pathname + window.location.search;
          const targetUrl = `/dashboard/wallet?address=${trimmedAddress}`;
          
          // If we're already on the same URL, force a refresh
          if (currentUrl === targetUrl) {
            // Add a timestamp to force refresh
            router.refresh();
            
            // Reset loading state after a short delay
            setTimeout(() => {
              setIsProcessing(false);
            }, 1000);
          } else {
            router.push(targetUrl);
          }
        }
      } catch (error) {
        console.error("Address analysis error:", error);
        // Use our enhanced error handler for user-friendly messages
        const friendlyError = handleSolanaError(error);
        setError(friendlyError);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Address analysis error:", error);
      setError(error instanceof Error ? error.message : "Error analyzing address");
      setIsProcessing(false);
    }
  };
  
  // Helper function to save search history to localStorage
  const saveToSearchHistory = (key: string, item: any) => {
    try {
      // Get existing history
      const existingHistory = localStorage.getItem(key);
      let history = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Check if this item already exists (avoid duplicates)
      const isDuplicate = history.some((historyItem: any) => 
        (key === 'recentTransactions' && historyItem.signature === item.signature) ||
        (key === 'recentWallets' && historyItem.address === item.address)
      );
      
      if (!isDuplicate) {
        // Add new item at the beginning
        history = [item, ...history];
        
        // Limit history to 20 items
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        
        // Save back to localStorage
        localStorage.setItem(key, JSON.stringify(history));
      } else {
        // Update timestamp for existing item
        history = history.map((historyItem: any) => {
          if ((key === 'recentTransactions' && historyItem.signature === item.signature) ||
              (key === 'recentWallets' && historyItem.address === item.address)) {
            return {...historyItem, timestamp: Date.now()};
          }
          return historyItem;
        });
        
        // Sort by timestamp again
        history.sort((a: any, b: any) => b.timestamp - a.timestamp);
        
        // Save back to localStorage
        localStorage.setItem(key, JSON.stringify(history));
      }
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex w-full flex-col">
        <div className="flex w-full items-center">
          <input
            type="text"
            name="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError(null);
            }}
            autoComplete="off"
            placeholder="Enter Solana token, wallet address, or transaction signature"
            className="bg-slate-700 rounded-lg px-4 py-3 w-full text-white outline-none border border-slate-600 focus:border-emerald-500 transition-colors"
          />
          <Button 
            type="submit" 
            className="ml-3 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-6"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="animate-pulse">Analyzing...</span>
            ) : "Analyze"}
          </Button>
        </div>
        
        {error && (
          <div className="mt-2 text-red-400 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
