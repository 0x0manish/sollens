import { NextRequest, NextResponse } from 'next/server';
import { withApiMiddleware } from '../middleware';

const RUGCHECK_API_URL = 'https://api.rugcheck.xyz/v1/tokens';

async function handler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Token address is required' }, { status: 400 });
    }

    // Fetch data from RugCheck API
    try {
      console.log(`Fetching RugCheck data for Solana token: ${address}`);
      const response = await fetch(`${RUGCHECK_API_URL}/${address}/report`);
      
      if (!response.ok) {
        console.error(`RugCheck API error: ${response.status} ${response.statusText}`);
        return NextResponse.json(
          { 
            error: `Failed to fetch RugCheck data: ${response.statusText}`,
            status: response.status 
          }, 
          { status: 200 } // Return 200 to prevent JSON parsing errors
        );
      }

      // Check if the response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`RugCheck API returned non-JSON response: ${contentType}`);
        return NextResponse.json(
          { 
            error: 'External API returned non-JSON response',
            status: response.status
          }, 
          { status: 200 }
        );
      }

      const data = await response.json();
      console.log('RugCheck API response received');
      
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Error fetching from RugCheck API:', fetchError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch or parse RugCheck API data',
          details: fetchError instanceof Error ? fetchError.message : String(fetchError)
        }, 
        { status: 200 } // Return 200 to prevent cascading errors
      );
    }
  } catch (error) {
    console.error('Error in RugCheck handler:', error);
    return NextResponse.json(
      { error: 'Failed to process RugCheck data' }, 
      { status: 200 } // Return 200 to prevent cascading errors
    );
  }
}

export const GET = withApiMiddleware(handler);
