// Quest related types
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special' | 'legendary';
  category: 'staking' | 'lending' | 'lp_providing' | 'trading' | 'exploration' | 'training' | 'social';
  requirements: {
    action: string;
    amount?: number;
    duration?: number;
  };
  rewards: {
    kaiaAmount?: number;
    experience?: number;
    nftTokenId?: string;
    items?: Array<{
      type: string;
      rarity: string;
      name: string;
    }>;
  };
  levelRequirement: number;
  isAvailable: boolean;
}

export interface QuestProgress {
  questId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'claimed';
  progress: number;
  targetAmount: number;
  progressPercentage: number;
  canClaim: boolean;
  startedAt?: string;
  quest: Quest;
}

export interface QuestStats {
  totalQuestsCompleted: number;
  dailyQuestsCompleted: number;
  weeklyQuestsCompleted: number;
  totalRewardsEarned: {
    kaia: number;
    experience: number;
    nfts: number;
  };
}

export interface ClaimRewardResponse {
  success: boolean;
  rewards: {
    kaia?: number;
    experience?: number;
    nft?: string;
    items?: Array<{
      type: string;
      rarity: string;
      name: string;
    }>;
  };
}

// DeFi Quest types
export type DefiQuestType = 'staking' | 'lending' | 'lp_providing';

export interface DefiPortfolio {
  portfolio: {
    totalValue: string;
    stakingValue: string;
    lendingValue: string;
    lpValue: string;
  };
  questEligibility: {
    totalValue: string;
    stakingValue: string;
    lendingValue: string;
    lpValue: string;
  };
}

export interface DefiTransactionData {
  success: boolean;
  transactionData?: {
    from: string;
    to: string;
    data: string;
    gas: string;
    gasPrice?: string;
    value: string;
    type: string;
  };
  message: string;
  instructions?: {
    step1: string;
    step2: string;
    step3: string;
  };
  error?: string;
}

export interface DefiStats {
  platform: {
    totalValueLocked: string;
    totalStakers: number;
    totalLenders: number;
    totalLpProviders: number;
  };
  questMultipliers: {
    stakingBoost: number;
    lendingBoost: number;
    lpBoost: number;
  };
}

// Gas Delegation types
export interface GasDelegationRequest {
  from: string;
  to?: string;
  data?: string;
  gas: string;
  gasPrice?: string;
  value?: string;
  memo?: string;
  type?: 'value_transfer' | 'value_transfer_memo' | 'contract_execution';
  userSignature?: string;
}

export interface GasDelegationResponse {
  success: boolean;
  txHash?: string;
  gasUsed?: string;
  effectiveGasPrice?: string;
  feePayer?: string;
  transactionType?: string;
  error?: string;
}

export interface GasEstimationResponse {
  estimatedGas: string;
  gasPrice: string;
  estimatedCost: string;
  transactionType: string;
}

export interface EligibilityResponse {
  eligible: boolean;
  reason?: string;
}

export interface GasStats {
  totalDelegations: number;
  totalGasCost: string;
  averageGasUsed: string;
  feePayer: string;
  supportedTypes: string[];
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Common filters and pagination
export interface GetQuestsFilters {
  type?: 'daily' | 'weekly' | 'special' | 'legendary';
  category?: string;
  limit?: number;
  offset?: number;
}