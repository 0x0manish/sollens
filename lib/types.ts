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

// Wallet Analysis Data Types
export interface WalletAddressInfo {
  balance: number;
  expiresAt: number;
  is_spam_sns: boolean;
  time_1st_tx: string;
  wash_trading: number;
  time_verified: number;
  has_no_balance: boolean;
  automated_trading: boolean;
  transaction_count: number;
  has_no_transactions: boolean;
}

export interface WalletRiskDetails {
  address_info: WalletAddressInfo;
  token_risk: Record<string, any>;
  token_metadata_risk: Record<string, any>;
  marketData: Record<string, any>;
  buy_sell_taxes: {
    has_buy_tax: boolean;
    has_sell_tax: boolean;
  };
  dev_launched_tokens_in_24_hours: number;
}

export interface WalletAnalysisData {
  count: number;
  medium: number;
  high: number;
  overallRisk: number;
  issues: any[];
  details: WalletRiskDetails;
  isContract: boolean;
}