import { useState, useEffect, useCallback } from 'react';
import questService from '@/services/questService';
import type { Quest, QuestProgress, QuestStats } from '@/services/types';

interface UseQuestsResult {
  // Data
  quests: Quest[];
  questProgress: QuestProgress[];
  questStats: QuestStats | null;
  
  // Loading states
  loading: boolean;
  progressLoading: boolean;
  statsLoading: boolean;
  
  // Error states
  error: string | null;
  progressError: string | null;
  statsError: string | null;
  
  // Actions
  refreshQuests: () => Promise<void>;
  refreshProgress: () => Promise<void>;
  refreshStats: () => Promise<void>;
  startQuest: (questId: string) => Promise<boolean>;
  claimReward: (questId: string) => Promise<boolean>;
}

export function useQuests(): UseQuestsResult {
  // State
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questProgress, setQuestProgress] = useState<QuestProgress[]>([]);
  const [questStats, setQuestStats] = useState<QuestStats | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Fetch quests
  const refreshQuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questService.getAvailableQuests();
      setQuests(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quests';
      setError(errorMessage);
      console.error('Error fetching quests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch quest progress
  const refreshProgress = useCallback(async () => {
    try {
      setProgressLoading(true);
      setProgressError(null);
      const data = await questService.getQuestProgress();
      setQuestProgress(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quest progress';
      setProgressError(errorMessage);
      console.error('Error fetching quest progress:', err);
    } finally {
      setProgressLoading(false);
    }
  }, []);

  // Fetch quest stats
  const refreshStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      const data = await questService.getQuestStats();
      setQuestStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quest stats';
      setStatsError(errorMessage);
      console.error('Error fetching quest stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Start a quest
  const startQuest = useCallback(async (questId: string): Promise<boolean> => {
    try {
      await questService.startQuest(questId);
      // Refresh progress to get updated data
      await refreshProgress();
      return true;
    } catch (err) {
      console.error('Error starting quest:', err);
      return false;
    }
  }, [refreshProgress]);

  // Claim quest reward
  const claimReward = useCallback(async (questId: string): Promise<boolean> => {
    try {
      await questService.claimQuestReward(questId);
      // Refresh progress and stats to get updated data
      await Promise.all([refreshProgress(), refreshStats()]);
      return true;
    } catch (err) {
      console.error('Error claiming reward:', err);
      return false;
    }
  }, [refreshProgress, refreshStats]);

  // Initial load
  useEffect(() => {
    Promise.all([
      refreshQuests(),
      refreshProgress(),
      refreshStats()
    ]);
  }, [refreshQuests, refreshProgress, refreshStats]);

  return {
    // Data
    quests,
    questProgress,
    questStats,
    
    // Loading states
    loading,
    progressLoading,
    statsLoading,
    
    // Error states
    error,
    progressError,
    statsError,
    
    // Actions
    refreshQuests,
    refreshProgress,
    refreshStats,
    startQuest,
    claimReward,
  };
}