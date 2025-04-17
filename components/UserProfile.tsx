"use client";

import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { Check, Copy, LogOut, User, Wallet } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export function UserProfile() {
  const userContext = useUser();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Initialize and check for wallet when component mounts
  useEffect(() => {
    async function initializeWallet() {
      try {
        if (!userContext.user) return;

        // Debug user context in console
        console.log("User context:", userContext);
        
        // Check for profile picture in user data
        if (userContext.user?.image) {
          setProfilePicture(userContext.user.image as string);
        } else if ((userContext.user as any)?.picture) {
          setProfilePicture((userContext.user as any).picture as string);
        } else if ((userContext.user as any)?.photos?.[0]?.value) {
          setProfilePicture((userContext.user as any).photos[0].value as string);
        }
        
        if (userHasWallet(userContext)) {
          // Try to access the wallet address using various possible paths based on documentation
          if ((userContext as any).solana?.address) {
            setWalletAddress((userContext as any).solana.address);
            fetchWalletBalance((userContext as any).solana.address);
          } else if ((userContext as any).solana?.wallet?.publicKey?.toString()) {
            setWalletAddress((userContext as any).solana.wallet.publicKey.toString());
            fetchWalletBalance((userContext as any).solana.wallet.publicKey);
          } else if ((userContext as any).publicKey?.toString()) {
            setWalletAddress((userContext as any).publicKey.toString());
            fetchWalletBalance((userContext as any).publicKey);
          } else {
            console.log("Wallet exists but address not found in expected location");
          }
        } else if (userContext.createWallet) {
          try {
            setIsCreatingWallet(true);
            await userContext.createWallet();
            console.log("Wallet created, context:", userContext);
            
            // Check structure again after creation
            if ((userContext as any).solana?.address) {
              setWalletAddress((userContext as any).solana.address);
              fetchWalletBalance((userContext as any).solana.address);
            } else if ((userContext as any).solana?.wallet?.publicKey?.toString()) {
              setWalletAddress((userContext as any).solana.wallet.publicKey.toString());
              fetchWalletBalance((userContext as any).solana.wallet.publicKey);
            } else if ((userContext as any).publicKey?.toString()) {
              setWalletAddress((userContext as any).publicKey.toString());
              fetchWalletBalance((userContext as any).publicKey);
            }
          } catch (error) {
            console.error("Failed to create wallet:", error);
          } finally {
            setIsCreatingWallet(false);
          }
        }
      } catch (error) {
        console.error("Error in wallet initialization:", error);
      }
    }
    
    initializeWallet();
  }, [userContext]);
  
  const handleSignOut = async () => {
    try {
      if ((userContext as any).signOut) {
        await (userContext as any).signOut();
      }
      router.push('/login');
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };
  
  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  // Function to minify the wallet address
  const minifyAddress = (address: string | null): string => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  
  // Function to fetch wallet balance
  const fetchWalletBalance = async (publicKey: any) => {
    if (!publicKey) return;
    
    try {
      setIsLoadingBalance(true);
      // Use the environment variable for RPC endpoint
      const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT;
      
      if (!rpcEndpoint) {
        console.error("No RPC endpoint configured in environment variables");
        return;
      }
      
      const connection = new Connection(rpcEndpoint);
      
      // Convert string address to PublicKey if needed
      let solanaPublicKey;
      if (typeof publicKey === 'string') {
        solanaPublicKey = new PublicKey(publicKey);
      } else if (publicKey.toBase58) {
        // It's already a PublicKey object
        solanaPublicKey = publicKey;
      } else if (publicKey.toString) {
        // It might be another object with a toString method
        solanaPublicKey = new PublicKey(publicKey.toString());
      } else {
        console.error("Invalid public key format:", publicKey);
        throw new Error("Invalid public key format");
      }
      
      const balance = await connection.getBalance(solanaPublicKey);
      setWalletBalance(balance / LAMPORTS_PER_SOL); // Convert lamports to SOL
      
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setWalletBalance(null);
    } finally {
      setIsLoadingBalance(false);
    }
  };
  
  return (
    <div className="flex items-center gap-4 relative" ref={dropdownRef}>
      <div className="relative">
        <Button 
          variant="ghost" 
          className="rounded-full h-10 w-10 p-0 bg-slate-700 hover:bg-slate-600"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile Picture" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-slate-300" />
            )}
          </div>
        </Button>
        
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 rounded-lg bg-slate-800 border border-slate-700 shadow-lg z-50">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile Picture" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-slate-300" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{userContext.user?.name || "Solana User"}</p>
                  <p className="text-xs text-slate-400">Authenticated with Civic</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Authentication</span>
                  <span className="text-emerald-400 flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Verified
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Wallet</span>
                  {isCreatingWallet ? (
                    <span className="text-slate-300 text-xs">Creating...</span>
                  ) : walletAddress ? (
                    <span className="text-emerald-400 flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Connected
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">Not connected</span>
                  )}
                </div>
                
                {walletAddress && (
                  <div className="bg-slate-700/50 p-2 rounded flex items-center justify-between">
                    <div className="flex items-center">
                      <Wallet className="h-3 w-3 text-emerald-500 mr-2" />
                      <span className="text-xs font-mono text-slate-300" title={walletAddress}>
                        {minifyAddress(walletAddress)}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={copyToClipboard}
                      title="Copy wallet address"
                    >
                      <Copy className={`h-3 w-3 ${isCopied ? 'text-emerald-400' : 'text-slate-400'}`} />
                    </Button>
                  </div>
                )}
                
                {walletAddress && (
                  <div className="bg-slate-700/50 p-2 rounded mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Wallet className="h-3 w-3 text-emerald-500 mr-2" />
                        <span className="text-xs text-slate-400">SOL Balance:</span>
                      </div>
                      <span className="text-xs font-mono font-medium text-emerald-400">
                        {isLoadingBalance ? (
                          <span className="text-slate-300">Loading...</span>
                        ) : walletBalance !== null ? (
                          `${walletBalance.toFixed(4)} SOL`
                        ) : (
                          <span className="text-slate-300">Error loading balance</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-3 border-t border-slate-700">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 