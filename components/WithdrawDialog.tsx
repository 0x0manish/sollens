"use client";

import { useState, useEffect } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
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
import { Input } from "@/components/ui/input";

// Helper function to prevent console errors from appearing
const silenceConsoleError = async <T,>(promise: Promise<T>): Promise<T> => {
  // Store original console.error
  const originalConsoleError = console.error;
  
  // Replace console.error with a no-op function temporarily
  console.error = () => {};
  
  try {
    // Execute the promise
    return await promise;
  } catch (error) {
    // Re-throw the error but without console logging
    throw error;
  } finally {
    // Restore original console.error
    console.error = originalConsoleError;
  }
};

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number | null;
}

export function WithdrawDialog({
  open,
  onOpenChange,
  walletBalance
}: WithdrawDialogProps) {
  const { publicKey, sendTransaction } = useWallet();
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  
  // Reset the form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Short delay to avoid visual flickering
      setTimeout(() => {
        if (!open) {
          setError(null);
          setTransactionHash(null);
          setIsProcessing(false);
        }
      }, 300);
    }
  }, [open]);
  
  // Input validation
  const isValidAddress = destinationAddress.length === 44 || destinationAddress.length === 43;
  const isValidAmount = !isNaN(Number(amount)) && Number(amount) > 0 && walletBalance !== null && Number(amount) <= walletBalance;
  
  const handleWithdraw = async () => {
    if (!isValidAddress || !isValidAmount || !publicKey) {
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
      
      // Create a new transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: solanaPublicKey,
          toPubkey: new PublicKey(destinationAddress),
          lamports: Number(amount) * LAMPORTS_PER_SOL
        })
      );
      
      // Sign and send the transaction with the connected wallet
      try {
        const signature = await silenceConsoleError(sendTransaction(transaction, connection)) as string;
        
        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');
        
        // Success! Show success dialog
        setTransactionHash(signature);
        setDestinationAddress("");
        setAmount("");
        
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
            errorMessage = "Transaction was rejected by user";
          } else {
            errorMessage = signError.message;
          }
        } else if (signError.code) {
          // Check for error codes
          if (signError.code === 4001) {
            errorMessage = "Transaction was rejected by user";
          }
        }
        
        // Reopen our dialog with the error
        setError(errorMessage);
        setIsProcessing(false);
        onOpenChange(true);
      }
    } catch (err: any) {
      // This handles errors before we even get to the signing stage
      console.error("Error preparing withdrawal:", err);
      setError(err.message || "Failed to process transaction");
      setIsProcessing(false);
      
      // If our dialog was closed due to an error, reopen it
      if (!open) {
        onOpenChange(true);
      }
    }
  };
  
  const handleMaxAmount = () => {
    if (walletBalance !== null) {
      // Reserve a small amount for transaction fees (0.001 SOL)
      const maxAmount = Math.max(0, walletBalance - 0.001);
      setAmount(maxAmount.toFixed(4));
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">Withdraw SOL</DialogTitle>
          <DialogDescription className="text-slate-400">
            Transfer SOL from your wallet to another address.
          </DialogDescription>
        </DialogHeader>
        
        {!transactionHash ? (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Available Balance
              </label>
              <div className="font-mono text-emerald-400 font-medium">
                {walletBalance !== null ? `${walletBalance.toFixed(4)} SOL` : "Loading..."}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Destination Address
              </label>
              <Input
                placeholder="Enter Solana address..."
                value={destinationAddress}
                onChange={(e) => {
                  setDestinationAddress(e.target.value);
                  setError(null);
                }}
                className="bg-slate-700 border-slate-600 text-white"
              />
              {destinationAddress && !isValidAddress && (
                <p className="text-red-400 text-xs">Please enter a valid Solana address</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">
                  Amount (SOL)
                </label>
                <button
                  type="button"
                  onClick={handleMaxAmount}
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  MAX
                </button>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                step="0.001"
                min="0"
                max={walletBalance?.toString() || "0"}
                className="bg-slate-700 border-slate-600 text-white"
              />
              {amount && !isValidAmount && (
                <p className="text-red-400 text-xs">
                  {Number(amount) <= 0 
                    ? "Amount must be greater than 0" 
                    : "Amount exceeds available balance"}
                </p>
              )}
            </div>
            
            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-md px-3 py-2 text-sm flex items-start">
                <AlertCircle className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="bg-emerald-900/30 border border-emerald-800 rounded-md p-4 text-center">
              <p className="text-emerald-300 font-medium mb-2">Transaction Successful!</p>
              <p className="text-sm text-slate-300">Your SOL has been sent.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Transaction Hash</label>
              <div className="bg-slate-700/50 p-2 rounded overflow-x-auto">
                <p className="text-xs font-mono text-slate-300 break-all">
                  {transactionHash}
                </p>
              </div>
              <div className="flex justify-center">
                <a
                  href={`https://solscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center mt-1"
                >
                  View on Solscan
                  <ArrowRight className="h-3 w-3 ml-1" />
                </a>
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
              <Button
                onClick={handleWithdraw}
                disabled={!isValidAddress || !isValidAmount || isProcessing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {isProcessing ? "Processing..." : "Confirm Withdraw"}
              </Button>
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
