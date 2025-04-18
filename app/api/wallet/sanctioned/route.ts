import { NextRequest, NextResponse } from "next/server";

const WEBACY_API_KEY = process.env.WEBACY_API_KEY || 'aebakDj9Yg82dePwxrBM57d9iDodWxzBaml8C8By';
const WEBACY_API_URL = 'https://api.webacy.com/addresses/sanctioned';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch sanctioned wallet data from Webacy API
    const response = await fetch(
      `${WEBACY_API_URL}/${address}?chain=sol`,
      {
        headers: {
          'accept': 'application/json',
          'x-api-key': WEBACY_API_KEY
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webacy API sanctioned check error:', errorText);
      return NextResponse.json(
        { error: `Failed to check sanctioned status: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error checking sanctioned status:', error);
    return NextResponse.json(
      { error: 'Failed to check sanctioned status' },
      { status: 500 }
    );
  }
}
