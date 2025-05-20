"use client";

import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { WithdrawDialog } from "./WithdrawDialog";
import { BuyCreditsDialog } from "./BuyCreditsDialog";

export function UserProfile() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBuyCredits, setShowBuyCredits] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      if (!publicKey) {
        setBalance(null);
        return;
      }
      const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT as string;
      if (!rpcEndpoint) return;
      const connection = new Connection(rpcEndpoint);
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    }
    fetchBalance();
  }, [publicKey]);

  const minifyAddress = (addr: string) => `${addr.slice(0,4)}...${addr.slice(-4)}`;

  return (
    <div className="flex items-center gap-3">
      <WalletMultiButton className="!bg-slate-700 hover:!bg-slate-600" />
      {connected && publicKey && (
        <>
          <span className="text-xs text-slate-400 font-mono">
            {minifyAddress(publicKey.toBase58())}
          </span>
          <span className="text-xs text-emerald-400 font-mono">
            {balance !== null ? `${balance.toFixed(4)} SOL` : "..."}
          </span>
          <Button size="sm" variant="ghost" onClick={() => setShowBuyCredits(true)}>
            Buy Credits
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowWithdraw(true)}>
            Withdraw
          </Button>
          <WithdrawDialog
            open={showWithdraw}
            onOpenChange={setShowWithdraw}
            walletBalance={balance}
          />
          <BuyCreditsDialog
            open={showBuyCredits}
            onOpenChange={setShowBuyCredits}
            walletBalance={balance}
          />
        </>
      )}
    </div>
  );
}
