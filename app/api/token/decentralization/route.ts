import { NextRequest, NextResponse } from 'next/server';
import { withApiMiddleware } from '../middleware';

const BUBBLEMAP_API_URL = 'https://api-legacy.bubblemaps.io/map-metadata';

async function handler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Token address is required' }, { status: 400 });
    }

    // Fetch data from Bubblemap API
    try {
      console.log(`Fetching Bubblemap data for Solana token: ${address}`);
      const response = await fetch(`${BUBBLEMAP_API_URL}?chain=sol&token=${address}`);
      
      if (!response.ok) {
        console.error(`Bubblemap API error: ${response.status} ${response.statusText}`);
        // Return a structured error response instead of passing through the error
        return NextResponse.json(
          { 
            error: `Failed to fetch decentralization data: ${response.statusText}`,
            status: response.status 
          }, 
          { status: 200 } // Return 200 to prevent JSON parsing errors
        );
      }

      // Check if the response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`Bubblemap API returned non-JSON response: ${contentType}`);
        return NextResponse.json(
          { 
            error: 'External API returned non-JSON response',
            status: response.status
          }, 
          { status: 200 }
        );
      }

      const data = await response.json();
      console.log('Bubblemap API response:', data);
      
      // Check if the response has the expected format
      if (data && data.status === "OK") {
        return NextResponse.json(data);
      } else {
        console.error('Unexpected Bubblemap API response format:', data);
        return NextResponse.json(
          { 
            error: 'External API returned unexpected data format',
            receivedData: data
          }, 
          { status: 200 }
        );
      }
    } catch (fetchError) {
      console.error('Error fetching from Bubblemap API:', fetchError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch or parse external API data',
          details: fetchError instanceof Error ? fetchError.message : String(fetchError)
        }, 
        { status: 200 } // Return 200 to prevent cascading errors
      );
    }
  } catch (error) {
    console.error('Error in decentralization handler:', error);
    return NextResponse.json(
      { error: 'Failed to process decentralization data' }, 
      { status: 200 } // Return 200 to prevent cascading errors
    );
  }
}

export const GET = withApiMiddleware(handler); 