'use client';

import { useState, useEffect } from 'react';
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
import DefiOptionSelector from '@/components/quest/DefiOptionSelector';
import DefiModal from '@/components/quest/DefiModal';
import { useQuests } from '@/hooks/useQuests';
import { useDefiQuests } from '@/hooks/useDefiQuests';
import authService from '@/services/authService';
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
  const [selectedDefiOption, setSelectedDefiOption] = useState<string | null>(null);
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

  const weeklyDefiOptions = [
    { id: 'stake', title: '💰 스테이킹', details: '$100, 7일 유지' },
    { id: 'lp_providing', title: '🌊 LP 제공', details: 'KAIA-USDT $100' },
    { id: 'lending', title: '🏦 렌딩', details: '$100 예치' }
  ];

  const specialDefiOptions = [
    { id: 'high_stake', title: '💰 고액 스테이킹', details: '$500, 30일' },
    { id: 'multi_lp', title: '🌊 멀티 LP', details: '2개 풀 동시' },
    { id: 'lending_borrow', title: '🏦 렌딩+보로잉', details: '복합 전략' }
  ];

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
      
      // Use the actual amount parameter from user input
      const transactionData = await prepareDefiTransaction(currentDefiType, amount.toString());
      
      if (transactionData?.success && transactionData.transactionData) {
        // In a real implementation, you would:
        // 1. Show the transaction details to user
        // 2. Get user to sign the transaction 
        // 3. Submit the signed transaction
        
        // For now, showing success message
        const typeNames = {
          'staking': '스테이킹',
          'lp_providing': 'LP 제공',
          'lending': '렌딩'
        };
        
        alert(`🎉 ${typeNames[currentDefiType]} 트랜잭션 준비 완료!\n\n투자 금액: ${amount.toFixed(2)} KAIA\n${transactionData.message}\n\n실제 구현에서는 지갑 서명이 필요합니다.`);
        setShowDefiModal(false);
        setCurrentDefiType(null);
      } else {
        alert(`❌ 트랜잭션 준비 실패: ${transactionData?.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('DeFi participation error:', error);
      alert('❌ DeFi 참여 중 오류가 발생했습니다.');
    } finally {
      setActionLoading(false);
    }
  };

  const startDefiQuest = async () => {
    if (!selectedDefiOption) {
      alert('먼저 DeFi 옵션을 선택해주세요!');
      return;
    }
    
    try {
      setActionLoading(true);
      
      // Find the DeFi quest that matches the selected option
      const defiQuests = quests.filter(quest => 
        ['staking', 'lending', 'lp_providing'].includes(quest.category)
      );
      
      const selectedQuest = defiQuests.find(quest => {
        // Map option IDs to quest categories
        const optionMapping: Record<string, string> = {
          'stake': 'staking',
          'lp_providing': 'lp_providing', 
          'lending': 'lending',
          'high_stake': 'staking',
          'multi_lp': 'lp_providing',
          'lending_borrow': 'lending'
        };
        return quest.category === optionMapping[selectedDefiOption];
      });
      
      if (!selectedQuest) {
        alert('선택한 옵션에 맞는 퀘스트를 찾을 수 없습니다.');
        return;
      }
      
      const success = await startQuest(selectedQuest.id);
      
      if (success) {
        alert(`🎉 ${selectedQuest.title} 퀘스트를 시작했습니다!\n\n퀘스트 진행 상황은 실시간으로 업데이트됩니다.`);
        setSelectedDefiOption(null); // Reset selection
      } else {
        alert('❌ 퀘스트 시작에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Quest start error:', error);
      alert('❌ 퀘스트 시작 중 오류가 발생했습니다.');
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
                  const progressPercentage = progress?.progressPercentage || 0;
                  
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
                      rewardName={quest.rewards.kaiaAmount ? `${quest.rewards.kaiaAmount} KAIA` : quest.rewards.nftTokenId || '보상'}
                      rewardValue={quest.rewards.experience ? `경험치 +${quest.rewards.experience}` : '즉시 지급'}
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
                      rewardName={quest.rewards.kaiaAmount ? `${quest.rewards.kaiaAmount} KAIA` : quest.rewards.nftTokenId || '희귀 보상'}
                      rewardValue={quest.rewards.experience ? `경험치 +${quest.rewards.experience}` : '주간 보상'}
                      status={status}
                      buttonText={buttonText}
                      buttonDisabled={buttonDisabled || actionLoading}
                      onClick={() => handleQuestAction(quest)}
                    />
                  );
                })}
                
                {/* Special DeFi quest with options */}
                {getQuestsByType('weekly').some(q => ['staking', 'lending', 'lp_providing'].includes(q.category)) && (
                  <QuestCard
                    type="weekly"
                    title="💎 DeFi 마스터 (선택형)"
                    description="아래 옵션 중 하나를 선택하여 7일간 유지하세요."
                    progress={0}
                    maxProgress={1}
                    progressText={selectedDefiOption ? "옵션 선택됨" : "옵션 선택 필요"}
                    rewardIcon="🔥"
                    rewardName="희귀 NFT"
                    rewardValue="랜덤 희귀 등급"
                    status="locked"
                    buttonText={actionLoading ? "처리 중..." : "옵션 선택"}
                    buttonDisabled={actionLoading}
                    onClick={startDefiQuest}
                  >
                    <DefiOptionSelector
                      title="옵션을 선택하세요 (택1)"
                      options={weeklyDefiOptions}
                      selectedOption={selectedDefiOption}
                      onOptionSelect={setSelectedDefiOption}
                    />
                  </QuestCard>
                )}
                
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
                      rewardName={quest.rewards.kaiaAmount ? `${quest.rewards.kaiaAmount} KAIA` : quest.rewards.nftTokenId || '전설 보상'}
                      rewardValue={quest.rewards.experience ? `경험치 +${quest.rewards.experience}` : '특별 보상'}
                      status={status}
                      buttonText={buttonText}
                      buttonDisabled={buttonDisabled || actionLoading}
                      onClick={() => handleQuestAction(quest)}
                    />
                  );
                })}
                
                {/* Special high-level DeFi quest */}
                <QuestCard
                  type="special"
                  title="🌟 DeFi 고수 (선택형)"
                  description="고난이도 DeFi 전략 중 하나를 선택하여 30일간 유지하세요."
                  progress={0}
                  maxProgress={1}
                  progressText={selectedDefiOption ? "옵션 선택됨" : "옵션 선택 필요"}
                  rewardIcon="⚡"
                  rewardName="전설 NFT"
                  rewardValue="고성능 장비"
                  status="locked"
                  buttonText={actionLoading ? "처리 중..." : "옵션 선택"}
                  buttonDisabled={actionLoading}
                  onClick={startDefiQuest}
                >
                  <DefiOptionSelector
                    title="고난이도 옵션 (택1)"
                    options={specialDefiOptions}
                    selectedOption={selectedDefiOption}
                    onOptionSelect={setSelectedDefiOption}
                  />
                </QuestCard>
                
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
                      rewardName={quest.rewards.kaiaAmount ? `${quest.rewards.kaiaAmount} KAIA` : quest.rewards.nftTokenId || '전설 보상'}
                      rewardValue={quest.rewards.experience ? `경험치 +${quest.rewards.experience}` : '전설적 보상'}
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