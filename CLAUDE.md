# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
- `npm run dev` - Start development server with Turbopack
- `npm run dev:https` - Start development server with HTTPS (for LIFF integration)
- `npm run build` - Build production bundle with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Testing
This project doesn't have test scripts configured in package.json. Check if testing frameworks are added later.

## Project Architecture

### Framework & Technology Stack
- **Framework**: Next.js 15.5.0 with App Router
- **UI**: React 19.1.0 with Tailwind CSS 4
- **TypeScript**: Full TypeScript support with path aliases (`@/*` → `./src/*`)
- **Blockchain**: Kaia Chain integration via @kaiachain/ethers-ext
- **LINE Integration**: LIFF (LINE Frontend Framework) for authentication
- **Wallet**: Web3 wallet integration with MetaMask support

### Application Structure
This is a **tab-based single-page application** with 5 main sections:

#### Core Navigation Architecture
- **Main Container**: `/src/app/page.tsx` - Manages tab state and content switching
- **Header**: `/src/components/Header.tsx` - Shows active tab name + wallet connection
- **Tab Bar**: `/src/components/TabBar.tsx` - Bottom navigation with 5 tabs
- **Content Pages**: Each tab renders its respective page component

#### Tab Structure
1. **Home** (`/src/app/home/`) - Main dashboard with sunset background
2. **Explore** (`/src/app/explore/`) - Space-themed exploration features
3. **Market** (`/src/app/market/`) - Marketplace with cosmic animations
4. **Quest** (`/src/app/quest/`) - DeFi quests and portfolio management
5. **Settings** (`/src/app/settings/`) - User settings and profile

#### Key Architectural Patterns

**State Management**: 
- Tab state managed in main page component and passed down
- LIFF authentication data flows from main component to child pages
- No external state management library (Redux, Zustand) - using React state

**Authentication Flow**:
- LIFF initialization in `useLiff` hook
- Access token and profile managed globally
- Wallet connection separate from LIFF (MetaMask integration)

**API Integration**:
- Comprehensive service layer in `/src/services/`
- REST API client with JWT authentication
- Quest system with DeFi integration and gas delegation
- API base URL: `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'`

### Service Layer Architecture

Located in `/src/services/`:

- **config.ts**: API configuration, endpoints, auth headers, error handling
- **types.ts**: TypeScript interfaces for API responses
- **authService.ts**: Authentication management with JWT
- **questService.ts**: General quest operations (CRUD)  
- **defiQuestService.ts**: DeFi-specific quest operations
- **gasDelegationService.ts**: Blockchain transaction handling
- **index.ts**: Service aggregation and exports

### Component Organization

**Page-Specific Components**: Each tab has its own component folder:
- `/src/components/home/` - Home page components
- `/src/components/explore/` - Exploration features
- `/src/components/market/` - Market and trading UI
- `/src/components/quest/` - Quest system components  
- `/src/components/settings/` - Settings and profile
- `/src/components/ui/` - Shared UI components

**Shared Components**:
- `Header.tsx` - Main navigation header
- `TabBar.tsx` - Bottom tab navigation
- `wallet.tsx` - Web3 wallet integration component

### Blockchain Integration

**Kaia Chain**: Using @kaiachain/ethers-ext for Kaia blockchain interaction
**Ethers.js v5**: For Web3 provider and contract interactions
**Token Contract**: USDT contract integration at `0x6283D8384d8F6eAF24eC44D355F31CEC0bDacE3D`

**Gas Delegation**: Backend API handles gas delegation for user transactions
**DeFi Integration**: Portfolio tracking, staking, LP, and lending operations

### LINE Integration Specifics

**LIFF Setup**: 
- LIFF ID: `2007977169-WBZPyzZj`
- Auto-login flow in `useLiff` hook
- Access token and profile management
- Integration with quest and wallet systems

### Development Notes

**ESLint Configuration**: 
- Next.js core-web-vitals + TypeScript rules
- `@typescript-eslint/no-explicit-any` disabled
- Korean comments present in codebase

**TypeScript Configuration**:
- Strict mode disabled (`"strict": false`)
- Path aliases configured for clean imports
- ES2017 target for compatibility

**Styling**: 
- Tailwind CSS 4 with PostCSS
- Space/cosmic theme throughout application
- Gradient backgrounds and modern UI patterns

### Backend Integration

The frontend integrates with a comprehensive backend API (see QUEST_INTEGRATION_TEST.md):
- Quest management system
- DeFi portfolio tracking  
- Gas delegation service
- JWT-based authentication
- WebSocket ready for real-time updates

When working with this codebase:
1. Start with `npm run dev:https` if testing LIFF integration
2. Use the service layer for all API interactions  
3. Follow the tab-based navigation pattern
4. Maintain TypeScript interfaces in services/types.ts
5. Test wallet integration with Kaia testnet
6. Check QUEST_INTEGRATION_TEST.md for backend integration details