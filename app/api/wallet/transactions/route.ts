import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const limit = searchParams.get('limit') || '5'; // Default to 5 transactions

  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    );
  }

  try {
    const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT;
    if (!rpcEndpoint) {
      throw new Error("RPC endpoint not configured");
    }

    const connection = new Connection(rpcEndpoint);
    const publicKey = new PublicKey(address);
    
    // Fetch parsed transaction signatures
    const signatures = await connection.getSignaturesForAddress(
      publicKey, 
      { limit: parseInt(limit) }
    );
    
    // Fetch full transaction details
    const transactions: (ParsedTransactionWithMeta | null)[] = await Promise.all(
      signatures.map(sig => 
        connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 })
      )
    );
    
    // Process transactions to extract useful information
    const processedTransactions = transactions
      .filter(tx => tx !== null)
      .map(tx => {
        const signature = tx?.transaction.signatures[0];
        const timestamp = tx?.blockTime ? new Date(tx.blockTime * 1000).toISOString() : null;
        const fee = tx?.meta?.fee || 0;

        // Extract transaction type and basic info
        let type = 'Unknown';
        let status = tx?.meta?.err ? 'Failed' : 'Success';
        let amount = null;
        let symbol = 'SOL';
        
        // Simple detection of transaction type
        if (tx?.meta?.logMessages) {
          const logMessages = tx.meta.logMessages.join(' ');
          if (logMessages.includes('Transfer')) type = 'Transfer';
          else if (logMessages.includes('Swap')) type = 'Swap';
          else if (logMessages.includes('Stake')) type = 'Stake';
          else if (logMessages.includes('CreateAccount')) type = 'Account Creation';
          else if (logMessages.includes('CloseAccount')) type = 'Account Close';
        }
        
        return {
          signature,
          timestamp,
          status,
          type,
          fee: fee / 1e9, // Convert lamports to SOL
          amount,
          symbol
        };
      });

    return NextResponse.json({
      address,
      transactions: processedTransactions
    });

  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet transactions' },
      { status: 500 }
    );
  }
}
