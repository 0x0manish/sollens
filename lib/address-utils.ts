import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

/**
 * Validates if a string is a valid Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if an address is an Ethereum address (to provide specific error messages)
 */
export function isEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Checks if a string is likely a Solana transaction signature
 * Solana transaction signatures are Base58-encoded strings
 */
export function isTransactionSignature(signature: string): boolean {
  // Solana transaction signatures are Base58-encoded strings
  // They are typically 87-88 characters long
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{85,}$/;
  return base58Regex.test(signature);
}

/**
 * Validates a transaction signature against the blockchain
 */
export async function validateTransactionSignature(signature: string, connection: Connection): Promise<boolean> {
  try {
    if (!isTransactionSignature(signature)) {
      return false;
    }
    
    // Check if transaction exists on-chain
    const transaction = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0
    });
    
    return transaction !== null;
  } catch (error) {
    console.error("Error validating transaction signature:", error);
    return false;
  }
}

/**
 * A safer approach to check if an account is a token mint
 * First checks account info before trying getTokenLargestAccounts
 */
export async function isTokenAddress(address: string, connection: Connection): Promise<boolean> {
  try {
    if (!isValidSolanaAddress(address)) {
      throw new Error("Invalid Solana address");
    }

    const publicKey = new PublicKey(address);
    
    // Approach 1: Check account info first - this is safer
    const accountInfo = await connection.getAccountInfo(publicKey);
    
    // If no account info exists, it's not a valid account
    if (!accountInfo) {
      console.log("No account info found for address:", address);
      return false;
    }
    
    // Check if it's owned by the Token Program (SPL tokens) 
    if (accountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
      console.log("Address appears to be a token based on owner:", address);
      return true;
    }
    
    // If it's not owned by the Token Program, try a safer check for token mints
    try {
      // Only attempt this for potential token mints to avoid unnecessary errors
      const tokenAccounts = await connection.getTokenLargestAccounts(publicKey);
      if (tokenAccounts && tokenAccounts.value && tokenAccounts.value.length > 0) {
        console.log("Address confirmed as token through accounts check:", address);
        return true;
      }
    } catch (tokenError) {
      // Expected for non-token accounts, no need to log or throw
      // This approach avoids showing error in console for wallet addresses
    }
    
    // If we reach here, it's likely a wallet address
    console.log("Address appears to be a wallet:", address);
    return false;
  } catch (error) {
    console.error("Error checking address type:", error);
    // Default to assuming it's a wallet address on error
    return false;
  }
}

/**
 * Analyzes address and determines its type
 * @param address Address to analyze
 * @param connection Solana RPC connection
 * @returns Promise<{ isValid: boolean, type: 'token' | 'wallet' | 'transaction' | 'invalid', error?: string }>
 */
export async function analyzeAddress(address: string, connection: Connection): Promise<{
  isValid: boolean;
  type: 'token' | 'wallet' | 'transaction' | 'invalid';
  error?: string;
}> {
  try {
    // Check for empty string
    if (!address || address.trim() === '') {
      return {
        isValid: false,
        type: 'invalid',
        error: 'Address cannot be empty'
      };
    }
    
    // Check for Ethereum address
    if (isEthereumAddress(address)) {
      return {
        isValid: false,
        type: 'invalid',
        error: 'Ethereum addresses are not supported. Please enter a Solana address.'
      };
    }
    
    // Check if it's a transaction signature format
    if (isTransactionSignature(address)) {
      // Validate the transaction exists on-chain
      const isValid = await validateTransactionSignature(address, connection);
      
      if (isValid) {
        return {
          isValid: true,
          type: 'transaction'
        };
      } else {
        return {
          isValid: false,
          type: 'invalid',
          error: 'Transaction signature not found on-chain'
        };
      }
    }
    
    // Check if it's a valid Solana address
    if (!isValidSolanaAddress(address)) {
      return {
        isValid: false,
        type: 'invalid',
        error: 'Invalid Solana address format'
      };
    }
    
    // Basic validation passed, now check if the address exists on-chain
    const publicKey = new PublicKey(address);
    const accountInfo = await connection.getAccountInfo(publicKey);
    
    // If account doesn't exist but address is valid format, it's still a valid wallet address
    // that might not have received any transactions yet
    if (!accountInfo) {
      console.log("Address is valid but no account info found:", address);
      return {
        isValid: true,
        type: 'wallet',  // Default to wallet for valid but empty accounts
      };
    }
    
    // Determine if it's a token or wallet address
    const isToken = await isTokenAddress(address, connection);
    
    return {
      isValid: true,
      type: isToken ? 'token' : 'wallet'
    };
  } catch (error) {
    console.error("Error analyzing address:", error);
    return {
      isValid: false,
      type: 'invalid',
      error: error instanceof Error ? error.message : 'Unknown error analyzing address'
    };
  }
}
