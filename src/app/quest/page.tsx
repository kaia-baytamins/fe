'use client';

import { useState } from 'react';
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

export default function QuestPage() {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDefiOption, setSelectedDefiOption] = useState<string | null>(null);
  const [showDefiModal, setShowDefiModal] = useState(false);
  const [currentDefiType, setCurrentDefiType] = useState<'staking' | 'lp' | 'lending' | null>(null);

  const weeklyDefiOptions = [
    { id: 'stake', title: '💰 스테이킹', details: '$100, 7일 유지' },
    { id: 'lp', title: '🌊 LP 제공', details: 'KAIA-USDT $100' },
    { id: 'lending', title: '🏦 렌딩', details: '$100 예치' }
  ];

  const specialDefiOptions = [
    { id: 'high_stake', title: '💰 고액 스테이킹', details: '$500, 30일' },
    { id: 'multi_lp', title: '🌊 멀티 LP', details: '2개 풀 동시' },
    { id: 'lending_borrow', title: '🏦 렌딩+보로잉', details: '복합 전략' }
  ];

  const handleDefiAction = (type: 'staking' | 'lp' | 'lending') => {
    setCurrentDefiType(type);
    setShowDefiModal(true);
  };

  const handleParticipateDefi = (amount: number) => {
    const typeNames = {
      'staking': '스테이킹',
      'lp': 'LP 제공',
      'lending': '렌딩'
    };
    
    if (currentDefiType) {
      alert(`🎉 ${typeNames[currentDefiType]} 참여 완료!\n\n투자 금액: ${amount.toFixed(2)} KAIA\nDeFi 프로토콜이 연결되었습니다.\n관련 퀘스트 진행률이 업데이트됩니다.`);
      setShowDefiModal(false);
      setCurrentDefiType(null);
    }
  };

  const startDefiQuest = () => {
    if (!selectedDefiOption) {
      alert('먼저 DeFi 옵션을 선택해주세요!');
      return;
    }
    
    const options = {
      'stake': { name: '스테이킹', desc: '$100 스테이킹을 7일간 유지' },
      'lp': { name: 'LP 제공', desc: 'KAIA-USDT 페어에 $100 제공' },
      'lending': { name: '렌딩', desc: '$100 렌딩 예치' },
      'high_stake': { name: '고액 스테이킹', desc: '$500 스테이킹을 30일간 유지' },
      'multi_lp': { name: '멀티 LP', desc: '2개 LP 풀에 동시 제공' },
      'lending_borrow': { name: '렌딩+보로잉', desc: '복합 DeFi 전략 운용' }
    };
    
    const option = options[selectedDefiOption as keyof typeof options];
    
    if (confirm(`${option.name} 퀘스트를 시작하시겠습니까?\n\n내용: ${option.desc}\n\n퀘스트를 시작하면 DeFi 프로토콜로 자동 연결됩니다.`)) {
      alert(`🎉 ${option.name} 퀘스트 시작!\n\nDeFi 프로토콜 연결 중...\n퀘스트 진행 상황은 실시간으로 업데이트됩니다.`);
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
        <QuestHeader walletBalance={1250} />
        
        <DefiPortfolio onDefiAction={handleDefiAction} />
        
        <SpecialEvent />
        
        <QuestTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* 일일 퀘스트 */}
        {activeTab === 'daily' && (
          <div className="space-y-4">
            <QuestCard
              type="daily"
              title="🍖 펫에게 사료 주기"
              description="우주견 코스모에게 맛있는 사료를 줘서 체력을 회복시켜주세요."
              progress={1}
              maxProgress={1}
              progressText="1/1 완료"
              rewardIcon="💰"
              rewardName="5 KAIA"
              rewardValue="즉시 지급 완료"
              status="completed"
              buttonText="수령완료"
              buttonDisabled={true}
            />
            
            <QuestCard
              type="daily"
              title="🏃‍♂️ 펫 훈련 3회 완료"
              description="민첩성과 지능을 높이기 위해 펫 훈련을 3번 완료하세요."
              progress={2}
              maxProgress={3}
              progressText="2/3 완료"
              rewardIcon="⚙️"
              rewardName="일반 엔진 NFT"
              rewardValue="추진력 +120"
              status="in-progress"
              buttonText="1회 더 필요"
              buttonDisabled={true}
            />
            
            <QuestCard
              type="daily"
              title="🚀 아무 행성 탐험 1회"
              description="어떤 행성이든 탐험을 성공적으로 완료하세요. NFT 4개가 소각되지만 토큰을 받을 수 있습니다."
              progress={0}
              maxProgress={1}
              progressText="0/1 완료"
              rewardIcon="💰"
              rewardName="10 KAIA + 경험치"
              rewardValue="즉시 지급"
              status="locked"
              buttonText="탐험 필요"
              buttonDisabled={true}
            />
            
            <QuestCard
              type="daily"
              title="💰 $10 DeFi 참여"
              description="스테이킹, LP 제공, 렌딩 중 아무거나 $10 이상 참여하세요."
              progress={0}
              maxProgress={10}
              progressText="$0/$10"
              rewardIcon="⚙️"
              rewardName="일반 엔진 NFT"
              rewardValue="추진력 +100"
              status="locked"
              buttonText="DeFi 참여 필요"
              buttonDisabled={true}
            />
          </div>
        )}

        {/* 주간 퀘스트 */}
        {activeTab === 'weekly' && (
          <div className="space-y-4">
            <QuestCard
              type="weekly"
              title="💎 DeFi 마스터 (선택형)"
              description="아래 옵션 중 하나를 선택하여 7일간 유지하세요. 모든 옵션의 보상은 동일합니다."
              progress={0}
              maxProgress={1}
              progressText={selectedDefiOption ? "옵션 선택됨" : "옵션 선택 필요"}
              rewardIcon="🔥"
              rewardName="희귀 NFT"
              rewardValue="랜덤 희귀 등급"
              status="locked"
              buttonText="옵션 선택"
              onClick={startDefiQuest}
            >
              <DefiOptionSelector
                title="옵션을 선택하세요 (택1)"
                options={weeklyDefiOptions}
                selectedOption={selectedDefiOption}
                onOptionSelect={setSelectedDefiOption}
              />
            </QuestCard>
            
            <QuestCard
              type="weekly"
              title="🛍️ 마켓 거래왕"
              description="마켓플레이스에서 총 50 KAIA 이상의 거래를 완료하세요."
              progress={16}
              maxProgress={50}
              progressText="16/50 KAIA"
              rewardIcon="⛽"
              rewardName="희귀 연료통"
              rewardValue="용량 400L"
              status="locked"
              buttonText="34 KAIA 더 필요"
              buttonDisabled={true}
            />
          </div>
        )}

        {/* 특별 퀘스트 */}
        {activeTab === 'special' && (
          <div className="space-y-4">
            <QuestCard
              type="special"
              title="🌟 DeFi 고수 (선택형)"
              description="고난이도 DeFi 전략 중 하나를 선택하여 30일간 유지하세요."
              progress={0}
              maxProgress={1}
              progressText="옵션 선택 필요"
              rewardIcon="⚡"
              rewardName="전설 NFT"
              rewardValue="고성능 장비"
              status="locked"
              buttonText="옵션 선택"
              onClick={startDefiQuest}
            >
              <DefiOptionSelector
                title="고난이도 옵션 (택1)"
                options={specialDefiOptions}
                selectedOption={selectedDefiOption}
                onOptionSelect={setSelectedDefiOption}
              />
            </QuestCard>
            
            <QuestCard
              type="special"
              title="🪐 전설 행성 정복자"
              description="베텔기우스, 안드로메다, 블랙홀 중 하나를 성공적으로 탐험하세요."
              progress={0}
              maxProgress={1}
              progressText="0/1 완료"
              rewardIcon="⚡"
              rewardName="워프 드라이브"
              rewardValue="순간이동 능력"
              status="locked"
              buttonText="전설 행성 필요"
              buttonDisabled={true}
            />
          </div>
        )}

        {/* 전설 퀘스트 */}
        {activeTab === 'legendary' && (
          <div className="space-y-4">
            <QuestCard
              type="legendary"
              title="💎 Yield Farming 마스터"
              description="LP 제공 → 스테이킹 → 컴파운딩까지 모든 DeFi 전략을 90일간 운용하세요."
              progress={5}
              maxProgress={90}
              progressText="5/90 일"
              rewardIcon="🌌"
              rewardName="우주 제조기"
              rewardValue="무한 NFT 생성"
              status="locked"
              buttonText="85일 더 필요"
              buttonDisabled={true}
            />
            
            <QuestCard
              type="legendary"
              title="🏆 우주 정복자"
              description="모든 행성을 성공적으로 탐험하고 랭킹 1위에 도달하세요."
              progress={15}
              maxProgress={100}
              progressText="3/6 행성 + 47위"
              rewardIcon="👑"
              rewardName="황금 우주선"
              rewardValue="모든 능력치 +999"
              status="locked"
              buttonText="전설적 업적 필요"
              buttonDisabled={true}
            />
            
            <QuestCard
              type="legendary"
              title="🤝 커뮤니티 리더"
              description="LINE 친구 10명 초대 + 100명의 유저와 거래 완료하세요."
              progress={3}
              maxProgress={110}
              progressText="0/10 친구 + 3/100 거래"
              rewardIcon="🎭"
              rewardName="특별 펫 스킨"
              rewardValue="유니크 외형 + 보너스"
              status="locked"
              buttonText="커뮤니티 활동 필요"
              buttonDisabled={true}
            />
          </div>
        )}
        </StaticUI>
      </div>

      <DefiModal
        isOpen={showDefiModal}
        type={currentDefiType}
        onClose={() => {setShowDefiModal(false); setCurrentDefiType(null);}}
        onParticipate={handleParticipateDefi}
        walletBalance={1250}
      />
    </div>
  );
}