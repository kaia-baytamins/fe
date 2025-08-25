import { useState, useEffect, useCallback } from 'react';
import defiQuestService from '@/services/defiQuestService';
import gasDelegationService from '@/services/gasDelegationService';
import type { 
  DefiQuestType,
  DefiPortfolio, 
  DefiTransactionData,
  DefiStats,
  GasDelegationResponse 
} from '@/services/types';

interface UseDefiQuestsResult {
  // Data
  portfolio: DefiPortfolio | null;
  defiStats: DefiStats | null;
  
  // Loading states
  portfolioLoading: boolean;
  statsLoading: boolean;
  transactionLoading: boolean;
  
  // Error states
  portfolioError: string | null;
  statsError: string | null;
  transactionError: string | null;
  
  // Actions
  refreshPortfolio: () => Promise<void>;
  refreshStats: () => Promise<void>;
  prepareDefiTransaction: (type: DefiQuestType, amount: string) => Promise<DefiTransactionData | null>;
  executeDelegatedTransaction: (transactionData: any, signature: string) => Promise<GasDelegationResponse | null>;
}

export function useDefiQuests(): UseDefiQuestsResult {
  // State
  const [portfolio, setPortfolio] = useState<DefiPortfolio | null>(null);
  const [defiStats, setDefiStats] = useState<DefiStats | null>(null);
  
  // Loading states
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  
  // Error states
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  // Fetch portfolio
  const refreshPortfolio = useCallback(async () => {
    try {
      setPortfolioLoading(true);
      setPortfolioError(null);
      const data = await defiQuestService.getUserDefiPortfolio();
      setPortfolio(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio';
      setPortfolioError(errorMessage);
      console.error('Error fetching portfolio:', err);
    } finally {
      setPortfolioLoading(false);
    }
  }, []);

  // Fetch DeFi stats
  const refreshStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      const data = await defiQuestService.getDefiStats();
      setDefiStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch DeFi stats';
      setStatsError(errorMessage);
      console.error('Error fetching DeFi stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Prepare DeFi transaction
  const prepareDefiTransaction = useCallback(async (
    type: DefiQuestType, 
    amount: string
  ): Promise<DefiTransactionData | null> => {
    try {
      setTransactionLoading(true);
      setTransactionError(null);
      
      const data = await defiQuestService.prepareDefiQuestTransaction({
        questType: type,
        amount
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to prepare transaction';
      setTransactionError(errorMessage);
      console.error('Error preparing transaction:', err);
      return null;
    } finally {
      setTransactionLoading(false);
    }
  }, []);

  // Execute delegated transaction
  const executeDelegatedTransaction = useCallback(async (
    transactionData: any,
    signature: string
  ): Promise<GasDelegationResponse | null> => {
    try {
      setTransactionLoading(true);
      setTransactionError(null);
      
      const response = await gasDelegationService.delegateTransactionWithData(
        transactionData,
        signature
      );
      
      // Refresh portfolio after successful transaction
      if (response.success) {
        await refreshPortfolio();
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute transaction';
      setTransactionError(errorMessage);
      console.error('Error executing transaction:', err);
      return null;
    } finally {
      setTransactionLoading(false);
    }
  }, [refreshPortfolio]);

  // Initial load
  useEffect(() => {
    Promise.all([
      refreshPortfolio(),
      refreshStats()
    ]);
  }, [refreshPortfolio, refreshStats]);

  return {
    // Data
    portfolio,
    defiStats,
    
    // Loading states
    portfolioLoading,
    statsLoading,
    transactionLoading,
    
    // Error states
    portfolioError,
    statsError,
    transactionError,
    
    // Actions
    refreshPortfolio,
    refreshStats,
    prepareDefiTransaction,
    executeDelegatedTransaction,
  };
}