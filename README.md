# Sollens - Solana Token Analysis Platform

<div align="center">
  <img src="https://placehold.co/600x200/1e293b/22c55e?text=Sollens&font=montserrat" alt="Sollens" width="600" />
</div>

Sollens is a comprehensive analysis and verification platform for Solana tokens, wallets and transactions. It helps users check token authenticity, review metrics, track wallet performance, and make informed decisions in seconds.

## Features

### Token Analysis
- **Security Score**: Get an overall security rating for any Solana token
- **DEX Verification**: Instantly verify if tokens are listed on trusted DEXs
- **Liquidity Analysis**: Verify liquidity depth and distribution across different exchanges
- **Holder Distribution**: Examine token distribution to identify concentration risks
- **Scam Detection**: Identify common scam patterns and suspicious token behaviors via RugCheck API
- **On-Chain Activity**: Track near real-time transactions and trading patterns
- **Token Safety Verification**: Comprehensive token risk assessment powered by RugCheck API

### Wallet Analysis
- **Risk Assessment**: Evaluate wallet risk factors and detect sanctioned addresses
- **Sanctioned Wallet Detection**: Identify high-risk wallets using Webacy API integration
- **Visual Risk Indicators**: Clear green shields for safe wallets and red alerts for sanctioned addresses
- **Trading Performance**: Track wallet profit and loss (PNL) across different time periods
- **Token Holdings**: View all tokens held by a wallet with current values
- **Transaction History**: Analyze recent transactions with detailed breakdowns
- **Data Freshness Indicator**: Transparent indication of data sourcing and refresh frequency

### Transaction Visualization
- **Interactive Flow Diagrams**: Visualize transaction flows between wallets with intuitive SVG-based diagrams
- **Time-based Filtering**: Filter transaction flows by date ranges to focus on specific periods
- **Amount Filtering**: Set minimum transaction amounts to focus on significant transfers
- **Interactive Zooming & Panning**: Manipulate the view with intuitive zoom and pan controls
- **Path Highlighting**: Highlight specific transaction paths for better analysis
- **Fullscreen Mode**: Expand visualization for detailed examination of complex transaction networks

### Market Insights
- **Solana Blockchain Data**: Real-time metrics including block height, epoch, slot, and transaction count from Solscan API
- **Solana DEX Metrics**: Real-time volume, trades, and market data from top Solana DEXes
- **Network Mindshare**: Track Solana's prominence in crypto conversations and sentiment
- **Social Sentiment**: Analyze positive/negative sentiment across social platforms

### User Experience
- **Universal Search**: Easily search for any Solana token or wallet address
- **Activity Tracking**: Keep track of recently analyzed tokens, wallets, and transactions
- **Detailed Reports**: Get comprehensive analysis with actionable insights
- **Modern UI**: Clean, intuitive interface with clear data visualization
- **Wallet Integration**: Seamless Solana wallet connection using Solana Wallet Adapter
- **Improved Authentication**: Robust login flow with reliable state transitions and profile image handling
- **Consistent Dark Theme**: Smooth transitions between pages with no white flashes

## Technology Stack

### Frontend
- **Next.js 15**: React framework for server-rendered applications
- **TypeScript**: Strongly typed JavaScript for better development experience
- **TailwindCSS**: Utility-first CSS framework for styling
- **Radix UI**: Unstyled, accessible UI components
- **React Hook Form**: Form validation library

### Authentication
- **Solana Wallet Adapter**: Connect to popular wallets like Phantom
- **GlobalLoadingProvider**: Custom provider for smooth page transitions

### Blockchain Integration
- **@solana/web3.js**: Library for interacting with the Solana blockchain
- **date-fns**: Date manipulation for transaction time filtering

### Data Visualization
- **SVG-based Rendering**: Custom interactive transaction flow visualization
- **Dynamic Layouts**: Circular and force-directed layouts for node positioning
- **Interactive Elements**: Zoom, pan, and highlight capabilities in flow diagrams

