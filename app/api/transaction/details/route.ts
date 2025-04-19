import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";
import { createSolanaConnection, handleSolanaError } from "@/lib/solana-connection";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const signature = searchParams.get('signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Transaction signature is required' },
      { status: 400 }
    );
  }

  try {
    const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT as string;
    if (!rpcEndpoint) {
      throw new Error("Solana RPC endpoint not configured");
    }

    const connection = createSolanaConnection(rpcEndpoint);
    
    // Fetch transaction details with parsed data
    const transaction = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0
    });
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    // Format transaction data for the frontend
    const formattedTransaction = {
      signature: signature, // Use the input signature directly
      blockTime: transaction.blockTime ? new Date(transaction.blockTime * 1000).toISOString() : null,
      status: transaction.meta?.err ? 'Failed' : 'Success',
      fee: transaction.meta?.fee ? transaction.meta.fee / 1e9 : null, // Convert lamports to SOL
      slot: transaction.slot,
      
      // Transaction participants
      accounts: transaction.transaction.message.accountKeys.map(key => ({
        pubkey: key.pubkey.toString(),
        signer: key.signer,
        writable: key.writable,
      })),
      
      // Extract instructions (simplified)
      instructions: transaction.transaction.message.instructions.map(instruction => {
        if ('parsed' in instruction) {
          return {
            programId: instruction.programId.toString(),
            type: instruction.parsed.type || 'Unknown',
            info: instruction.parsed.info || {},
          };
        }
        
        return {
          programId: instruction.programId.toString(),
          type: 'Binary',
          data: instruction.data || '',
        };
      }),
      
      // Error information if it exists
      error: transaction.meta?.err ? JSON.stringify(transaction.meta.err) : null,
      
      // Raw logs
      logs: transaction.meta?.logMessages || []
    };
    
    return NextResponse.json(formattedTransaction);

  } catch (error) {
    console.error('Error fetching transaction details:', error);
    const errorMessage = handleSolanaError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
