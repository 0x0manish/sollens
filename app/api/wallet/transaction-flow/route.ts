import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js";
import { createSolanaConnection, handleSolanaError } from "@/lib/solana-connection";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const limitParam = searchParams.get('limit');
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  const minAmountParam = searchParams.get('minAmount');
  
  // Parse parameters with defaults
  const limit = limitParam ? parseInt(limitParam, 10) : 10;
  const startDate = startDateParam ? new Date(startDateParam) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 30 days ago
  const endDate = endDateParam ? new Date(endDateParam) : new Date(); // Default now
  const minAmount = minAmountParam ? parseFloat(minAmountParam) : 0; // Default 0 SOL

  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    );
  }

  try {
    const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT as string;
    if (!rpcEndpoint) {
      throw new Error("Solana RPC endpoint not configured");
    }

    const connection = createSolanaConnection(rpcEndpoint);
    const publicKey = new PublicKey(address);
    
    // Fetch parsed transaction signatures
    const signatures = await connection.getSignaturesForAddress(
      publicKey, 
      { 
        limit: limit,
        before: undefined,
        until: undefined
      }
    );
    
    // Filter by date if needed
    const filteredSignatures = signatures.filter(sig => {
      if (!sig.blockTime) return false;
      const txDate = new Date(sig.blockTime * 1000);
      return txDate >= startDate && txDate <= endDate;
    });
    
    // Fetch full transaction details
    const transactions: (ParsedTransactionWithMeta | null)[] = await Promise.all(
      filteredSignatures.map(sig => 
        connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 })
      )
    );
    
    // Build network visualization data
    const nodes: Record<string, {id: string, transactions: number, volume: number, label: string}> = {};
    const edges: Array<{source: string, target: string, amount: number, signature: string, timestamp: Date | null, type: string}> = [];
    
    // First, identify the central node (the main wallet address)
    nodes[address] = {
      id: address,
      transactions: 0,
      volume: 0,
      label: `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
    };
    
    // Process transactions to extract network flow data
    transactions
      .filter(tx => tx !== null)
      .forEach(tx => {
        if (!tx || !tx.meta) return;
        
        const signature = tx.transaction.signatures[0];
        const timestamp = tx.blockTime ? new Date(tx.blockTime * 1000) : null;
        const status = tx.meta.err ? 'Failed' : 'Success';
        
        // Only include successful transactions that have parsed instructions
        if (status === 'Failed' || !tx.transaction.message.instructions) return;
        
        // Extract transaction participants and flows
        tx.transaction.message.instructions.forEach(instruction => {
          if ('parsed' in instruction && instruction.parsed?.type === 'transfer') {
            const info = instruction.parsed?.info;
            if (!info) return;
            
            const { source, destination, lamports } = info;
            if (!source || !destination || !lamports) return;
            
            const amount = lamports / 1e9; // Convert lamports to SOL
            
            // Skip if amount is below the minimum filter
            if (amount < minAmount) return;
            
            // Add nodes if they don't exist
            if (!nodes[source]) {
              nodes[source] = {
                id: source,
                transactions: 0,
                volume: 0,
                label: `${source.substring(0, 4)}...${source.substring(source.length - 4)}`
              };
            }
            
            if (!nodes[destination]) {
              nodes[destination] = {
                id: destination,
                transactions: 0,
                volume: 0,
                label: `${destination.substring(0, 4)}...${destination.substring(destination.length - 4)}`
              };
            }
            
            // Update node statistics
            nodes[source].transactions += 1;
            nodes[source].volume += amount;
            nodes[destination].transactions += 1;
            nodes[destination].volume += amount;
            
            // Create edge for this transfer
            edges.push({
              source,
              target: destination,
              amount,
              signature,
              timestamp,
              type: 'Transfer'
            });
          }
        });
      });
    
    return NextResponse.json({
      address,
      nodes: Object.values(nodes),
      edges,
      dateRange: {
        start: startDate,
        end: endDate
      }
    });

  } catch (error) {
    console.error('Error fetching wallet transaction flow:', error);
    const errorMessage = handleSolanaError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
