# UchuMon Frontend

**Next.js 15-based Animal Space Exploration DeFi Quest Platform**

## 🌟 Project Overview

UchuMon is a space exploration DeFi quest platform featuring animal companions. Users raise cute animal partners (Momoco, Panlulu, Hoshitanu, Mizuru), upgrade spaceships for cosmic exploration, and earn growth rewards through DeFi activities on the Kaia blockchain - all in a gamified web application.

### Key Features

- **🐾 Animal Partner System**: Space exploration with Momoco, Panlulu, Hoshitanu, and Mizuru
- **🚀 Space Exploration**: NFT minting and reward acquisition through diverse planet exploration
- **🎯 Quest System**: Animal growth and spaceship upgrades through daily/weekly/special/legendary quests
- **💰 DeFi Integration**: Game resource acquisition through staking, LP providing, and lending on Kaia blockchain
- **⚡ Fee Delegation**: Free transaction experience with gas fee delegation
- **👥 LINE Integration**: Seamless social login via LIFF
- **🛍️ NFT Marketplace**: Trading of spaceship parts, items, and exploration record NFTs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm
- Kaikas Wallet (Chrome Extension)
- LINE Developer Account (for LIFF app setup)

### Installation & Setup

```bash
# Install dependencies
npm install

# Start development server (HTTP)
npm run dev

# Start development server (HTTPS - required for LIFF integration)
npm run dev:https

# Production build
npm run build

# Start production server
npm run start

# Lint check
npm run lint
```

### Environment Variables

```bash
cp .env.example .env.local
```

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 15.5.0 (App Router)
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Blockchain**: Kaia Chain, ethers.js v5, @kaiachain/ethers-ext
- **Authentication**: LINE LIFF
- **Wallet**: Kaikas

### App Structure

```
src/
├── app/                    # App Router pages
│   ├── page.tsx           # Main page (tab management)
│   ├── home/              # Home dashboard (leaderboard)
│   ├── explore/           # 🚀 Space exploration (my space, pet training, spaceship maintenance, launch pad)
│   ├── market/            # 🛍️ NFT marketplace (spaceship parts trading)
│   ├── quest/             # 🎯 DeFi quest system (main feature)
│   └── settings/          # ⚙️ Settings and profile
├── components/            # UI components
├── contexts/              # React Context (wallet, auth)
├── hooks/                 # Custom hooks
├── services/              # API service layer
└── types/                 # TypeScript type definitions
```

## 🎯 Quest Page Implementation - Animal Growth & Spaceship Enhancement

The Quest page is UchuMon's core feature, implementing DeFi integration and fee delegation for animal partner growth and spaceship enhancement.

### Animal Partner System

#### Animal Characters
- **Momoco**: Dog character - Agility specialist
- **Panlulu**: Panda character - Health recovery specialist  
- **Hoshitanu**: Raccoon character - Intelligence specialist
- **Mizuru**: Cat character - Balanced abilities

#### Quest Types (Animal Growth Focused)
- **Daily Quests**: Daily animal care like feeding and training
- **Weekly Quests**: Animal stat improvement through DeFi activities
- **Special Quests**: Spaceship parts acquisition and enhancement
- **Legendary Quests**: Long-term preparation for rare planet exploration

#### Animal Growth State Management
```typescript
interface AnimalPartner {
  id: string;
  name: 'Momoco' | 'Panlulu' | 'Hoshitanu' | 'Mizuru';
  type: 'dog' | 'panda' | 'raccoon' | 'cat';
  level: number;
  stats: {
    health: number;     // Health - affects exploration distance and success rate
    agility: number;    // Agility - required for specific planet exploration
    intelligence: number; // Intelligence - rare item discovery probability
  };
  experience: number;
  specialAbility: string; // Each animal's unique ability
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special' | 'legendary';
  requirements: {
    action: string;    // 'defi_staking', 'defi_lp', 'defi_lending', 'pet_care'
    amount: number;    // Minimum required amount
    animalLevel?: number; // Required animal level
  };
  rewards: {
    kaiaAmount?: number;
    animalStats?: Partial<AnimalPartner['stats']>; // Animal stat improvements
    spaceshipItems?: SpaceshipItem[]; // Spaceship parts
    nftTokenId?: string;
    experience?: number;
  };
  isAvailable: boolean;
}

interface SpaceshipItem {
  id: string;
  category: 'engine' | 'material' | 'special_equipment' | 'fuel';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  name: string;
  effect: string; // Effect on spaceship
}
```

