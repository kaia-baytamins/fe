import { API_CONFIG, getAuthHeaders, handleApiError } from './config';
import type { 
  DefiQuestType,
  DefiPortfolio, 
  DefiTransactionData,
  DefiStats,
  Quest,
  QuestProgress,
  ClaimRewardResponse,
  ApprovalCheckResponse
} from './types';

interface DefiQuestParticipationRequest {
  questType: DefiQuestType;
  amount: string;
  duration?: number;
}

class DefiQuestService {
  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    await handleApiError(response);
    return response.json();
  }

  /**
   * Get user's DeFi portfolio for quest tracking
   */
  async getUserDefiPortfolio(): Promise<DefiPortfolio> {
    return this.fetchApi<DefiPortfolio>(API_CONFIG.ENDPOINTS.DEFI_PORTFOLIO);
  }

  /**
   * Get DeFi-specific quests
   */
  async getDefiQuests(): Promise<Quest[]> {
    return this.fetchApi<Quest[]>(API_CONFIG.ENDPOINTS.DEFI_AVAILABLE);
  }

  /**
   * Prepare DeFi quest transaction for user signing
   */
  async prepareDefiQuestTransaction(request: DefiQuestParticipationRequest): Promise<DefiTransactionData> {
    return this.fetchApi<DefiTransactionData>(API_CONFIG.ENDPOINTS.DEFI_PREPARE_TRANSACTION, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get quest progress for DeFi activities
   */
  async getDefiQuestProgress(): Promise<QuestProgress[]> {
    return this.fetchApi<QuestProgress[]>(API_CONFIG.ENDPOINTS.DEFI_PROGRESS);
  }

  /**
   * Claim DeFi quest rewards
   */
  async claimDefiQuestReward(questId: string): Promise<ClaimRewardResponse> {
    const endpoint = API_CONFIG.ENDPOINTS.DEFI_CLAIM.replace('{questId}', questId);
    return this.fetchApi<ClaimRewardResponse>(endpoint, {
      method: 'POST',
    });
  }

  /**
   * Get DeFi platform statistics for quest context
   */
  async getDefiStats(): Promise<DefiStats> {
    return this.fetchApi<DefiStats>(API_CONFIG.ENDPOINTS.DEFI_STATS);
  }

  /**
   * Prepare faucet transaction for user signing
   */
  async prepareFaucetTransaction(): Promise<DefiTransactionData> {
    return this.fetchApi<DefiTransactionData>(API_CONFIG.ENDPOINTS.DEFI_PREPARE_FAUCET, {
      method: 'POST',
    });
  }

  /**
   * Helper: Prepare staking transaction
   */
  async prepareStakingTransaction(amount: string, duration?: number): Promise<DefiTransactionData> {
    return this.prepareDefiQuestTransaction({
      questType: 'staking',
      amount,
      duration
    });
  }

  /**
   * Helper: Prepare lending transaction
   */
  async prepareLendingTransaction(amount: string): Promise<DefiTransactionData> {
    return this.prepareDefiQuestTransaction({
      questType: 'lending',
      amount
    });
  }

  /**
   * Helper: Prepare LP providing transaction
   */
  async prepareLpTransaction(amount: string): Promise<DefiTransactionData> {
    return this.prepareDefiQuestTransaction({
      questType: 'lp_providing',
      amount
    });
  }

  /**
   * Check if user has sufficient balance for DeFi participation
   */
  async checkSufficientBalance(questType: DefiQuestType, amount: string): Promise<boolean> {
    try {
      const portfolio = await this.getUserDefiPortfolio();
      const amountNum = parseFloat(amount);
      
      switch (questType) {
        case 'staking':
          return parseFloat(portfolio.portfolio.totalValue) >= amountNum;
        case 'lending':
          return parseFloat(portfolio.portfolio.totalValue) >= amountNum;
        case 'lp_providing':
          return parseFloat(portfolio.portfolio.totalValue) >= amountNum;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }

  /**
   * Get recommended DeFi quest based on user's portfolio
   */
  async getRecommendedDefiQuest(): Promise<Quest | null> {
    try {
      const [portfolio, quests] = await Promise.all([
        this.getUserDefiPortfolio(),
        this.getDefiQuests()
      ]);

      const totalValue = parseFloat(portfolio.portfolio.totalValue);
      
      // Sort quests by requirements and recommend based on portfolio value
      const suitableQuests = quests.filter(quest => {
        const requiredAmount = quest.requirements.amount || 0;
        return totalValue >= requiredAmount;
      });

      return suitableQuests.length > 0 ? suitableQuests[0] : null;
    } catch (error) {
      console.error('Error getting recommended quest:', error);
      return null;
    }
  }

  /**
   * Check if USDT approval is needed for staking
   */
  async checkStakingApproval(amount: string): Promise<ApprovalCheckResponse> {
    return this.fetchApi<ApprovalCheckResponse>(API_CONFIG.ENDPOINTS.DEFI_CHECK_STAKING_APPROVAL, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  /**
   * Check if USDT approval is needed for lending
   */
  async checkLendingApproval(amount: string): Promise<ApprovalCheckResponse> {
    return this.fetchApi<ApprovalCheckResponse>(API_CONFIG.ENDPOINTS.DEFI_CHECK_LENDING_APPROVAL, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }
}

export const defiQuestService = new DefiQuestService();
export default defiQuestService;