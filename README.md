# Sollens - Solana Token Analysis Platform

![Sollens](https://placehold.co/600x200/1e293b/22c55e?text=Sollens&font=montserrat)

Sollens is a comprehensive analysis and verification platform for Solana tokens and wallets. It helps users check token authenticity, review metrics, track wallet performance, and make informed decisions in seconds.

## Features

### Token Analysis
- **Security Score**: Get an overall security rating for any Solana token
- **DEX Verification**: Instantly verify if tokens are listed on trusted DEXs
- **Liquidity Analysis**: Verify liquidity depth and distribution across different exchanges
- **Holder Distribution**: Examine token distribution to identify concentration risks
- **Scam Detection**: Identify common scam patterns and suspicious token behaviors
- **On-Chain Activity**: Track real-time transactions and trading patterns


### Wallet Analysis
- **Risk Assessment**: Evaluate wallet risk factors and detect sanctioned addresses
- **Trading Performance**: Track wallet profit and loss (PNL) across different time periods
- **Token Holdings**: View all tokens held by a wallet with current values
- **Transaction History**: Analyze recent transactions with detailed breakdowns
- **Security Indicators**: Clear visual indicators for potential security concerns

### Market Insights
- **Solana DEX Metrics**: Real-time volume, trades, and market data from top Solana DEXes
- **Network Mindshare**: Track Solana's prominence in crypto conversations and sentiment
- **Social Sentiment**: Analyze positive/negative sentiment across social platforms

### User Experience
- **Universal Search**: Easily search for any Solana token or wallet address
- **Recent History**: Keep track of recently analyzed addresses
- **Detailed Reports**: Get comprehensive analysis with actionable insights
- **Modern UI**: Clean, intuitive interface with clear data visualization
- **Wallet Integration**: Seamless Solana wallet connection using Civic Auth

## Technology Stack

### Frontend
- **Next.js 15**: React framework for server-rendered applications
- **TypeScript**: Strongly typed JavaScript for better development experience
- **TailwindCSS**: Utility-first CSS framework for styling
- **Radix UI**: Unstyled, accessible UI components
- **React Hook Form**: Form validation library

### Authentication
- **Civic Auth**: Web3 authentication service
- **Solana Wallet Adapter**: Integration with Solana wallets

### Blockchain Integration
- **@solana/web3.js**: Library for interacting with the Solana blockchain

### Data Sources
- **Helius RPC**: High-performance Solana RPC node provider 
- **DD by Webacy**: Wallet risk assessment and sanctioned address detection
- **RugCheck**: Token safety verification and token data provider
- **Bubblemaps**: Token decentralization and holder distribution analysis
- **DexScreener**: DEX data, token pairs, and market analytics
- **Messari**: Market metrics, DEX statistics, and network mindshare data
- **Vybe Network**: Wallet trading performance and PNL tracking
- **Solscan**: Blockchain explorer integration for transaction and account data

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- pnpm (preferred) or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/0x0manish/sollens.git
cd sollens
```

2. Install dependencies
```bash
pnpm install
```

3. Configure environment variables
Create a `.env.local` file in the root directory with the following variables:
```
# Authentication
CIVIC_CLIENT_ID=your_civic_client_id

# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=your_solana_rpc_endpoint
NEXT_PUBLIC_CREDITS_RECIPIENT_WALLET=your_credits_recipient_wallet
```

4. Run the development server
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Key Components

- **TokenAnalysis**: Core component for displaying token analysis
- **TokenSearchForm**: Search functionality for token addresses
- **DecentralizationAnalysis**: Analysis of token holder distribution
- **TokenHolders**: Displays token holder information
- **TokenOverview**: Shows general token information

## Usage Flow

1. Connect your Solana wallet using Civic authentication
2. Enter a Solana token address in the search bar
3. View the comprehensive analysis including:
   - Security score
   - Liquidity analysis
   - Holder distribution
   - Exchange listings
   - Token metrics
4. Use the insights to make informed decisions about the token

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
