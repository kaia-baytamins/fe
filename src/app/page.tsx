'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import HomeContent from '@/app/home/page';
import ExploreContent from '@/app/explore/page';
import MarketContent from '@/app/market/page';
import QuestContent from '@/app/quest/page';
import SettingsContent from '@/app/settings/page';

import { useLiff } from '@/hooks/useLiff';
import { authService } from '@/services/authService';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home'); // 현재 활성화된 탭 상태 관리
  const [authCompleted, setAuthCompleted] = useState(false);

  // 메인에서 LIFF 데이터 관리
  const { accessToken, profile, isLoading } = useLiff();

  // Auto-login when profile is available
  useEffect(() => {
    const handleAutoLogin = async () => {
      if (profile && !authCompleted && !authService.isAuthenticated()) {
        try {
          console.log('Auto-logging in with LINE profile:', profile);
          await authService.simpleLogin(profile);
          setAuthCompleted(true);
          console.log('Auto-login completed successfully');
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      }
    };

    handleAutoLogin();
  }, [profile, authCompleted]);

  // 활성 탭에 따른 컴포넌트 매핑 - profile을 props로 전달
  const renderMainContent = () => {
    const commonProps = { accessToken, profile, isLoading };

    switch (activeTab) {
      case 'home':
        return <HomeContent {...commonProps} />;
      case 'explore':
        return <ExploreContent />;
      case 'market':
        return <MarketContent />;
      case 'quest':
        return <QuestContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <HomeContent {...commonProps} />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* 상단 헤더 컴포넌트 - activeTab을 props로 전달 */}
      <Header activeTab={activeTab} />

      {/* 메인 콘텐츠 영역 - 스크롤 가능 */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: '60px', // Header 높이만큼 패딩 추가
          paddingBottom: '60px', // TabBar 높이만큼 패딩 추가
        }}
      >
        {renderMainContent()}
      </main>

      {/* 하단 탭바 컴포넌트 - 고정 */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
