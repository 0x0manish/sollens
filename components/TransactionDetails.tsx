"use client";

import { useState, useEffect } from 'react';
import { 
  Clock, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Terminal,
  CircleDollarSign,
  Server,
  Inbox,
  Share2,
  ListTree
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import toast from 'react-hot-toast';
import { TransactionAnalysisLoading } from "@/components/TransactionAnalysisLoading";

interface TransactionDetailsProps {
  signature: string;
}

export function TransactionDetails({ signature }: TransactionDetailsProps) {
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    async function fetchTransactionDetails() {
      if (!signature) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/transaction/details?signature=${signature}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch transaction details: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTransaction(data);
      } catch (err) {
        console.error('Error fetching transaction details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load transaction data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTransactionDetails();
  }, [signature]);

  // Format date utility
  const formatDate = (isoDateString: string | null) => {
    if (!isoDateString) return 'Unknown';
    try {
      const date = new Date(isoDateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Helper function to shorten an address for display
  const shortenAddress = (address: string, chars: number = 4): string => {
    if (!address) return '';
    return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
  };

  const copyToClipboard = (text: string, label: string = 'Value') => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  if (loading) {
    return <TransactionAnalysisLoading />;
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl border border-red-700 p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Transaction</h3>
        <p className="text-slate-400 mb-4">{error}</p>
        <Button className="bg-slate-700 hover:bg-slate-600 text-white" asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="bg-slate-800 rounded-xl border border-amber-700 p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-amber-500 mb-2">Transaction Not Found</h3>
        <p className="text-slate-400 mb-4">
          Transaction with signature <span className="font-mono bg-slate-700 px-2 py-1 rounded">{signature}</span> could not be found on the Solana blockchain.
        </p>
        <Button className="bg-slate-700 hover:bg-slate-600 text-white" asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transaction Header/Overview */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.status === 'Success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {transaction.status === 'Success' ? (
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold">Transaction Details</h1>
              <div className="flex items-center text-slate-400 text-sm mt-1">
                <span className="font-mono">{shortenAddress(signature, 8)}</span>
                <button 
                  className="ml-2 text-slate-500 hover:text-slate-300"
                  onClick={() => copyToClipboard(signature, 'Signature')}
                  title="Copy signature"
                >
                  <Copy className="h-3 w-3" />
                </button>
                <a 
                  href={`https://solscan.io/tx/${signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-slate-500 hover:text-slate-300"
                  title="View on Solscan"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.status === 'Success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
            {transaction.status}
          </div>
        </div>
        
        {/* Transaction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center text-slate-400 text-sm mb-1">
              <Clock className="h-4 w-4 mr-2" />
              <span>Timestamp</span>
            </div>
            <div className="text-lg font-medium">{formatDate(transaction.blockTime)}</div>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center text-slate-400 text-sm mb-1">
              <CircleDollarSign className="h-4 w-4 mr-2" />
              <span>Transaction Fee</span>
            </div>
            <div className="text-lg font-medium">{transaction.fee !== null ? `${transaction.fee} SOL` : 'Unknown'}</div>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center text-slate-400 text-sm mb-1">
              <Server className="h-4 w-4 mr-2" />
              <span>Slot</span>
            </div>
            <div className="text-lg font-medium">{transaction.slot || 'Unknown'}</div>
          </div>
        </div>
        
        {/* Tab Content */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-700 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="accounts" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Accounts
            </TabsTrigger>
            <TabsTrigger value="instructions" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Instructions
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <div className="bg-slate-700/30 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Inbox className="h-5 w-5 mr-2 text-emerald-500" />
                Transaction Overview
              </h3>
              
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-slate-700">
                  <div className="w-full md:w-1/3 text-slate-400">Signature</div>
                  <div className="w-full md:w-2/3 font-mono break-all flex items-center">
                    {signature}
                    <button 
                      className="ml-2 text-slate-500 hover:text-slate-300"
                      onClick={() => copyToClipboard(signature, 'Signature')}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-slate-700">
                  <div className="w-full md:w-1/3 text-slate-400">Status</div>
                  <div className="w-full md:w-2/3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'Success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-slate-700">
                  <div className="w-full md:w-1/3 text-slate-400">Timestamp</div>
                  <div className="w-full md:w-2/3">{formatDate(transaction.blockTime)}</div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-slate-700">
                  <div className="w-full md:w-1/3 text-slate-400">Fee</div>
                  <div className="w-full md:w-2/3">{transaction.fee !== null ? `${transaction.fee} SOL` : 'Unknown'}</div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-slate-700">
                  <div className="w-full md:w-1/3 text-slate-400">Slot</div>
                  <div className="w-full md:w-2/3">{transaction.slot || 'Unknown'}</div>
                </div>
                
                {transaction.error && (
                  <div className="flex flex-col md:flex-row md:items-start py-2 border-b border-slate-700">
                    <div className="w-full md:w-1/3 text-slate-400">Error</div>
                    <div className="w-full md:w-2/3 text-red-400 font-mono text-sm break-all bg-slate-800 p-2 rounded">
                      {transaction.error}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row md:items-center py-2">
                  <div className="w-full md:w-1/3 text-slate-400">View on Explorer</div>
                  <div className="w-full md:w-2/3">
                    <a 
                      href={`https://solscan.io/tx/${signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:text-emerald-400 flex items-center"
                    >
                      View on Solscan <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="accounts" className="mt-0">
            <div className="bg-slate-700/30 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-emerald-500" />
                Account Participants
              </h3>
              
              {transaction.accounts && transaction.accounts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-sm text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="pb-2">Address</th>
                        <th className="pb-2">Role</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.accounts.map((account: any, index: number) => (
                        <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                          <td className="py-3 font-mono text-sm">{shortenAddress(account.pubkey, 6)}</td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1">
                              {account.signer && (
                                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                                  Signer
                                </span>
                              )}
                              {account.writable && (
                                <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">
                                  Writable
                                </span>
                              )}
                              {!account.signer && !account.writable && (
                                <span className="bg-slate-600/20 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                                  Read-only
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <button 
                                className="text-slate-400 hover:text-white"
                                onClick={() => copyToClipboard(account.pubkey, 'Address')}
                                title="Copy address"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <a 
                                href={`https://solscan.io/account/${account.pubkey}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white"
                                title="View on Solscan"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                              <Link 
                                href={`/dashboard/wallet?address=${account.pubkey}`}
                                className="text-emerald-500 hover:text-emerald-400"
                                title="Analyze wallet"
                              >
                                <Button size="sm" variant="outline" className="h-7 px-2 bg-slate-700 border-slate-600 text-emerald-500 hover:text-emerald-400 hover:bg-slate-600">
                                  Analyze
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  No account information available
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="instructions" className="mt-0">
            <div className="bg-slate-700/30 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ListTree className="h-5 w-5 mr-2 text-emerald-500" />
                Transaction Instructions
              </h3>
              
              {transaction.instructions && transaction.instructions.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {transaction.instructions.map((instruction: any, index: number) => (
                    <AccordionItem key={index} value={`instruction-${index}`} className="border-b border-slate-700">
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <div className="flex items-center text-left">
                          <div className="bg-slate-700 w-7 h-7 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium">{instruction.type || 'Instruction'}</div>
                            <div className="text-xs text-slate-400 font-mono">{shortenAddress(instruction.programId, 6)}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-10 pb-4">
                          <div className="mb-2">
                            <span className="text-sm text-slate-400">Program:</span>
                            <div className="flex items-center text-sm font-mono mt-1">
                              {instruction.programId}
                              <button 
                                className="ml-2 text-slate-500 hover:text-slate-300"
                                onClick={() => copyToClipboard(instruction.programId, 'Program ID')}
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              <a 
                                href={`https://solscan.io/account/${instruction.programId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-slate-500 hover:text-slate-300"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                          
                          {instruction.type !== 'Binary' && instruction.info && (
                            <div className="mt-4">
                              <span className="text-sm text-slate-400">Instruction Data:</span>
                              <pre className="mt-2 p-3 bg-slate-800 rounded-md font-mono text-xs overflow-x-auto">
                                {JSON.stringify(instruction.info, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          {instruction.type === 'Binary' && instruction.data && (
                            <div className="mt-4">
                              <span className="text-sm text-slate-400">Raw Data:</span>
                              <div className="mt-2 p-3 bg-slate-800 rounded-md font-mono text-xs overflow-x-auto">
                                {instruction.data}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  No instruction information available
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="mt-0">
            <div className="bg-slate-700/30 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-emerald-500" />
                Transaction Logs
              </h3>
              
              {transaction.logs && transaction.logs.length > 0 ? (
                <div className="bg-slate-800 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
                  {transaction.logs.map((log: string, index: number) => (
                    <div key={index} className="py-1 border-b border-slate-700/50 last:border-b-0">
                      <span className="text-slate-500 mr-2">{index + 1}:</span>
                      <span className={log.includes('Error') ? 'text-red-400' : log.includes('success') ? 'text-emerald-400' : ''}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  No logs available for this transaction
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
