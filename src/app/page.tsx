'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import HomeContent from '@/app/home/page';
import ExploreContent from '@/app/explore/page';
import MarketContent from '@/app/market/page';
import QuestContent from '@/app/quest/page';
import SettingsContent from '@/app/settings/page';

import { useLiff } from '@/hooks/useLiff';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  
  // 메인에서 LIFF 데이터 관리
  const { accessToken, profile, isLoading } = useLiff();

  // 활성 탭에 따른 컴포넌트 매핑 - profile을 props로 전달
  const renderMainContent = () => {
    const commonProps = { accessToken, profile, isLoading };
    
    switch (activeTab) {
      case 'home':
        return <HomeContent {...commonProps} />;
      case 'explore':
        return <ExploreContent  />;
      case 'market':
        return <MarketContent  />;
      case 'quest':
        return <QuestContent  />;
      case 'settings':
        return <SettingsContent  />;
      default:
        return <HomeContent {...commonProps} />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* 상단 헤더 컴포넌트 */}
      <Header 
        activeTab={activeTab}
      />

      {/* 메인 콘텐츠 영역 - 스크롤 가능 */}
      <main className="flex-1 overflow-y-auto">
        {renderMainContent()}
      </main>

      {/* 하단 탭바 컴포넌트 - 고정 */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}