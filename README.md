# Sollens - Solana Token Analysis Platform

![Sollens](https://placehold.co/600x200/1e293b/22c55e?text=Sollens&font=montserrat)

Sollens is a comprehensive analysis and verification platform for Solana tokens. It helps users check token authenticity, review metrics, and make informed decisions in seconds.

## Features

### Token Analysis
- **Security Score**: Get an overall security rating for any Solana token
- **DEX Verification**: Instantly verify if tokens are listed on trusted DEXs
- **Liquidity Analysis**: Verify liquidity depth and distribution across different exchanges
- **Holder Distribution**: Examine token distribution to identify concentration risks
- **Scam Detection**: Identify common scam patterns and suspicious token behaviors
- **On-Chain Activity**: Track real-time transactions and trading patterns
- **Team Verification**: Verify team identities and previous project history

### User Experience
- **Simple Token Search**: Easily search for any Solana token by address
- **Recent History**: Keep track of recently analyzed tokens
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
- **CheckDex API**: For token pair and liquidity data
- **Bubblemap API**: For token decentralization analysis
- **DexScreener API**: For additional DEX data and analytics

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