### DeFi Integration Implementation - Animal Growth & Spaceship Enhancement

#### Supported DeFi Services (Game Reward Integration)
1. **Staking**: USDT staking for animal health improvement and spaceship fuel acquisition
2. **LP Providing**: KAIA-USDT liquidity supply for spaceship engine parts
3. **Lending**: USDT deposit for animal intelligence improvement and special equipment

#### Fee Delegation Flow

The fee delegation implemented in the Quest page is a core feature enabling users to perform DeFi transactions without gas fees.

```typescript
// Core implementation in src/app/quest/page.tsx
const handleParticipateDefi = async (amount: number) => {
  // 1. Check Kaikas wallet connection
  if (!window.klaytn) {
    alert('Kaikas wallet required');
    return;
  }

  // 2. Create KAIA provider using ethers-ext
  const provider = new ethers.BrowserProvider(window.klaytn);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  // 3. Prepare transaction data from backend
  const transactionData = await prepareDefiTransaction(currentDefiType, amount);

  // 4. Create Fee Delegated Transaction using Kaia SDK
  const { TxType } = await import('@kaiachain/ethers-ext/v6');
  const { KlaytnTxFactory } = await import('@kaiachain/js-ext-core');

  const tx = {
    type: TxType.FeeDelegatedSmartContractExecution,
    from: userAddress,
    to: transactionData.transactionData.to,
    value: 0,
    data: transactionData.transactionData.data,
    gasLimit: transactionData.transactionData.gas,
    gasPrice: transactionData.transactionData.gasPrice,
    nonce: await provider.getTransactionCount(userAddress),
    chainId: 1001 // Kairos testnet
  };

  // 5. Create KlaytnTx object and generate signing hash
  const klaytnTx = KlaytnTxFactory.fromObject(tx);
  const sigRLP = klaytnTx.sigRLP();
  const sigHash = keccak256(sigRLP);

  // 6. Sign transaction through Kaikas
  const signedTx = await window.klaytn.request({
    method: 'klay_signTransaction',
    params: [{
      type: '0x31', // FeeDelegatedSmartContractExecution
      from: userAddress,
      to: transactionData.transactionData.to,
      value: '0x0',
      data: transactionData.transactionData.data,
      gas: transactionData.transactionData.gas,
      gasPrice: transactionData.transactionData.gasPrice,
      nonce: `0x${nonce.toString(16)}`
    }]
  });

  // 7. Send signed transaction to backend for fee delegation execution
  const delegationResponse = await executeDelegatedTransaction({
    ...transactionData.transactionData,
    from: userAddress,
    signedMessage: signedTx.rawTransaction // senderTxHashRLP
  });
};
```

#### Key Technical Tools

- **@kaiachain/ethers-ext**: Kaia blockchain-specific ethers.js extension
- **@kaiachain/js-ext-core**: Transaction object creation via KlaytnTxFactory
- **@ethersproject/keccak256**: Signing hash generation
- **Kaikas Wallet**: Secure signing through `klay_signTransaction` method

#### Fee Delegation Features

1. **Zero Gas Fees**: Users can perform DeFi transactions without paying gas fees
2. **Secure Signing**: User's private keys are never transmitted to server
3. **Real-time Processing**: Fast processing through Kaia SDK's senderTxHashRLP method
4. **Error Handling**: Handles various scenarios including user cancellation and network errors

### Fee Delegation Example Flow

**Step 1: User clicks DeFi button**
```
User action: "Stake 100 USDT" button click
⬇️
handleParticipateDefi(100) function call
```

**Step 2: Backend prepares transaction data**
```
prepareDefiTransaction('staking', '100') 
⬇️
Backend response: {
  success: true,
  transactionData: {
    to: "0x492b...", // Staking contract
    data: "0xa694fc3a...",
    gas: "100000",
    gasPrice: "25000000000"
  }
}
```

