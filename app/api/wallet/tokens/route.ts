import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createSolanaConnection, handleSolanaError } from "@/lib/solana-connection";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    );
  }

  try {
    // Use the Solana RPC endpoint from environment variables
    const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT as string;
    if (!rpcEndpoint) {
      throw new Error("Solana RPC endpoint not configured");
    }

    // Use our enhanced connection with retry logic
    const connection = createSolanaConnection(rpcEndpoint);

    const publicKey = new PublicKey(address);
    
    // Fetch all token accounts owned by this wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    
    // Process token accounts to extract useful information
    const tokens = tokenAccounts.value.map(tokenAccount => {
      const accountData = tokenAccount.account.data.parsed.info;
      const mintAddress = accountData.mint;
      const amount = accountData.tokenAmount.uiAmount;
      const decimals = accountData.tokenAmount.decimals;
      
      return {
        tokenAccount: tokenAccount.pubkey.toString(),
        mint: mintAddress,
        amount,
        decimals,
        // We'll add token metadata like name and symbol in a later enhancement
        // when we implement token metadata lookup
      };
    }).filter(token => token.amount > 0); // Only include tokens with non-zero balance
    
    return NextResponse.json({
      address,
      tokens
    });

  } catch (error) {
    console.error('Error fetching wallet tokens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet tokens' },
      { status: 500 }
    );
  }
}
