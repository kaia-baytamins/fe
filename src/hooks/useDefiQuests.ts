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

interface UseDefiQuestsOptions {
  walletAddress?: string | null;
  autoLoad?: boolean;
}

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

export function useDefiQuests(options: UseDefiQuestsOptions = {}): UseDefiQuestsResult {
  const { walletAddress: providedWalletAddress, autoLoad = false } = options;
  const [walletAddress, setWalletAddress] = useState<string | null>(providedWalletAddress || null);
  // State
  const [portfolio, setPortfolio] = useState<DefiPortfolio | null>(null);
  const [defiStats, setDefiStats] = useState<DefiStats | null>(null);
  
  // Loading states
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  
  // Error states
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  // Check for wallet connection on component mount
  useEffect(() => {
    if (!providedWalletAddress && typeof window !== 'undefined') {
      // Check localStorage for previously connected wallet
      const storedWalletAddress = localStorage.getItem('connectedWalletAddress');
      if (storedWalletAddress) {
        setWalletAddress(storedWalletAddress);
      }
    }
  }, [providedWalletAddress]);

  // Fetch portfolio
  const refreshPortfolio = useCallback(async () => {
    // 지갑 주소가 없으면 portfolio 조회 건너뛰기
    if (!walletAddress) {
      setPortfolioError('Wallet not connected');
      setPortfolioLoading(false);
      setPortfolio(null);
      return;
    }

    try {
      setPortfolioLoading(true);
      setPortfolioError(null);
      const data = await defiQuestService.getUserDefiPortfolio();
      console.log('useDefiQuests - fetched portfolio data:', data);
      setPortfolio(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio';
      setPortfolioError(errorMessage);
      console.error('Error fetching portfolio:', err);
    } finally {
      setPortfolioLoading(false);
    }
  }, [walletAddress]);

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
    if (autoLoad) {
      Promise.all([
        refreshPortfolio(),
        refreshStats()
      ]);
    }
  }, [autoLoad, refreshPortfolio, refreshStats]);

  // Load data when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      // 지갑 연결 시 로딩 시작
      setPortfolioLoading(true);
      setStatsLoading(true);
      
      Promise.all([
        refreshPortfolio(),
        refreshStats()
      ]);
    } else {
      // 지갑이 연결되지 않은 경우 로딩 상태 해제
      setPortfolioLoading(false);
      setStatsLoading(false);
      setPortfolio(null);
      setDefiStats(null);
      setPortfolioError(null);
      setStatsError(null);
    }
  }, [walletAddress, refreshPortfolio, refreshStats]);

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