**Step 3: Generate senderTxHashRLP with Kaia SDK**
```
KlaytnTxFactory.fromObject({
  type: TxType.FeeDelegatedSmartContractExecution,
  from: "0x742d...",
  to: "0x492b...",
  data: "0xa694fc3a...",
  gasLimit: "100000",
  gasPrice: "25000000000",
  nonce: 42,
  chainId: 1001
})
⬇️
senderTxHashRLP: "0x31f8b94201..."
```

**Step 4: Backend fee delegation execution**
```
executeDelegatedTransaction({
  from: "0x742d...",
  to: "0x492b...",
  data: "0xa694fc3a...",
  gas: "100000",
  gasPrice: "25000000000",
  signedMessage: "0x31f8b94201..." // senderTxHashRLP
})
⬇️
Backend response: {
  success: true,
  txHash: "0x1234567890...",
  gasUsed: "85432",
  feePayer: "0xFeePayer123..."
}
```

### Animal & Spaceship Portfolio Tracking

Real-time tracking of game assets linked to DeFi activities:

```typescript
interface GamePortfolio {
  animal: AnimalPartner;
  spaceship: {
    totalScore: number;    // Combined animal stats + spaceship score
    engine: SpaceshipItem[];
    materials: SpaceshipItem[];
    specialEquipment: SpaceshipItem[];
    fuel: SpaceshipItem[];
    explorationReadiness: {
      availablePlanets: string[]; // List of explorable planets
      successRate: number;        // Exploration success rate
    };
  };
  defiActivities: {
    staking: {
      totalStaked: number;
      animalStatsBonus: Partial<AnimalPartner['stats']>;
      apy: number;
    };
    liquidityProviding: {
      totalProvided: number;
      spaceshipItemsEarned: SpaceshipItem[];
      poolShare: number;
    };
    lending: {
      totalSupplied: number;
      intelligenceBonus: number;
      specialEquipmentEarned: SpaceshipItem[];
      netAPY: number;
    };
  };
  exploration: {
    planetsExplored: string[];     // List of explored planets
    nftsEarned: string[];          // Earned exploration record NFTs
    totalExplorationScore: number; // Total exploration score
  };
}
```

## 🔧 Service Layer

### API Services

All backend communication is managed through the service layer:

```typescript
// src/services/ structure
├── config.ts              # API configuration and auth headers
├── types.ts               # TypeScript interfaces
├── authService.ts         # JWT authentication management
├── questService.ts        # General quest API
├── defiQuestService.ts    # DeFi quest specialized API  
├── gasDelegationService.ts # Fee delegation API
├── userService.ts         # User profile management
└── index.ts              # Service integration exports
```

### Key Hooks

- `useQuests()`: Animal growth quests and spaceship enhancement quest management
- `useAnimalPartner()`: Animal partner status and stats management
- `useSpaceship()`: Spaceship parts and exploration readiness management
- `useDefiQuests()`: DeFi activity and game reward integration
- `useExploration()`: Planet exploration and NFT minting management
- `useLiff()`: LINE LIFF authentication management
- `useWallet()`: Wallet connection and balance inquiry

## 🎨 UI/UX Features

### Space Theme Design
- **Star Background**: Dynamic star animations
- **Cosmic Gradients**: Space-themed gradient backgrounds
- **Floating Elements**: Space debris and planet animations
- **Responsive Design**: Mobile-first approach

### Component Library
```typescript
// Quest-related components (animal and spaceship focused)
├── QuestCard.tsx          # Individual quest cards
├── QuestTabs.tsx          # Quest type tabs
├── AnimalPartner.tsx      # Animal partner status view
├── SpaceshipStatus.tsx    # Spaceship parts and readiness view
├── ExplorationModal.tsx   # Planet exploration modal
├── DefiPortfolio.tsx      # DeFi activity and game reward status
├── DefiModal.tsx          # DeFi transaction modal
└── SpecialEvent.tsx       # Special event banner
```

## 🔐 Security Considerations

### Wallet Security
- User's private keys are never transmitted to server
- Secure transaction signing through Kaikas wallet
- All blockchain transactions require user approval

### API Security
- JWT-based authentication system
- CORS policy implementation
- Input data validation and sanitization

## 🧪 Testing

```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# HTTPS development server for manual testing
npm run dev:https
```

### Testnet Configuration
- **Network**: Kairos Testnet (Chain ID: 1001)
- **RPC**: https://public-en-kairos.node.kaia.io
- **Test Tokens**: KAIA acquisition through faucet
