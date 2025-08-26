'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import HomeContent from '@/app/home/page';
import ExploreContent from '@/app/explore/page';
import MarketContent from '@/app/market/page';
import QuestContent from '@/app/quest/page';
import SettingsContent from '@/app/settings/page';
import PetSelection from '@/components/PetSelection'; // 펫 선택 화면 컴포넌트

import { useLiff } from '@/hooks/useLiff';
import { authService } from '@/services/authService';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home'); // 현재 활성화된 탭 상태 관리
  const [authCompleted, setAuthCompleted] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false); // 새로운 유저 여부
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  

  // 메인에서 LIFF 데이터 관리
  const { accessToken, profile, liffInitialized } = useLiff();

  // LIFF 초기화 중 로딩 화면 처리
  useEffect(() => {
    if (!liffInitialized) {
      setIsLoading(true); // LIFF 초기화 중
    } else {
      setIsLoading(false); // LIFF 초기화 완료
    }
  }, [liffInitialized]);

  // Auto-login when profile is available
  useEffect(() => {
    const handleAutoLogin = async () => {
      if (profile && !authCompleted && !authService.isAuthenticated()) {
        try {
          console.log('Auto-logging in with LINE profile:', profile);
          // 백엔드 로그인 API 호출
          const response = await authService.simpleLogin(profile);

          if (response.isNewUser) {
            // 새로운 유저임을 확인
            setIsNewUser(true);
          }
          setAuthCompleted(true);
          console.log('Auto-login completed successfully');
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      }
    };

    handleAutoLogin();
  }, [profile, authCompleted]);

  // 펫 선택 완료 후 처리 로직
  const handlePetSelection = async (selectedPet) => {
    try {
      console.log('Selected pet:', selectedPet);

      // 펫 선택 API 호출
      await authService.registerPet(selectedPet);

      // 펫 선택 완료 후 홈 화면으로 이동
      setIsNewUser(false); // 펫 선택 완료 후 일반 유저로 전환
      setActiveTab('home');
    } catch (error) {
      console.error('Failed to register pet:', error);
    }
  };

  // 활성 탭에 따른 컴포넌트 매핑 - profile을 props로 전달
  const renderMainContent = () => {
    const commonProps = { accessToken, profile, isLoading };

    // 새로운 유저일 경우 펫 선택 화면 띄우기
    if (isNewUser) { //test -> !isNewUser
      return <PetSelection onPetSelect={handlePetSelection} userProfile={profile} />;
    }

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
  );
}
