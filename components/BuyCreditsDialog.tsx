"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Coins, Check } from "lucide-react";
import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Helper function to prevent console errors from appearing
const silenceConsoleError = async <T,>(promise: Promise<T>): Promise<T> => {
  const originalConsoleError = console.error;
  console.error = () => {};
  
  try {
    return await promise;
  } catch (error) {
    throw error;
  } finally {
    console.error = originalConsoleError;
  }
};

interface BuyCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number | null;
}

export function BuyCreditsDialog({
  open,
  onOpenChange,
  walletBalance
}: BuyCreditsDialogProps) {
  const { publicKey, sendTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const CREDIT_PRICE_SOL = 0.1;
  const CREDITS_AMOUNT = 1000;
  const RECIPIENT_WALLET = process.env.NEXT_PUBLIC_CREDITS_RECIPIENT_WALLET || "CRKViCKjQ6hpPmf7tJq29kjw3BTGCRjL5xsytzFzSgGL";
  
  // Reset the dialog state when it opens/closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        if (!open) {
          setError(null);
          setTransactionHash(null);
          setIsProcessing(false);
        }
      }, 300);
    }
  }, [open]);
  
  // Check if user has sufficient balance
  const hasSufficientBalance = walletBalance !== null && walletBalance >= CREDIT_PRICE_SOL;
  
  const handleBuyCredits = async () => {
    if (!hasSufficientBalance || !publicKey) {
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      // Get RPC endpoint from environment variable
      const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT;
      
      if (!rpcEndpoint) {
        throw new Error("No RPC endpoint configured");
      }
      
      const connection = new Connection(rpcEndpoint);
      
      const solanaPublicKey = publicKey;
      
      // Close our dialog first before attempting transaction
      onOpenChange(false);
      
      // Wait for our dialog to fully close
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Create a new transaction to buy credits
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: solanaPublicKey,
          toPubkey: new PublicKey(RECIPIENT_WALLET),
          lamports: CREDIT_PRICE_SOL * LAMPORTS_PER_SOL
        })
      );
      
      // Sign and send the transaction with the connected wallet
      try {
        const signature = await silenceConsoleError(sendTransaction(transaction, connection)) as string;
        
        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');
        
        // Success! Show success dialog
        setTransactionHash(signature);
        
        // Reopen our dialog with the success view
        onOpenChange(true);
      } catch (signError: any) {
        console.log("Transaction signing error:", signError);
        
        let errorMessage = "Transaction failed";
        
        // Check for common error patterns
        if (signError.message) {
          if (signError.message.includes('User rejected') || 
              signError.message.includes('was not confirmed') ||
              signError.message.includes('cancelled') ||
              signError.message.includes('rejected') ||
              signError.message.includes('declined') ||
              signError.message.includes('dismissed') ||
              signError.message.includes('denied')) {
            errorMessage = "Transaction was rejected";
          } else {
            errorMessage = signError.message;
          }
        } else if (signError.code) {
          if (signError.code === 4001) {
            errorMessage = "Transaction was rejected";
          }
        }
        
        // Reopen our dialog with the error
        setError(errorMessage);
        setIsProcessing(false);
        onOpenChange(true);
      }
    } catch (err: any) {
      console.error("Error preparing transaction:", err);
      setError(err.message || "Failed to process transaction");
      setIsProcessing(false);
      
      // If our dialog was closed due to an error, reopen it
      if (!open) {
        onOpenChange(true);
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">Buy Credits</DialogTitle>
          <DialogDescription className="text-slate-400">
            Purchase credits to use for advanced analysis features.
          </DialogDescription>
        </DialogHeader>
        
        {!transactionHash ? (
          <div className="space-y-6 py-4">
            {!hasSufficientBalance ? (
              <div className="bg-red-900/30 border border-red-800 rounded-md px-4 py-3 text-sm flex items-start">
                <AlertCircle className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-200 font-medium">Insufficient Balance</p>
                  <p className="text-red-300/80 mt-1">
                    You need at least {CREDIT_PRICE_SOL} SOL to purchase credits.
                    {walletBalance !== null && (
                      <span> Your current balance is {walletBalance.toFixed(4)} SOL.</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Amount:</span>
                    <span className="text-lg font-medium text-emerald-400">{CREDITS_AMOUNT} Credits</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Price:</span>
                    <span className="text-emerald-400 font-mono">{CREDIT_PRICE_SOL} SOL</span>
                  </div>
                  <div className="mt-4 text-xs text-slate-400">
                    Credits will be added to your account immediately after the transaction is confirmed.
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-900/30 border border-red-800 rounded-md px-3 py-2 text-sm flex items-start">
                    <AlertCircle className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-red-200">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="bg-emerald-900/30 border border-emerald-800 rounded-md p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="h-10 w-10 bg-emerald-900/50 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-emerald-300 font-medium mb-1">Transaction Successful!</p>
              <p className="text-sm text-slate-300">{CREDITS_AMOUNT} credits have been added to your account.</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-slate-400 text-center">
                Transaction Hash:
              </div>
              <div className="bg-slate-700/50 p-2 rounded overflow-x-auto">
                <p className="text-xs font-mono text-slate-300 break-all">
                  {transactionHash}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {!transactionHash ? (
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Cancel
              </Button>
              
              {hasSufficientBalance && (
                <Button
                  onClick={handleBuyCredits}
                  disabled={isProcessing || !hasSufficientBalance}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  {isProcessing ? "Processing..." : "Buy Credits"}
                </Button>
              )}
            </div>
          ) : (
            <Button
              onClick={() => {
                setTransactionHash(null);
                onOpenChange(false);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
