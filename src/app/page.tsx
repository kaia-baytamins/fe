'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import HomeContent from '@/app/home/page';
import ExploreContent from '@/app/explore/page';
import MarketContent from '@/app/market/page';
import QuestContent from '@/app/quest/page';
import SettingsContent from '@/app/settings/page';
import PetSelection from '@/components/PetSelection';
import LoadingScreen from '@/components/LoadingScreen';
import { WalletProvider } from '@/contexts/WalletContext';

import { useLiff } from '@/hooks/useLiff';
import { authService } from '@/services/authService';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [authCompleted, setAuthCompleted] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { accessToken, profile, liffInitialized } = useLiff();

  useEffect(() => {
    const waitForLiffInitialization = async () => {
      console.log('LIFF 초기화 상태:', liffInitialized);
      console.log('LIFF 프로필 데이터:', profile);
  
      // 이미 로그인된 상태인지 확인
      if (authService.isAuthenticated()) {
        console.log('이미 로그인된 상태입니다.');
        setIsLoading(false); // 로딩 상태를 즉시 false로 설정
        return;
      }
  
      // LIFF 초기화가 완료되지 않은 상태
      if (!liffInitialized) {
        setIsLoading(true); // 로딩 상태 유지
        return;
      }

    };
  
    waitForLiffInitialization();
  }, [liffInitialized, profile]);
  

  useEffect(() => {
    const handleAutoLogin = async () => {
      if (profile && !authCompleted && !authService.isAuthenticated()) {
        try {
          console.log('Auto-logging in with LINE profile:', profile);

          const response = await authService.simpleLogin(profile);
          console.log('로그인 응답:', response);

          if (response.isNewUser) {
            setIsNewUser(true);
          }

          setAuthCompleted(true);
          setIsLoading(false); // 로그인 성공 시 로딩 완료!
          console.log('Auto-login completed successfully');
        } catch (error) {
          console.error('Auto-login failed:', error);
          setIsLoading(false); // 로그인 실패해도 로딩 화면은 없애야 함
        }
      }
    };

    handleAutoLogin();
  }, [profile, authCompleted]);

  const handlePetSelection = async (selectedPet) => {
    try {
      console.log('Selected pet:', selectedPet);

      await authService.registerPet(selectedPet);
      setIsNewUser(false);
      setActiveTab('home');
    } catch (error) {
      console.error('Failed to register pet:', error);
    }
  };

  const renderMainContent = () => {
    const commonProps = { accessToken, profile, isLoading };

    if (isNewUser) {
      return <PetSelection onPetSelect={handlePetSelection} userProfile={profile} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeContent {...commonProps} />;
      case 'explore':
        return <ExploreContent profile={profile} />;
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log('현재 상태:', { isLoading, authCompleted, isNewUser });

  return (
    <WalletProvider>
      <div className="h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
        {/* 상단 헤더 및 하단 탭바를 새로운 유저가 아닐 때만 표시 */}
        {!isNewUser && <Header activeTab={activeTab} />}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            paddingTop: isNewUser ? '0px' : '60px', // Header 높이 제외
            paddingBottom: isNewUser ? '0px' : '60px', // TabBar 높이 제외
          }}
        >
          {renderMainContent()}
        </main>
        {!isNewUser && <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />}
      </div>
    </WalletProvider>
  );
}
