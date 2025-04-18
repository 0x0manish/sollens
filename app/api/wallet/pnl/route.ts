import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const resolution = searchParams.get('resolution') || '7d';
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.VYBE_API_KEY || 'WVxfd2Lhcintt8RZALqpsT77v7RdK3UJVwJQcJSLq4qyuN9y';
    
    const response = await fetch(
      `https://api.vybenetwork.xyz/account/pnl/${address}?resolution=${resolution}`,
      {
        headers: {
          'accept': 'application/json',
          'X-API-KEY': apiKey
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'No PNL data found for this wallet' },
          { status: 404 }
        );
      }
      
      throw new Error(`Vybe API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching wallet PNL data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet PNL data' },
      { status: 500 }
    );
  }
}
