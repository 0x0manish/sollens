import { NextRequest, NextResponse } from 'next/server';
import { withApiMiddleware } from '../middleware';

const DEXSCREENER_API_URL = 'https://api.dexscreener.com/orders/v1/solana';

async function handler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Token address is required' }, { status: 400 });
    }

    // Fetch data from DexScreener API
    try {
      console.log(`Fetching DexScreener data for Solana token: ${address}`);
      const response = await fetch(`${DEXSCREENER_API_URL}/${address}`);
      
      if (!response.ok) {
        console.error(`DexScreener API error: ${response.status} ${response.statusText}`);
        
        // If it's a 404, it means the token hasn't paid for DEX features
        if (response.status === 404) {
          return NextResponse.json({ 
            isPaid: false,
            message: 'Token has not paid for DEX features'
          });
        }
        
        // For other errors, return a structured error response
        return NextResponse.json({ 
          error: `Failed to fetch DexScreener data: ${response.statusText}`,
          status: response.status,
          isPaid: false,
          message: 'Information not available'
        }, { status: 200 }); // Return 200 to prevent cascading errors
      }

      // Check if the response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`DexScreener API returned non-JSON response: ${contentType}`);
        return NextResponse.json({ 
          error: 'External API returned non-JSON response',
          status: response.status,
          isPaid: false,
          message: 'Information not available'
        }, { status: 200 });
      }

      const data = await response.json();
      console.log('DexScreener API response:', data);
      
      // Check if we have valid data with paymentTimestamp
      if (Array.isArray(data) && data.length > 0) {
        // If any entry has a paymentTimestamp, consider it as paid
        const isPaid = data.some(entry => entry.paymentTimestamp);
        
        return NextResponse.json({
          isPaid,
          message: isPaid ? 'DEX paid' : 'DEX not paid',
          details: data
        });
      } else {
        return NextResponse.json({
          isPaid: false,
          message: 'Information not available',
          details: data
        });
      }
      
    } catch (fetchError) {
      console.error('Error fetching from DexScreener API:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to fetch or parse DexScreener API data',
        details: fetchError instanceof Error ? fetchError.message : String(fetchError),
        isPaid: false,
        message: 'Information not available'
      }, { status: 200 }); // Return 200 to prevent cascading errors
    }
  } catch (error) {
    console.error('Error in DexScreener handler:', error);
    return NextResponse.json({ 
      error: 'Failed to process DexScreener data',
      isPaid: false,
      message: 'Information not available' 
    }, { status: 200 }); // Return 200 to prevent cascading errors
  }
}

export const GET = withApiMiddleware(handler);
