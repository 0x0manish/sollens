export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  logo: string | null;
  decimals: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidityUsd: number;
  exchanges: string[];
  activePairs: number;
}

export interface TokenPairToken {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string | null;
  tokenDecimals: string;
  pairTokenType: string;
  liquidityUsd: number;
}

export interface TokenPair {
  exchangeAddress: string;
  exchangeName: string;
  exchangeLogo: string;
  pairAddress: string;
  pairLabel: string;
  usdPrice: number;
  usdPrice24hrPercentChange: number;
  usdPrice24hrUsdChange: number;
  volume24hrNative: number;
  volume24hrUsd: number;
  liquidityUsd: number;
  baseToken: string;
  quoteToken: string;
  inactivePair: boolean;
  pair: TokenPairToken[];
}

export interface TokenAnalytics {
  totalLiquidity: number;
  totalVolume: number;
  activePools: number;
  inactivePools: number;
  exchanges: string[];
  liquidityByExchange: Record<string, number>;
  riskScore: number;
}

export interface DecentralizationData {
  decentralisation_score: number;
  dt_update: string;
  identified_supply: {
    percent_in_cexs: number;
    percent_in_contracts: number;
  };
  status: string;
  ts_update: number;
}

export interface TokenAnalysisData {
  tokenInfo: TokenInfo | null;
  pairs: TokenPair[];
  analytics: TokenAnalytics;
  decentralization: DecentralizationData | null;
  pageSize: number;
  page: number;
  cursor: string | null;
} 