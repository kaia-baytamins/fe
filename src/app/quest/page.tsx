'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// MetaMask 타입 선언
declare global {
  interface Window {
    ethereum?: any;
  }
}
import { useWallet } from '@/contexts/WalletContext';
import StarBackground from '@/components/explore/StarBackground';
import StaticCosmicBackground from '@/components/market/StaticCosmicBackground';
import AmbientParticles from '@/components/market/AmbientParticles';
import SimpleFloatingElements from '@/components/market/SimpleFloatingElements';
import StaticUI from '@/components/market/StaticUI';
import QuestHeader from '@/components/quest/QuestHeader';
import DefiPortfolio from '@/components/quest/DefiPortfolio';
import SpecialEvent from '@/components/quest/SpecialEvent';
import QuestTabs from '@/components/quest/QuestTabs';
import QuestCard from '@/components/quest/QuestCard';
import DefiModal from '@/components/quest/DefiModal';
import { useQuests } from '@/hooks/useQuests';
import { useDefiQuests } from '@/hooks/useDefiQuests';
import authService from '@/services/authService';
import { gasDelegationService } from '@/services/gasDelegationService';
import type { Quest, QuestProgress, DefiQuestType } from '@/services/types';

export default function QuestPage() {
  const { getNumericBalance } = useWallet();
  
  // API hooks
  const { 
    quests, 
    questProgress, 
    questStats, 
    loading, 
    error,
    startQuest,
    claimReward 
  } = useQuests();
  
  const { 
    portfolio, 
    defiStats, 
    portfolioLoading, 
    prepareDefiTransaction,
    executeDelegatedTransaction 
  } = useDefiQuests();

  // UI state
  const [activeTab, setActiveTab] = useState('daily');
  const [showDefiModal, setShowDefiModal] = useState(false);
  const [currentDefiType, setCurrentDefiType] = useState<DefiQuestType | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        setIsAuthenticated(true);
      } else {
        // User needs to login through LIFF - redirect to main page or show message
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);


  const handleDefiAction = (type: 'staking' | 'lp_providing' | 'lending') => {
    const defiTypeMap: Record<string, DefiQuestType> = {
      'staking': 'staking',
      'lp_providing': 'lp_providing',
      'lending': 'lending'
    };
    
    setCurrentDefiType(defiTypeMap[type]);
    setShowDefiModal(true);
  };

  const handleParticipateDefi = async (amount: number) => {
    if (!currentDefiType) return;
    
    try {
      setActionLoading(true);
      
      const typeNames = {
        'staking': '스테이킹',
        'lp_providing': 'LP 제공',
        'lending': '렌딩'
      };
      
      // Step 1: Check if Kaikas wallet is connected and get user address first
      if (!window.klaytn) {
        alert('❌ Kaikas 지갑이 설치되어 있지 않습니다. Kaikas를 설치하고 연결해주세요.');
        return;
      }

      // Step 2: Get KAIA provider and signer using ethers-ext
      const provider = new ethers.BrowserProvider(window.klaytn);
      const signer = await provider.getSigner();
      
      
      // Step 3: Get user address
      const userAddress = await signer.getAddress();
      
      // Step 4: Prepare transaction data from backend with user address
      const transactionData = await prepareDefiTransaction(currentDefiType, amount.toString());
      
      if (!transactionData?.success || !transactionData.transactionData) {
        alert(`❌ 트랜잭션 준비 실패: ${transactionData?.error || '알 수 없는 오류'}`);
        return;
      }
      
      // Step 5: Create KAIA transaction and sign using KAIA SDK
      let senderTxHashRLP: string;
      
      try {
        console.log('Creating KAIA fee delegated transaction with Kaikas');
        
        // Import KAIA SDK components for transaction type
        const { TxType } = await import('@kaiachain/ethers-ext/v6');
        
        // Create KAIA transaction object for Kaikas
        const kaiaTransaction = {
          type: '0x31', // FeeDelegatedSmartContractExecution in hex
          from: userAddress,
          to: transactionData.transactionData.to,
          value: transactionData.transactionData.value || '0x0',
          data: transactionData.transactionData.data,
          gas: transactionData.transactionData.gas,
          gasPrice: transactionData.transactionData.gasPrice,
        };
        
        console.log('KAIA transaction object for Kaikas:', kaiaTransaction);
        
        // Use Kaikas native method to sign KAIA transaction
        const kaiaSignResult = await window.klaytn.request({
          method: 'klay_signTransaction',
          params: [kaiaTransaction]
        });
        
        console.log('✅ Kaikas generated senderTxHashRLP:', kaiaSignResult);
        
        // Extract the rawTransaction (senderTxHashRLP) from the response
        if (kaiaSignResult && kaiaSignResult.rawTransaction) {
          senderTxHashRLP = kaiaSignResult.rawTransaction;
          console.log('✅ Extracted senderTxHashRLP:', senderTxHashRLP);
        } else {
          throw new Error('Kaikas did not return rawTransaction');
        }
        
      } catch (signError) {
        console.error('❌ KAIA transaction signing error:', signError);
        alert('❌ KAIA 트랜잭션 서명에 실패했습니다. Kaikas 지갑이 연결되어 있고 올바른 네트워크에 있는지 확인해주세요.');
        return;
      }

      // Step 6: Execute the delegated transaction with senderTxHashRLP
      // Backend will use the proper senderTxHashRLP from KAIA SDK
      const delegationResponse = await executeDelegatedTransaction(
        {
          ...transactionData.transactionData,
          from: userAddress,
          signedMessage: senderTxHashRLP // KAIA SDK senderTxHashRLP
        },
        '' // No separate userSignature needed for KAIA SDK approach
      );

      if (delegationResponse?.success) {
        alert(`🎉 ${typeNames[currentDefiType]} 트랜잭션이 성공적으로 실행되었습니다!\n\n투자 금액: ${amount.toFixed(2)} USDT\nTx Hash: ${delegationResponse.txHash}`);
        setShowDefiModal(false);
        setCurrentDefiType(null);
      } else {
        alert(`❌ 트랜잭션 실행 실패: ${delegationResponse?.error || '알 수 없는 오류'}`);
      }
    } catch (error: any) {
      console.error('DeFi participation error:', error);
      
      // Handle specific error types
      if (error.code === 4001) {
        alert('❌ 사용자가 트랜잭션을 취소했습니다.');
      } else if (error.message?.includes('User rejected')) {
        alert('❌ 사용자가 서명을 거부했습니다.');
      } else {
        alert(`❌ DeFi 참여 중 오류가 발생했습니다: ${error.message || error}`);
      }
    } finally {
      setActionLoading(false);
    }
  };


  // Helper function to get quest progress by quest ID
  const getQuestProgressById = (questId: string): QuestProgress | undefined => {
    return questProgress.find(qp => qp.questId === questId);
  };

  // Helper function to get quests by type
  const getQuestsByType = (type: Quest['type']) => {
    return quests.filter(quest => quest.type === type);
  };

  // Helper function to get reward display info
  const getRewardDisplay = (quest: Quest) => {
    // Check for items first (our new reward structure)
    if (quest.rewards.items && quest.rewards.items.length > 0) {
      const firstItem = quest.rewards.items[0];
      const rewardName = firstItem.name || '장비';
      const rarityText = firstItem.rarity === 'common' ? '기본 등급' :
                        firstItem.rarity === 'rare' ? '희귀 등급' :
                        firstItem.rarity === 'epic' ? '에픽 등급' :
                        firstItem.rarity === 'legendary' ? '레전더리 등급' :
                        firstItem.rarity === 'rare-epic' ? '희귀-에픽 등급' :
                        firstItem.rarity === 'epic-legendary' ? '에픽-레전더리 등급' :
                        '특별';
      
      // If multiple items, show count
      if (quest.rewards.items.length > 1) {
        return {
          name: `${rewardName} ${quest.rewards.items.length}개`,
          value: `${rarityText} 보상`
        };
      }
      
      return {
        name: rewardName,
        value: rarityText
      };
    }
    
    // Fallback to other reward types
    if (quest.rewards.kaiaAmount) {
      return {
        name: `${quest.rewards.kaiaAmount} KAIA`,
        value: quest.rewards.experience ? `경험치 +${quest.rewards.experience}` : '즉시 지급'
      };
    }
    
    if (quest.rewards.nftTokenId) {
      return {
        name: quest.rewards.nftTokenId,
        value: quest.rewards.experience ? `경험치 +${quest.rewards.experience}` : 'NFT 보상'
      };
    }
    
    return {
      name: '보상',
      value: quest.rewards.experience ? `경험치 +${quest.rewards.experience}` : '특별 보상'
    };
  };

  // Helper function to handle quest action (start/claim)
  const handleQuestAction = async (quest: Quest) => {
    const progress = getQuestProgressById(quest.id);
    
    if (!progress || progress.status === 'not_started') {
      // Start quest
      const success = await startQuest(quest.id);
      if (success) {
        alert(`🎉 "${quest.title}" 퀘스트를 시작했습니다!`);
      }
    } else if (progress.canClaim) {
      // Claim reward
      const success = await claimReward(quest.id);
      if (success) {
        alert(`🎉 "${quest.title}" 퀘스트 보상을 받았습니다!`);
      }
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* 정적 우주 배경 시스템 */}
      <StarBackground />
      <AmbientParticles />
      <StaticCosmicBackground />
      <SimpleFloatingElements />
      
      {/* 정적 UI 컨테이너 */}
      <div className="relative z-20 p-4 space-y-6">
        <StaticUI>
        {/* Authentication required state */}
        {!isAuthenticated && (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="text-white text-lg">🔒 로그인이 필요합니다</div>
            <div className="text-white/60 text-center">
              퀘스트 기능을 이용하려면 메인 페이지에서<br/>
              LINE 로그인을 완료해주세요.
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {isAuthenticated && loading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-white">퀘스트 정보를 불러오는 중...</div>
          </div>
        )}
        
        {/* Error state */}
        {isAuthenticated && error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400">
            오류: {error}
          </div>
        )}
        
        {/* Main content */}
        {isAuthenticated && !loading && !error && (
          <>
            <QuestHeader walletBalance={getNumericBalance()} />
            
            <DefiPortfolio 
              onDefiAction={handleDefiAction} 
              portfolio={portfolio}
              loading={portfolioLoading}
            />
            
            <SpecialEvent />
            
            <QuestTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </>
        )}
        
        {/* Quest content by tab */}
        {isAuthenticated && !loading && !error && (
          <>
            {/* 일일 퀘스트 */}
            {activeTab === 'daily' && (
              <div className="space-y-4">
                {getQuestsByType('daily').map((quest) => {
                  const progress = getQuestProgressById(quest.id);
                  const currentProgress = progress?.progress || 0;
                  const maxProgress = quest.requirements.amount || 1;
                  
                  let status: "locked" | "completed" | "in-progress" = "locked";
                  let buttonText = "시작하기";
                  let buttonDisabled = false;
                  
                  if (progress) {
                    switch (progress.status) {
                      case 'completed':
                        status = progress.canClaim ? 'completed' : 'completed';
                        buttonText = progress.canClaim ? '보상 수령' : '완료됨';
                        buttonDisabled = !progress.canClaim;
                        break;
                      case 'in_progress':
                        status = 'in-progress';
                        buttonText = `${maxProgress - currentProgress}개 더 필요`;
                        buttonDisabled = true;
                        break;
                      case 'claimed':
                        status = 'completed';
                        buttonText = '수령완료';
                        buttonDisabled = true;
                        break;
                      default:
                        if (quest.isAvailable) {
                          status = 'locked';
                          buttonText = '시작하기';
                          buttonDisabled = false;
                        }
                    }
                  } else if (quest.isAvailable) {
                    status = 'locked';
                    buttonText = '시작하기';
                    buttonDisabled = false;
                  }

                  const rewardInfo = getRewardDisplay(quest);

                  return (
                    <QuestCard
                      key={quest.id}
                      type="daily"
                      title={quest.title}
                      description={quest.description}
                      progress={currentProgress}
                      maxProgress={maxProgress}
                      progressText={`${currentProgress}/${maxProgress} 완료`}
                      rewardIcon="💰"
                      rewardName={rewardInfo.name}
                      rewardValue={rewardInfo.value}
                      status={status}
                      buttonText={buttonText}
                      buttonDisabled={buttonDisabled || actionLoading}
                      onClick={() => handleQuestAction(quest)}
                    />
                  );
                })}
                
                {getQuestsByType('daily').length === 0 && (
                  <div className="text-center text-white/60 p-8">
                    현재 이용 가능한 일일 퀘스트가 없습니다.
                  </div>
                )}
              </div>
            )}

            {/* 주간 퀘스트 */}
            {activeTab === 'weekly' && (
              <div className="space-y-4">
                {getQuestsByType('weekly').map((quest) => {
                  const progress = getQuestProgressById(quest.id);
                  const currentProgress = progress?.progress || 0;
                  const maxProgress = quest.requirements.amount || 1;
                  
                  let status: "locked" | "completed" | "in-progress" = "locked";
                  let buttonText = "시작하기";
                  let buttonDisabled = false;
                  
                  if (progress) {
                    switch (progress.status) {
                      case 'completed':
                        status = progress.canClaim ? 'completed' : 'completed';
                        buttonText = progress.canClaim ? '보상 수령' : '완료됨';
                        buttonDisabled = !progress.canClaim;
                        break;
                      case 'in_progress':
                        status = 'in-progress';
                        buttonText = `진행 중 (${currentProgress}/${maxProgress})`;
                        buttonDisabled = true;
                        break;
                      case 'claimed':
                        status = 'completed';
                        buttonText = '수령완료';
                        buttonDisabled = true;
                        break;
                      default:
                        if (quest.isAvailable) {
                          buttonText = '시작하기';
                          buttonDisabled = false;
                        }
                    }
                  } else if (quest.isAvailable) {
                    buttonText = '시작하기';
                    buttonDisabled = false;
                  }

                  const rewardInfo = getRewardDisplay(quest);

                  return (
                    <QuestCard
                      key={quest.id}
                      type="weekly"
                      title={quest.title}
                      description={quest.description}
                      progress={currentProgress}
                      maxProgress={maxProgress}
                      progressText={`${currentProgress}/${maxProgress} 완료`}
                      rewardIcon="🔥"
                      rewardName={rewardInfo.name}
                      rewardValue={rewardInfo.value}
                      status={status}
                      buttonText={buttonText}
                      buttonDisabled={buttonDisabled || actionLoading}
                      onClick={() => handleQuestAction(quest)}
                    />
                  );
                })}
                
                
                {getQuestsByType('weekly').length === 0 && (
                  <div className="text-center text-white/60 p-8">
                    현재 이용 가능한 주간 퀘스트가 없습니다.
                  </div>
                )}
              </div>
            )}

            {/* 특별 퀘스트 */}
            {activeTab === 'special' && (
              <div className="space-y-4">
                {getQuestsByType('special').map((quest) => {
                  const progress = getQuestProgressById(quest.id);
                  const currentProgress = progress?.progress || 0;
                  const maxProgress = quest.requirements.amount || 1;
                  
                  let status: "locked" | "completed" | "in-progress" = "locked";
                  let buttonText = "시작하기";
                  let buttonDisabled = false;
                  
                  if (progress) {
                    switch (progress.status) {
                      case 'completed':
                        status = progress.canClaim ? 'completed' : 'completed';
                        buttonText = progress.canClaim ? '보상 수령' : '완료됨';
                        buttonDisabled = !progress.canClaim;
                        break;
                      case 'in_progress':
                        status = 'in-progress';
                        buttonText = `진행 중 (${currentProgress}/${maxProgress})`;
                        buttonDisabled = true;
                        break;
                      case 'claimed':
                        status = 'completed';
                        buttonText = '수령완료';
                        buttonDisabled = true;
                        break;
                      default:
                        if (quest.isAvailable) {
                          buttonText = '시작하기';
                          buttonDisabled = false;
                        }
                    }
                  } else if (quest.isAvailable) {
                    buttonText = '시작하기';
                    buttonDisabled = false;
                  }

                  const rewardInfo = getRewardDisplay(quest);

                  return (
                    <QuestCard
                      key={quest.id}
                      type="special"
                      title={quest.title}
                      description={quest.description}
                      progress={currentProgress}
                      maxProgress={maxProgress}
                      progressText={`${currentProgress}/${maxProgress} 완료`}
                      rewardIcon="⚡"
                      rewardName={rewardInfo.name}
                      rewardValue={rewardInfo.value}
                      status={status}
                      buttonText={buttonText}
                      buttonDisabled={buttonDisabled || actionLoading}
                      onClick={() => handleQuestAction(quest)}
                    />
                  );
                })}
                
                
                {getQuestsByType('special').length === 0 && (
                  <div className="text-center text-white/60 p-8">
                    현재 이용 가능한 특별 퀘스트가 없습니다.
                  </div>
                )}
              </div>
            )}

            {/* 전설 퀘스트 */}
            {activeTab === 'legendary' && (
              <div className="space-y-4">
                {getQuestsByType('legendary').map((quest) => {
                  const progress = getQuestProgressById(quest.id);
                  const currentProgress = progress?.progress || 0;
                  const maxProgress = quest.requirements.amount || 1;
                  
                  let status: "locked" | "completed" | "in-progress" = "locked";
                  let buttonText = "시작하기";
                  let buttonDisabled = false;
                  
                  if (progress) {
                    switch (progress.status) {
                      case 'completed':
                        status = progress.canClaim ? 'completed' : 'completed';
                        buttonText = progress.canClaim ? '보상 수령' : '완료됨';
                        buttonDisabled = !progress.canClaim;
                        break;
                      case 'in_progress':
                        status = 'in-progress';
                        buttonText = `진행 중 (${currentProgress}/${maxProgress})`;
                        buttonDisabled = true;
                        break;
                      case 'claimed':
                        status = 'completed';
                        buttonText = '수령완료';
                        buttonDisabled = true;
                        break;
                      default:
                        if (quest.isAvailable) {
                          buttonText = '시작하기';
                          buttonDisabled = false;
                        }
                    }
                  } else if (quest.isAvailable) {
                    buttonText = '시작하기';
                    buttonDisabled = false;
                  }

                  const rewardInfo = getRewardDisplay(quest);

                  return (
                    <QuestCard
                      key={quest.id}
                      type="legendary"
                      title={quest.title}
                      description={quest.description}
                      progress={currentProgress}
                      maxProgress={maxProgress}
                      progressText={`${currentProgress}/${maxProgress} 완료`}
                      rewardIcon="🌌"
                      rewardName={rewardInfo.name}
                      rewardValue={rewardInfo.value}
                      status={status}
                      buttonText={buttonText}
                      buttonDisabled={buttonDisabled || actionLoading}
                      onClick={() => handleQuestAction(quest)}
                    />
                  );
                })}
                
                {getQuestsByType('legendary').length === 0 && (
                  <div className="text-center text-white/60 p-8">
                    현재 이용 가능한 전설 퀘스트가 없습니다.
                  </div>
                )}
              </div>
            )}
          </>
        )}
        </StaticUI>
      </div>

      {/* DeFi Modal */}
      <DefiModal
        isOpen={showDefiModal}
        type={currentDefiType}
        onClose={() => {setShowDefiModal(false); setCurrentDefiType(null);}}
        onParticipate={handleParticipateDefi}
        walletBalance={getNumericBalance()}
        loading={actionLoading}
      />
    </div>
  );
}