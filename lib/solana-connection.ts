import { Commitment, Connection, ConnectionConfig } from '@solana/web3.js';

// Maximum number of retries for rate-limited requests
const MAX_RETRIES = 3;

// Initial delay for retry in milliseconds
const INITIAL_RETRY_DELAY = 1000;

/**
 * Create a Solana connection with retry and error handling capabilities
 * This handles rate limiting (429) errors with exponential backoff
 */
export function createSolanaConnection(
  endpoint: string, 
  config?: ConnectionConfig
): Connection {
  const connection = new Connection(endpoint, config);

  // Create a safe proxy for the connection object
  return new Proxy(connection, {
    get(target, prop, receiver) {
      // Get the original property
      const originalProperty = Reflect.get(target, prop, receiver);
      
      // If it's a method we want to wrap with retry logic
      if (
        typeof originalProperty === 'function' && 
        [
          'getAccountInfo',
          'getTokenAccountsByOwner',
          'getTokenLargestAccounts',
          'getParsedTokenAccountsByOwner',
          'getSignaturesForAddress',
        ].includes(prop.toString())
      ) {
        // Return a wrapped function with retry logic
        return async (...args: any[]) => {
          let retries = 0;
          let lastError: Error | null = null;
          
          while (retries <= MAX_RETRIES) {
            try {
              const result = await originalProperty.apply(target, args);
              return result;
            } catch (error: any) {
              lastError = error;
              
              // Check if it's a rate limit error (429)
              const isRateLimit = error?.message?.includes('429') || 
                                 error?.code === 429 || 
                                 error?.statusCode === 429;
              
              if (!isRateLimit || retries >= MAX_RETRIES) {
                // Not a rate limit error or we've exceeded retries
                throw error;
              }
              
              // Calculate delay with exponential backoff
              const delay = INITIAL_RETRY_DELAY * Math.pow(2, retries);
              console.warn(`Server responded with 429. Retrying after ${delay}ms delay...`);
              
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, delay));
              retries++;
            }
          }
          
          // If we get here, we've exceeded retries
          throw lastError || new Error('Exceeded maximum retries for RPC request');
        };
      }
      
      // Return original property for anything else
      return originalProperty;
    }
  });
}

/**
 * Handle Solana RPC errors and provide user-friendly messages
 */
export function handleSolanaError(error: any): string {
  // Extract message from various error formats
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  
  // Check for specific error types
  if (errorMessage.includes('429') || errorMessage.includes('Too many requests')) {
    return 'The Solana network is currently busy. Please try again in a moment.';
  }
  
  if (errorMessage.includes('timeout')) {
    return 'Connection to Solana network timed out. Please check your internet connection and try again.';
  }
  
  if (errorMessage.includes('failed to fetch')) {
    return 'Unable to connect to Solana network. Please check your internet connection.';
  }
  
  if (errorMessage.includes('Invalid public key')) {
    return 'Invalid Solana address format.';
  }
  
  // Return a general error message for other cases
  return `Solana error: ${errorMessage}`;
}
