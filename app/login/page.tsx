"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Search, CircleUser } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Search className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold">Sollens</h1>
        </Link>
      </header>

      <div className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-emerald-500/30 rounded-2xl blur-xl"></div>
            <div className="relative bg-slate-800 p-8 rounded-xl border border-slate-700">
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  <CircleUser className="h-12 w-12 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
                <p className="text-slate-300">Securely connect your Solana wallet.</p>
              </div>
              <div className="flex justify-center">
                <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-900 py-8 w-full mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Sollens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
