"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TokenSearchForm() {
  const [isSearching, setIsSearching] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Reset search state on component mount and when URL changes
  useEffect(() => {
    const currentTokenAddress = searchParams.get('tokenAddress');
    if (currentTokenAddress) {
      setTokenAddress(currentTokenAddress);
    }
    setIsSearching(false);
  }, [searchParams]);
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!tokenAddress.trim()) return;
    
    setIsSearching(true);
    router.push(`/dashboard/analysis?tokenAddress=${tokenAddress.trim()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center">
      <input
        type="text"
        name="tokenAddress"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        placeholder="Enter Solana Token address"
        className="bg-slate-700 rounded-lg px-4 py-3 w-full text-white outline-none border border-slate-600 focus:border-emerald-500 transition-colors"
      />
      <Button 
        type="submit" 
        className="ml-3 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-6"
        disabled={isSearching}
      >
        {isSearching ? (
          <span className="animate-pulse">Analyzing...</span>
        ) : "Analyze Token"}
      </Button>
    </form>
  );
}