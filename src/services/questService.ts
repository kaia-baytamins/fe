import { API_CONFIG, getAuthHeaders, handleApiError } from './config';
import type { 
  Quest, 
  QuestProgress, 
  QuestStats, 
  ClaimRewardResponse, 
  GetQuestsFilters 
} from './types';

class QuestService {
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
   * Get available quests for the current user
   */
  async getAvailableQuests(filters: GetQuestsFilters = {}): Promise<Quest[]> {
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.offset) queryParams.append('offset', filters.offset.toString());

    const queryString = queryParams.toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.QUESTS}${queryString ? `?${queryString}` : ''}`;

    return this.fetchApi<Quest[]>(endpoint);
  }

  /**
   * Get quest progress for the current user
   */
  async getQuestProgress(): Promise<QuestProgress[]> {
    return this.fetchApi<QuestProgress[]>(API_CONFIG.ENDPOINTS.QUEST_PROGRESS);
  }

  /**
   * Start a specific quest
   */
  async startQuest(questId: string): Promise<QuestProgress> {
    const endpoint = API_CONFIG.ENDPOINTS.QUEST_START.replace('{questId}', questId);
    return this.fetchApi<QuestProgress>(endpoint, {
      method: 'POST',
    });
  }

  /**
   * Claim quest rewards
   */
  async claimQuestReward(questId: string): Promise<ClaimRewardResponse> {
    const endpoint = API_CONFIG.ENDPOINTS.QUEST_CLAIM.replace('{questId}', questId);
    return this.fetchApi<ClaimRewardResponse>(endpoint, {
      method: 'POST',
    });
  }

  /**
   * Get quest statistics for the current user
   */
  async getQuestStats(): Promise<QuestStats> {
    return this.fetchApi<QuestStats>(API_CONFIG.ENDPOINTS.QUEST_STATS);
  }

  /**
   * Get quests filtered by category
   */
  async getQuestsByCategory(category: string): Promise<Quest[]> {
    return this.getAvailableQuests({ category });
  }

  /**
   * Get quests filtered by type
   */
  async getQuestsByType(type: 'daily' | 'weekly' | 'special' | 'legendary'): Promise<Quest[]> {
    return this.getAvailableQuests({ type });
  }

  /**
   * Get active quests (in progress)
   */
  async getActiveQuests(): Promise<QuestProgress[]> {
    const allProgress = await this.getQuestProgress();
    return allProgress.filter(quest => quest.status === 'in_progress');
  }

  /**
   * Get completed quests that haven't been claimed yet
   */
  async getCompletedQuests(): Promise<QuestProgress[]> {
    const allProgress = await this.getQuestProgress();
    return allProgress.filter(quest => quest.status === 'completed' && quest.canClaim);
  }

  /**
   * Check if user can start a specific quest
   */
  async canStartQuest(questId: string): Promise<boolean> {
    try {
      const availableQuests = await this.getAvailableQuests();
      const quest = availableQuests.find(q => q.id === questId);
      return quest?.isAvailable || false;
    } catch (error) {
      console.error('Error checking quest availability:', error);
      return false;
    }
  }
}

export const questService = new QuestService();
export default questService;