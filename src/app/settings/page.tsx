'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import StarBackground from '@/components/explore/StarBackground';
import SettingsHeader from '@/components/settings/SettingsHeader';
import ProfileSection from '@/components/settings/ProfileSection';
import SettingsSection from '@/components/settings/SettingsSection';
import SettingItem from '@/components/settings/SettingItem';
import DefiStats from '@/components/settings/DefiStats';
import AppInfo from '@/components/settings/AppInfo';

export default function SettingsPage() {
  const { getNumericBalance } = useWallet();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [language, setLanguage] = useState('ko');

  const languageOptions = [
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
    { value: 'zh', label: '中文' }
  ];

  const handleViewProfile = () => {
    alert('👤 프로필 정보\n\n닉네임: 우주견 코스모\nLevel: 5\n탐험한 행성: 3개\n보유 NFT: 12개\n총 거래량: 45.2 KAIA\n\n가입일: 2024.01.15');
  };

  const handleConnectWallet = () => {
    alert('🔗 지갑 연결\n\n사용 가능한 지갑:\n• Kaia Wallet\n• LINE Wallet\n• MetaMask\n\n지갑을 선택해주세요.');
  };

  const handleExportData = () => {
    alert('📤 데이터 내보내기\n\n다음 데이터를 내보낼 수 있습니다:\n• 게임 진행 상황\n• NFT 목록\n• 거래 내역\n• 스테이킹 현황\n\nJSON 형식으로 내보내시겠습니까?');
  };

  const handleSupport = () => {
    alert('🆘 고객 지원\n\n문의 방법:\n• LINE 공식 계정: @spacepet\n• 이메일: support@spacepet.game\n• 디스코드: discord.gg/spacepet\n\n운영시간: 평일 09:00-18:00 (KST)');
  };

  const handleRateApp = () => {
    alert('⭐ 평점 남기기\n\n앱스토어에서 리뷰를 작성해주세요!\n별점과 리뷰는 큰 도움이 됩니다.\n\n감사합니다! 🙏');
  };

  const handleTerms = () => {
    alert('📄 이용약관\n\n주요 내용:\n• 서비스 이용 규칙\n• 개인정보 처리방침\n• NFT 소유권 규정\n• 환불 정책\n\n자세한 내용은 웹사이트에서 확인하세요.');
  };

  const handleLogout = () => {
    if (confirm('정말 로그아웃하시겠습니까?\n\n게임 진행 상황은 블록체인에 저장되므로 안전합니다.')) {
      alert('로그아웃되었습니다.\n다음에 또 만나요! 🚀');
    }
  };

  return (
    <div className="relative min-h-full">
      {/* 반짝이는 별 배경 */}
      <StarBackground />
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 p-4 space-y-6">
        <SettingsHeader walletBalance={getNumericBalance()} />
        
        <ProfileSection onViewProfile={handleViewProfile} />
        
        {/* 지갑 & 계정 */}
        <SettingsSection title="지갑 & 계정" icon="💼">
          <SettingItem
            icon="🔗"
            name="지갑 연결"
            description="Kaia Wallet 연결됨"
            type="navigation"
            onClick={handleConnectWallet}
          />
          <SettingItem
            icon="📤"
            name="데이터 내보내기"
            description="게임 데이터를 백업하세요"
            type="navigation"
            onClick={handleExportData}
          />
        </SettingsSection>
        
        {/* 게임 설정 */}
        <SettingsSection title="게임 설정" icon="🎮">
          <SettingItem
            icon="🔔"
            name="알림"
            description="퀘스트 및 이벤트 알림"
            type="toggle"
            value={notifications}
            onToggle={setNotifications}
          />
          <SettingItem
            icon="🔊"
            name="효과음"
            description="게임 내 사운드 효과"
            type="toggle"
            value={soundEffects}
            onToggle={setSoundEffects}
          />
          <SettingItem
            icon="🌐"
            name="언어"
            description="한국어 선택됨"
            type="select"
            value={language}
            options={languageOptions}
            onChange={setLanguage}
          />
        </SettingsSection>
        
        {/* DeFi 설정 */}
        <SettingsSection title="DeFi 설정" icon="💰">
          <DefiStats />
        </SettingsSection>
        
        {/* 고객 지원 */}
        <SettingsSection title="고객 지원" icon="🆘">
          <SettingItem
            icon="💬"
            name="문의하기"
            description="LINE 공식계정 또는 이메일"
            type="navigation"
            onClick={handleSupport}
          />
          <SettingItem
            icon="⭐"
            name="평점 남기기"
            description="앱스토어에서 리뷰를 작성해주세요"
            type="navigation"
            onClick={handleRateApp}
          />
          <SettingItem
            icon="📄"
            name="이용약관"
            description="서비스 약관 및 개인정보처리방침"
            type="navigation"
            onClick={handleTerms}
          />
        </SettingsSection>
        
        <AppInfo />
        
        {/* 로그아웃 버튼 */}
        <button 
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          🚪 로그아웃
        </button>
      </div>
    </div>
  );
}