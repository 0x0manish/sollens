import { NextRequest, NextResponse } from 'next/server';
import { withApiMiddleware } from '../middleware';

const CHECKDEX_API_URL = 'https://www.checkdex.xyz/api/getPairs';
const BUBBLEMAP_API_URL = 'https://api-legacy.bubblemaps.io/map-metadata';

async function handler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Token address is required' }, { status: 400 });
    }

    // Fetch data from CheckDex API and Bubblemap API directly
    const [checkdexResponse, bubbleMapResponse] = await Promise.all([
      fetch(`${CHECKDEX_API_URL}?address=${address}`),
      fetch(`${BUBBLEMAP_API_URL}?chain=sol&token=${address}`).catch(error => {
        console.error('Error fetching decentralization data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch decentralization data' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    ]);
    
    if (!checkdexResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch token data: ${checkdexResponse.statusText}` }, 
        { status: checkdexResponse.status }
      );
    }

    const checkdexData = await checkdexResponse.json();
    
    // Parse decentralization data if available
    let decentralizationData = null;
    if (bubbleMapResponse.ok) {
      try {
        const contentType = bubbleMapResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const decData = await bubbleMapResponse.json();
          
          // Check if the response has the expected format
          if (decData.status === "OK" && decData.decentralisation_score !== undefined) {
            decentralizationData = decData;
          } else {
            console.error('Unexpected decentralization data format:', decData);
            decentralizationData = { 
              error: 'Unexpected data format from decentralization API', 
              receivedData: decData 
            };
          }
        } else {
          console.error(`Non-JSON response from Bubblemap API: ${contentType}`);
          decentralizationData = { error: 'Non-JSON response from decentralization API' };
        }
      } catch (parseError) {
        console.error('Error parsing decentralization response:', parseError);
        decentralizationData = { error: 'Failed to parse decentralization data' };
      }
    } else {
      console.error(`Bubblemap API response not OK: ${bubbleMapResponse.status} ${bubbleMapResponse.statusText}`);
      decentralizationData = { 
        error: `Decentralization API returned status ${bubbleMapResponse.status}` 
      };
    }
    
    // Extract token info from the first available pair
    const tokenInfo = checkdexData.pairs && checkdexData.pairs.length > 0 
      ? extractTokenInfo(checkdexData.pairs, address)
      : null;
    
    // Calculate analytics
    const analytics = calculateAnalytics(checkdexData.pairs || []);
    
    return NextResponse.json({
      address,
      tokenInfo,
      pairs: checkdexData.pairs || [],
      analytics,
      decentralization: decentralizationData,
      pageSize: checkdexData.pageSize,
      page: checkdexData.page,
      cursor: checkdexData.cursor
    });
  } catch (error) {
    console.error('Error fetching token data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token data' }, 
      { status: 500 }
    );
  }
}

export const GET = withApiMiddleware(handler);

function extractTokenInfo(pairs: any[], tokenAddress: string) {
  // Find the first pair with the most liquidity
  const sortedPairs = [...pairs].sort((a, b) => b.liquidityUsd - a.liquidityUsd);
  const firstPair = sortedPairs[0];
  
  if (!firstPair || !firstPair.pair) {
    return null;
  }
  
  // Find the token in the pair that matches our address
  const token = firstPair.pair.find((t: any) => t.tokenAddress === tokenAddress);
  
  if (!token) {
    return null;
  }
  
  return {
    address: token.tokenAddress,
    name: token.tokenName,
    symbol: token.tokenSymbol,
    logo: token.tokenLogo,
    decimals: token.tokenDecimals,
    price: firstPair.usdPrice,
    priceChange24h: firstPair.usdPrice24hrPercentChange,
    volume24h: calculateTotalVolume(pairs),
    liquidityUsd: calculateTotalLiquidity(pairs),
    exchanges: getUniqueExchanges(pairs),
    activePairs: countActivePairs(pairs)
  };
}

function calculateAnalytics(pairs: any[]) {
  const totalLiquidity = calculateTotalLiquidity(pairs);
  const totalVolume = calculateTotalVolume(pairs);
  
  // Get active pools
  const activePools = pairs.filter(pair => !pair.inactivePair);
  const inactivePools = pairs.filter(pair => pair.inactivePair);
  
  // Get exchanges with most liquidity
  const exchanges = getUniqueExchanges(pairs);
  
  // Distribution among exchanges
  const liquidityByExchange = pairs.reduce((acc: Record<string, number>, pair) => {
    const exchangeName = pair.exchangeName;
    acc[exchangeName] = (acc[exchangeName] || 0) + pair.liquidityUsd;
    return acc;
  }, {});
  
  // Count how many exchanges list this token
  const exchangeCount = Object.keys(liquidityByExchange).length;
  
  // Calculate risk score (lower is better)
  // Factors: number of active pools, total liquidity, exchange diversity
  let riskScore = 5; // Medium risk by default
  
  if (totalLiquidity > 100000) riskScore -= 1;
  if (totalLiquidity > 1000000) riskScore -= 1;
  if (activePools.length >= 3) riskScore -= 1;
  if (exchangeCount >= 3) riskScore -= 1;
  
  // Ensure score stays between 1-5
  riskScore = Math.max(1, Math.min(5, riskScore));
  
  return {
    totalLiquidity,
    totalVolume,
    activePools: activePools.length,
    inactivePools: inactivePools.length,
    exchanges,
    liquidityByExchange,
    riskScore
  };
}

function calculateTotalLiquidity(pairs: any[]) {
  return pairs.reduce((sum, pair) => sum + pair.liquidityUsd, 0);
}

function calculateTotalVolume(pairs: any[]) {
  return pairs.reduce((sum, pair) => sum + pair.volume24hrUsd, 0);
}

function getUniqueExchanges(pairs: any[]) {
  const exchanges = new Set<string>();
  pairs.forEach(pair => exchanges.add(pair.exchangeName));
  return Array.from(exchanges);
}

function countActivePairs(pairs: any[]) {
  return pairs.filter(pair => !pair.inactivePair).length;
}