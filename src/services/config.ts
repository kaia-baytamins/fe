// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  ENDPOINTS: {
    // Auth endpoints
    SIMPLE_LOGIN: '/auth/simple-login',
    PET_REGISTER: '/auth/select-pet',
    
    // Quest endpoints
    QUESTS: '/quests',
    QUEST_PROGRESS: '/quests/progress',
    QUEST_START: '/quests/{questId}/start',
    QUEST_CLAIM: '/quests/{questId}/claim',
    QUEST_STATS: '/quests/stats',
    
    // DeFi Quest endpoints
    DEFI_PORTFOLIO: '/quests/defi/portfolio',
    DEFI_AVAILABLE: '/quests/defi/available',
    DEFI_PREPARE_TRANSACTION: '/quests/defi/prepare-transaction',
    DEFI_PROGRESS: '/quests/defi/progress',
    DEFI_CLAIM: '/quests/defi/{questId}/claim',
    DEFI_STATS: '/quests/defi/stats',
    DEFI_PREPARE_FAUCET: '/quests/defi/prepare-faucet',
    DEFI_CHECK_STAKING_APPROVAL: '/quests/defi/check-staking-approval',
    DEFI_CHECK_LENDING_APPROVAL: '/quests/defi/check-lending-approval',
    
    // Gas Delegation endpoints
    GAS_DELEGATE: '/blockchain/gas-delegation/delegate',
    GAS_ESTIMATE: '/blockchain/gas-delegation/estimate',
    GAS_PREPARE_SIGNING: '/blockchain/gas-delegation/prepare-signing',
    GAS_CHECK_ELIGIBILITY: '/blockchain/gas-delegation/check-eligibility',
    GAS_STATS: '/blockchain/gas-delegation/stats',
    GAS_SUPPORTED_TYPES: '/blockchain/gas-delegation/supported-types',
    GAS_FEE_PAYER: '/blockchain/gas-delegation/fee-payer',

    // User endpoints
    USER_UPDATE_WALLET: '/users/wallet-address',
    
    // Leaderboard endpoints
    LEADERBOARD: '/leaderboard/rankings',
    LEADERBOARD_TOP_PERFORMERS: '/leaderboard/top-performers',
    
    // Inventory endpoints
    INVENTORY_WALLET: '/inventory/wallet',
    INVENTORY_EQUIP: '/inventory/equip',
    INVENTORY_UNEQUIP: '/inventory/unequip',
    INVENTORY_EQUIPPED: '/inventory/equipped',
  }
};

export const getAuthHeaders = (): HeadersInit => {
  const lineUserId = typeof window !== 'undefined' ? localStorage.getItem('lineUserId') : null;
  return {
    'Content-Type': 'application/json',
    ...(lineUserId && { 'x-line-user-id': lineUserId })
  };
};

export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If parsing JSON fails, use the status text
    }
    throw new Error(errorMessage);
  }
  return response;
};