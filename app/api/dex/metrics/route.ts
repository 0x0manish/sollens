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
      'https://api.messari.io/metrics/v1/exchanges?type=decentralized&typeRankCutoff=10',
      {
        headers: {
          'accept': 'application/json',
          'x-messari-api-key': apiKey
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
    console.error('Error fetching DEX metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DEX metrics' },
      { status: 500 }
    );
  }
}
