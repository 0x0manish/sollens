import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch("https://public-api.solscan.io/chaininfo", {
      method: "GET",
      headers: {
        token: process.env.SOLSCAN_API_TOKEN || ""
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chain info: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data
    });
  } catch (error) {
    console.error('Error fetching Solana chain info:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Solana chain information' 
      },
      { status: 500 }
    );
  }
}
