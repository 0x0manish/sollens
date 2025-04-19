import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if the API token is available
    if (!process.env.SOLSCAN_API_TOKEN) {
      console.warn('Missing SOLSCAN_API_TOKEN environment variable');
      // Return mock data with a warning message instead of failing
      return NextResponse.json({
        success: true,
        data: {
          blockHeight: 0,
          currentEpoch: 0,
          absoluteSlot: 0,
          transactionCount: 0
        },
        warning: 'Using placeholder data. Solscan API token not configured.'
      });
    }
    
    const response = await fetch("https://public-api.solscan.io/chaininfo", {
      method: "GET",
      headers: {
        token: process.env.SOLSCAN_API_TOKEN
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chain info: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate the response structure
    if (!data || !data.data) {
      throw new Error('Invalid response format from Solscan API');
    }
    
    // Ensure all expected fields are present with fallbacks
    const chainData = {
      blockHeight: data.data.blockHeight || 0,
      currentEpoch: data.data.currentEpoch || 0,
      absoluteSlot: data.data.absoluteSlot || 0,
      transactionCount: data.data.transactionCount || 0
    };
    
    return NextResponse.json({
      success: true,
      data: chainData
    });
  } catch (error) {
    console.error('Error fetching Solana chain info:', error);
    // Return a structured error with fallback data
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch Solana chain information',
        data: {
          blockHeight: 0,
          currentEpoch: 0,
          absoluteSlot: 0,
          transactionCount: 0
        }
      },
      { status: 500 }
    );
  }
}