### Data Sources
- **Helius RPC**: High-performance Solana RPC node provider 
- **DD by Webacy**: Wallet risk assessment and sanctioned address detection
- **RugCheck**: Token safety verification and token data provider
- **Bubblemaps**: Token decentralization and holder distribution analysis
- **DexScreener**: DEX data, token pairs, and market analytics
- **Messari**: Market metrics, DEX statistics, and network mindshare data
- **Vybe Network**: Wallet trading performance and PNL tracking
- **Solscan**: Blockchain explorer, real-time network statistics, and chain information API

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
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=your_solana_rpc_endpoint
NEXT_PUBLIC_CREDITS_RECIPIENT_WALLET=your_credits_recipient_wallet

# API Keys
WEBACY_API_KEY=your_webacy_api_key
MESSARI_API_KEY=your_messari_api_key
VYBE_API_KEY=your_vybe_api_key
SOLSCAN_API_TOKEN=your_solscan_api_token
```

4. Run the development server
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Deployment

Sollens can be deployed to various hosting platforms. The recommended approach is to use Vercel or Netlify for optimal Next.js support.

### Deploying to Vercel
1. Connect your repository to Vercel
2. Set up the required environment variables
3. Deploy with the Next.js preset

### Environment Variables
The following environment variables are required for full functionality:

```
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=your_solana_rpc_endpoint
NEXT_PUBLIC_CREDITS_RECIPIENT_WALLET=your_credits_recipient_wallet

# API Keys
WEBACY_API_KEY=your_webacy_api_key
MESSARI_API_KEY=your_messari_api_key
VYBE_API_KEY=your_vybe_api_key
SOLSCAN_API_TOKEN=your_solscan_api_token
```

## Key Components

- **TokenAnalysis**: Core component for displaying token analysis
- **WalletAnalysis**: Analysis of wallet activities, holdings, and risk assessment
- **TransactionFlowVisualization**: Interactive visualization of transaction flows
- **GlobalLoadingProvider**: Ensures smooth transitions between authentication states
- **TokenSearchForm**: Universal search functionality for token/wallet addresses
- **DecentralizationAnalysis**: Analysis of token holder distribution
- **TokenHolders**: Displays token holder information
- **TokenOverview**: Shows general token information

## Application Flow

1. **Wallet Connection Flow**
   - User connects a wallet using Wallet Adapter
   - Connection state is maintained across pages
   - Profile data loads with reliable image handling
   - Smooth transition to dashboard with no white flash

2. **Token Analysis Flow**
   - User searches for a token address
   - Address validation and classification occurs
   - Token data is fetched from multiple APIs
   - Security score and analysis are displayed
   - User can interact with detailed metrics

3. **Wallet Analysis Flow**
   - User searches for a wallet address
   - Wallet data including balance and holdings are retrieved
   - Sanctioned status is checked via Webacy API
   - Visual indicators show wallet risk level
   - Token holdings and transaction history are displayed

4. **Transaction Analysis Flow**
   - User searches for a transaction signature
   - Transaction details are fetched and decoded
   - Interactive flow visualization shows transaction context
   - User can filter by time and amount
   - Transaction can be explored with zoom and pan controls

## Recent Enhancements

### Webacy API Integration for Sanctioned Wallet Detection
Added integration with Webacy's API to detect sanctioned wallet addresses, providing users with critical compliance and security information before interacting with potentially high-risk wallets.

### RugCheck API Integration for Token Safety Verification
Enhanced token analysis with comprehensive RugCheck API integration, enabling advanced scam detection, token verification, and risk assessment capabilities.


### Improved Authentication Flow
Enhanced the user authentication experience with:
- Robust profile image loading with validation and fallbacks
- Loading states to ensure data is fully loaded before UI rendering
- Improved logout process with proper authentication state clearing
- Consistent dark theme to prevent white flashes during page transitions

### Wallet Analysis Enhancements
- Added clear visual indicators for sanctioned status (green shield for safe, red alert for sanctioned)
- Implemented transparent data sourcing disclaimer
- Improved data display with actual values from API responses
- Enhanced error handling for wallet data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](./LICENSE) - see the [LICENSE](./LICENSE) file for details.
