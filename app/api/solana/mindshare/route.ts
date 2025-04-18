import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.MESSARI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }
    
    const response = await fetch(
      'https://api.messari.io/signal/v0/assets/b3d5d66c-26a2-404c-9325-91dc714a722b',
      {
        headers: {
          'accept': 'application/json',
          'X-MESSARI-API-KEY': apiKey
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );
    
    if (!response.ok) {
      throw new Error(`Messari API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Solana mindshare data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Solana mindshare data' },
      { status: 500 }
    );
  }
}
