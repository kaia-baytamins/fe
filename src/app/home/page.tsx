'use client';

import { useState, useEffect } from 'react';
import StarBackground from '@/components/explore/StarBackground';
import StaticCosmicBackground from '@/components/market/StaticCosmicBackground';
import AmbientParticles from '@/components/market/AmbientParticles';
import SimpleFloatingElements from '@/components/market/SimpleFloatingElements';
import StaticUI from '@/components/market/StaticUI';
import { useLineFriends } from '@/hooks/useLineFriends';
import { leaderboardService, LeaderboardRankingEntry, LeaderboardRankingsResponse } from '@/services/leaderboardService';
import { nftService, NFTCollectionResponse } from '@/services/nftService';

export default function HomePage({ profile }) {
  const [activeRankingTab, setActiveRankingTab] = useState<'global' | 'friends'>('global');
  const [activeRankingType, setActiveRankingType] = useState<'explorations' | 'planets'>('explorations');
  const [showInviteSuccessModal, setShowInviteSuccessModal] = useState(false);
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [showNFTShareSuccessModal, setShowNFTShareSuccessModal] = useState(false); // NFT 자랑 성공 모달
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRankingsResponse | null>(null);
  const [isLoadingRanking, setIsLoadingRanking] = useState(true);
  const [rankingError, setRankingError] = useState<string | null>(null);
  const [nftCollection, setNftCollection] = useState<NFTCollectionResponse | null>(null);
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  
  // const { walletAddress } = useWallet(); // 지갑 주소 가져오기
  
  const { 
    inviteFriends,        // 친구 초대 함수
    shareNFTToFriends,    // NFT 자랑하기 함수
    isLoadingFriends      // 로딩 상태
  } = useLineFriends(); 

  console.log('여기는 home/page');

  // NFT 행성별 데이터
  const nftData = {
    moon: {
      name: '달',
      emoji: '🌙',
      image: '/images/hoshitanuNFT/moon-hoshitanu.png',
      externalImage: 'https://kaia-baytamins.github.io/planetNFT-metadata/hoshitanu/moon-hoshitanu.png',
      rarity: '기본 NFT',
      story: '처음으로 달에 발을 딛었을 때의 기분은... 와! 정말 대단했어! 지구에서 보던 것과는 완전히 달랐어. 고요한 크레이터들과 은빛 먼지가 반짝이는 모습이 너무 아름다웠어. 여기서 우주 탐험의 첫 걸음을 시작했다는 게 정말 뿌듯해!'
    },
    mars: {
      name: '화성',
      emoji: '🔴',
      image: '/images/hoshitanuNFT/mars-hoshitanu.png',
      externalImage: 'https://kaia-baytamins.github.io/planetNFT-metadata/hoshitanu/mars-hoshitanu.png',
      rarity: '기본 NFT',
      story: '화성의 붉은 사막에서 모래폭풍을 만났을 때는 정말 무서웠어! 하지만 폭풍이 지나가고 나서 본 화성의 일몰은... 너무너무 아름다워서 눈물이 날 뻔했어. 지구와는 다른 파란색 일몰이 정말 신비로웠어!'
    },
    titan: {
      name: '타이탄',
      emoji: '🌊',
      image: '/images/hoshitanuNFT/titan-hoshitanu.png',
      externalImage: 'https://kaia-baytamins.github.io/planetNFT-metadata/hoshitanu/titan-hoshitanu.png',
      rarity: '기본 NFT',
      story: '타이탄의 메탄 바다에서 수영(?)을 해봤어! 물론 우주복을 입고 말이야 ㅎㅎ. 오렌지색 하늘 아래 펼쳐진 액체 메탄 호수는 정말 환상적이었어. 지구의 바다와는 완전히 다른 느낌이었지만 그만큼 신기하고 재밌었어!'
    },
    europa: {
      name: '유로파',
      emoji: '💧',
      image: '/images/hoshitanuNFT/europa-hoshitanu.png',
      externalImage: 'https://kaia-baytamins.github.io/planetNFT-metadata/hoshitanu/europa-hoshitanu.png',
      rarity: '기본 NFT',
      story: '유로파의 얼음 표면을 뚫고 지하 바다를 탐험했을 때... 정말 짜릿했어! 두꺼운 얼음 아래 숨겨진 거대한 바다에서 신비로운 생명체들을 발견할 수 있을 것 같은 기분이었어. 미지의 세계를 탐험하는 기분이 이런 거구나!'
    },
    saturn: {
      name: '토성',
      emoji: '🌀',
      image: '/images/hoshitanuNFT/saturn-hoshitanu.png',
      externalImage: 'https://kaia-baytamins.github.io/planetNFT-metadata/hoshitanu/saturn-hoshitanu.png',
      rarity: '희귀 NFT',
      story: '토성의 고리 사이를 날아다녔을 때의 그 짜릿함! 무수한 얼음과 돌 조각들 사이를 스르륵 지나가는 기분은... 마치 우주의 롤러코스터를 타는 것 같았어! 아름답고 위험하지만 그만큼 스릴 넘치는 모험이었어!'
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      setIsLoadingRanking(true);
      setRankingError(null);
      
      const data = await leaderboardService.getRankings();
      setLeaderboardData(data);
      
      // 빈 데이터일 때 로그
      if (!data.totalExplorations?.length && !data.successfulExplorations?.length) {
        console.log('⚠️ API returned empty leaderboard data');
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setRankingError('리더보드를 불러올 수 없습니다');
    } finally {
      setIsLoadingRanking(false);
    }
  };

  const fetchNFTCollection = async () => {
    // 테스트용 하드코딩된 주소 사용
    const testAddress = '0x1234567890123456789012345678901234567890';
    
    try {
      setIsLoadingNFT(true);
      console.log('🚀 Fetching NFT collection for TEST ADDRESS:', testAddress);
      
      const data = await nftService.getUserNFTCollection(testAddress);
      setNftCollection(data);
      console.log('📦 NFT Collection data:', data);
      console.log('📊 Total Explorations:', data.totalExplorations);
      console.log('🌍 Conquered Planets:', data.conqueredPlanets);
      console.log('🎮 Owned NFTs:', data.ownedNFTs);
    } catch (error) {
      console.error('Failed to fetch NFT collection:', error);
    } finally {
      setIsLoadingNFT(false);
    }
  };

  // 리더보드 데이터 가져오기
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  // NFT 컬렉션 데이터 가져오기 (페이지 로드 시 바로 테스트)
  useEffect(() => {
    fetchNFTCollection(); // 테스트용 하드코딩 주소로 바로 호출
  }, []);

  // 글로벌 랭킹 데이터 (탐험 횟수)
  const globalExplorationsRanking = [
    { rank: 1, name: 'Kana12', value: 100, avatar: '🚀', isMe: false },
    { rank: 2, name: 'StarLord88', value: 85, avatar: '⭐', isMe: false },
    { rank: 3, name: '나', value: 67, avatar: '🛸', isMe: true },
    { rank: 4, name: 'CosmicRay', value: 54, avatar: '🌌', isMe: false },
    { rank: 5, name: 'GalaxyWalker', value: 43, avatar: '🌟', isMe: false },
    { rank: 6, name: 'RedPlanet99', value: 38, avatar: '🔴', isMe: false },
    { rank: 7, name: 'MoonExplorer', value: 29, avatar: '🌙', isMe: false },
  ];

  // 글로벌 랭킹 데이터 (탐험한 행성)
  const globalPlanetRanking = [
    { rank: 1, name: 'PlanetMaster', value: 15, avatar: '🌍', isMe: false },
    { rank: 2, name: 'Kana12', value: 12, avatar: '🚀', isMe: false },
    { rank: 3, name: 'GalaxyHunter', value: 10, avatar: '🌌', isMe: false },
    { rank: 4, name: 'StarLord88', value: 8, avatar: '⭐', isMe: false },
    { rank: 5, name: '나', value: 5, avatar: '🛸', isMe: true },
    { rank: 6, name: 'CosmicRay', value: 4, avatar: '🌟', isMe: false },
    { rank: 7, name: 'MoonExplorer', value: 3, avatar: '🌙', isMe: false },
  ];


  // 친구 랭킹 데이터 (탐험 횟수)
  const friendsExplorationsRanking = [
    { rank: 1, name: '이윤형', value: 85, avatar: '👨', isMe: false, org: 'LINE 친구' },
    { rank: 2, name: '나', value: 67, avatar: '🛸', isMe: true, org: 'CosmicExplorer' },
    { rank: 3, name: '최예슬', value: 54, avatar: '👩', isMe: false, org: 'LINE 친구' },
    { rank: 4, name: '황준하', value: 43, avatar: '👱', isMe: false, org: 'LINE 친구' },
  ];

  // 친구 랭킹 데이터 (탐험한 행성)
  const friendsPlanetRanking = [
    { rank: 1, name: '황준하', value: 8, avatar: '👨', isMe: false, org: 'LINE 친구' },
    { rank: 2, name: '최예슬', value: 6, avatar: '👩', isMe: false, org: 'LINE 친구' },
    { rank: 3, name: '나', value: 5, avatar: '🛸', isMe: true, org: 'CosmicExplorer' },
    { rank: 4, name: '이윤형', value: 2, avatar: '👱', isMe: false, org: 'LINE 친구' },
  ];


  // 친구 리스트 데이터 (실제로는 백엔드 API에서 가져올 예정)
  const friends = [
    { 
      id: 1, 
      name: profile?.displayName || '김철수', // LIFF 프로필에서 가져온 이름 사용
      status: 'active', 
      description: '보라색 · 항공 연구원 상급',
      avatar: '👨',
    },
    { 
      id: 2, 
      name: '황준하', 
      description: 'Defi 초보 · 게임 러버',
      avatar: '👩',
    },
    { 
      id: 3, 
      name: '이윤형', 
      description: '블록체인 고수 · 해커톤 무법자',
      avatar: '👱',
    },
    { 
      id: 4, 
      name: '최예슬', 
      description: '日本人 · 우주와 동물 애호가',
      avatar: '👧',
    },
  ];

  // API 데이터를 기존 형식으로 변환
  const transformApiDataToRankingFormat = (apiData: LeaderboardRankingEntry[]) => {
    return apiData.map((entry) => ({
      rank: entry.rank,
      name: entry.username,
      value: entry.score,
      avatar: '🚀', // 기본 아바타, 나중에 사용자 아바타 정보 추가 가능
      isMe: false // TODO: 현재 사용자와 비교해서 설정
    }));
  };

  // 현재 선택된 랭킹 데이터 가져오기
  const getCurrentRanking = () => {
    if (activeRankingTab === 'global') {
      // API 데이터가 있으면 사용, 없으면 기본값
      if (leaderboardData) {
        switch (activeRankingType) {
          case 'explorations':
            return leaderboardData.totalExplorations ? transformApiDataToRankingFormat(leaderboardData.totalExplorations) : globalExplorationsRanking;
          case 'planets':
            return leaderboardData.successfulExplorations ? transformApiDataToRankingFormat(leaderboardData.successfulExplorations) : globalPlanetRanking;
          default:
            return leaderboardData.totalExplorations ? transformApiDataToRankingFormat(leaderboardData.totalExplorations) : globalExplorationsRanking;
        }
      }
      // 폴백: 기존 정적 데이터
      switch (activeRankingType) {
        case 'explorations': return globalExplorationsRanking;
        case 'planets': return globalPlanetRanking;
        default: return globalExplorationsRanking;
      }
    } else {
      // 친구 탭은 기존 데이터 사용
      switch (activeRankingType) {
        case 'explorations': return friendsExplorationsRanking;
        case 'planets': return friendsPlanetRanking;
        default: return friendsExplorationsRanking;
      }
    }
  };

  // 랭킹 타입별 단위 가져오기
  const getRankingUnit = () => {
    switch (activeRankingType) {
      case 'explorations': return '횟수';
      case 'planets': return '행성';
      default: return '횟수';
    }
  };

  // NFT 카드 클릭 핸들러
  const handleNFTClick = (nftKey: string) => {
    setSelectedNFT(nftData[nftKey]);
    setShowNFTModal(true);
  };

  // 친구에게 자랑하기 핸들러
  const handleShareNFT = async () => {
    if (!selectedNFT) return;
    
    // 유저명 가져오기 (LIFF 프로필에서)
    const userName = profile?.displayName || '우주탐험가';
    
    // 새로운 NFT 자랑하기 함수 사용 - 외부 이미지 URL 사용
    const result = await shareNFTToFriends(
      selectedNFT.name, 
      userName,
      selectedNFT.externalImage, // 외부 URL 사용
      selectedNFT.story,
      selectedNFT.rarity
    );
    if (result?.success) {
      setShowNFTModal(false);
      setShowNFTShareSuccessModal(true); // NFT 자랑 성공 모달로 변경
    }
  };

  // 친구 초대 핸들러
  const handleInviteFriends = async () => {
    const result = await inviteFriends();
    // inviteFriends에서 성공 여부를 반환하도록 수정해야 함
    if (result?.success) {
      setShowInviteSuccessModal(true);
    }
  };

  const currentRanking = getCurrentRanking();

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* 정적 우주 배경 시스템 */}
      <StarBackground />
      <AmbientParticles />
      <StaticCosmicBackground />
      <SimpleFloatingElements />
      
      {/* 친구 초대 성공 모달 */}
      {showInviteSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 m-4 max-w-sm w-full border border-slate-600">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-white mb-2">
                우주 신호 전송 완료! 🛸
              </h3>
              <p className="text-gray-300 mb-6">
                동료 우주 탐험가들에게<br />
                탐험 초대장을 성공적으로 발송했습니다!
              </p>
              <button
                onClick={() => setShowInviteSuccessModal(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NFT 자랑 성공 모달 */}
      {showNFTShareSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 m-4 max-w-sm w-full border border-slate-600">
            <div className="text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-white mb-2">
                우주 신호 전송 완료! 🛸
              </h3>
              <p className="text-gray-300 mb-6">
                동료 우주 탐험가들에게<br />
                당신의 놀라운 탐험 경험을<br />
                성공적으로 자랑했습니다!
              </p>
              <button
                onClick={() => setShowNFTShareSuccessModal(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 정적 UI 컨테이너 */}
      <div className="relative z-20 p-4 pt-4 space-y-4">
        <StaticUI>
        {/* 나의 우주 컬렉션 섹션 */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-slate-700/50">
          <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
            🎖️ 나의 우주 컬렉션
          </h3>
          
          {/* 탐험 통계 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-3 text-center border border-blue-500/30">
              <div className="text-2xl mb-1">🚀</div>
              <div className="font-bold text-white">
                {isLoadingNFT ? '...' : nftCollection?.totalExplorations || 0}
              </div>
              <div className="text-xs text-blue-400">총 탐험 횟수</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-3 text-center border border-green-500/30">
              <div className="text-2xl mb-1">🌍</div>
              <div className="font-bold text-white">
                {isLoadingNFT ? '...' : nftCollection?.conqueredPlanets || 0}
              </div>
              <div className="text-xs text-green-400">정복한 행성</div>
            </div>
          </div>

          {/* 획득한 행성 NFT 카드들 */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2">🎁 획득한 행성 NFT</h4>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {isLoadingNFT ? (
              <div className="text-gray-400 text-sm">NFT 로딩 중...</div>
            ) : nftCollection && nftCollection.ownedNFTs.length > 0 ? (
              nftCollection.ownedNFTs.map((nft, index) => {
                const planetMapping = {
                  '달': 'moon',
                  '화성': 'mars', 
                  '타이탄': 'titan',
                  '유로파': 'europa',
                  '토성': 'saturn'
                };
                const handleKey = planetMapping[nft.planetInfo.name];
                
                // 각 행성별 그라데이션 색상 매핑
                const gradientColors = {
                  '달': 'from-gray-400/20 to-gray-600/20',
                  '화성': 'from-red-500/20 to-orange-600/20',
                  '타이탄': 'from-blue-500/20 to-cyan-600/20',
                  '유로파': 'from-cyan-500/20 to-blue-600/20',
                  '토성': 'from-purple-500/20 to-pink-600/20'
                };
                
                const borderColors = {
                  '달': 'border-gray-500/30',
                  '화성': 'border-red-500/30',
                  '타이탄': 'border-blue-500/30',
                  '유로파': 'border-cyan-500/30',
                  '토성': 'border-purple-500/30'
                };
                
                return (
                  <div 
                    key={index}
                    onClick={() => handleNFTClick(handleKey)}
                    className={`min-w-[120px] bg-gradient-to-br ${gradientColors[nft.planetInfo.name]} rounded-xl p-3 ${borderColors[nft.planetInfo.name]} border flex-shrink-0 cursor-pointer hover:scale-105 transition-transform`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{nft.planetInfo.emoji}</div>
                      <div className="text-sm font-bold text-white">{nft.planetInfo.name}</div>
                      <div className="text-xs text-gray-400">{nft.planetInfo.rarity}</div>
                      <div className="text-xs text-yellow-400 mt-1">x{nft.count}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 text-sm">아직 획득한 NFT가 없습니다</div>
            )}
            
          </div>
        </div>

        {/* 탐험 랭킹 섹션 */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-yellow-400 font-bold flex items-center gap-2">
              🏆 탐험 랭킹
            </h2>
            
            {/* 글로벌/친구 탭 */}
            <div className="flex bg-slate-700/50 rounded-full p-1 border border-slate-600/30">
              <button
                onClick={() => setActiveRankingTab('global')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  activeRankingTab === 'global'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                글로벌
              </button>
              <button
                onClick={() => setActiveRankingTab('friends')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  activeRankingTab === 'friends'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                LINE 친구
              </button>
            </div>
          </div>

          {/* 랭킹 타입 선택 */}
          <div className="flex bg-slate-700/30 rounded-xl p-1 mb-4 border border-slate-600/30">
            <button
              onClick={() => setActiveRankingType('explorations')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeRankingType === 'explorations'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              탐험 횟수
            </button>
            <button
              onClick={() => setActiveRankingType('planets')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeRankingType === 'planets'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              탐험 행성 수
            </button>
          </div>

          {/* 랭킹 리스트 */}
          <div className="space-y-2">
            {/* 로딩 상태 */}
            {activeRankingTab === 'global' && isLoadingRanking && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                <span className="ml-3 text-gray-300">랭킹 로딩 중...</span>
              </div>
            )}

            {/* 에러 상태 */}
            {activeRankingTab === 'global' && rankingError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
                <div className="text-red-400 text-sm">⚠️ {rankingError}</div>
                <button 
                  onClick={fetchLeaderboardData}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                >
                  다시 시도
                </button>
              </div>
            )}

            {/* 정상 데이터 표시 */}
            {!(activeRankingTab === 'global' && (isLoadingRanking || rankingError)) && currentRanking.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
                  user.isMe
                    ? 'bg-yellow-500/20 border-yellow-500/50 shadow-lg'
                    : 'bg-slate-700/50 hover:bg-slate-700/70 border-slate-600/30'
                }`}
              >
                {/* 순위 */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${
                  user.rank === 1 ? 'bg-yellow-500 text-black' :
                  user.rank === 2 ? 'bg-gray-400 text-black' :
                  user.rank === 3 ? 'bg-orange-600 text-white' :
                  'bg-slate-600 text-white'
                }`}>
                  {user.rank}
                </div>

                {/* 아바타 */}
                <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-lg border border-slate-500/50">
                  {user.avatar}
                </div>

                {/* 유저 정보 */}
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {user.name}
                    {user.isMe && <span className="text-yellow-400 ml-1">(나)</span>}
                  </div>
                  {(user as any).org && (
                    <div className="text-xs text-gray-400">{(user as any).org}</div>
                  )}
                </div>

                {/* 점수/값 */}
                <div className="text-right">
                  <div className="font-bold text-blue-400">{user.value.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{getRankingUnit()}</div>
                </div>

                {/* 액션 버튼 */}
                {!user.isMe && (
                  <button className="text-lg hover:scale-110 transition-transform">🚀</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 친구와 함께 섹션 */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            👥 LINE 친구와 함께
          </h3>
          
          <div className="space-y-3">
            {/* 나와 친구인 사용자만 표시 */}
            {friends
              .filter((friend) => friend.name !== profile?.displayName) // 나 자신 제외
              .map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700/70 transition-all border border-slate-600/30"
                >
                  {/* 친구 아바타 */}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xl border-2 border-orange-400/30 shadow-lg">
                    {friend.avatar}
                  </div>

                  {/* 친구 정보 */}
                  <div className="flex-1">
                    <div className="font-medium text-white">{friend.name}</div>
                    <div className="text-sm text-gray-300">{friend.description}</div>
                  </div>

                  {/* 방문 버튼만 표시 */}
                  <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-xl">
                    방문
                  </button>
                </div>
              ))}
          </div>

          {/* 더 많은 친구 초대 버튼 */}
          <button 
            onClick={handleInviteFriends}
            disabled={isLoadingFriends}
            className={`w-full mt-4 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl ${
              isLoadingFriends 
                ? "bg-slate-800 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            }`}
          >
            {isLoadingFriends ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                초대 중...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="text-lg">🚀</span> 친구 초대하기
              </span>
            )}
          </button>


        </div>
        </StaticUI>
      </div>

      {/* NFT 상세 모달 */}
      {showNFTModal && selectedNFT && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl p-6 m-4 max-w-md w-full border border-slate-600 max-h-[80vh] overflow-y-auto relative">
              {/* 닫기 버튼 */}
              <button 
                onClick={() => setShowNFTModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600 transition-colors"
              >
                ✕
              </button>

              <div className="text-center">
                {/* NFT 제목 */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-3xl">{selectedNFT.emoji}</span>
                  <h3 className="text-xl font-bold text-white">{selectedNFT.name} 탐험 기록</h3>
                </div>

                {/* 호시타누 이미지 */}
                <div className="mb-6">
                  <img 
                    src={selectedNFT.image}
                    alt={`${selectedNFT.name}에서의 호시타누`}
                    className="w-48 h-48 mx-auto rounded-2xl object-cover border-4 border-purple-500/30 shadow-lg"
                  />
                </div>

                {/* NFT 등급 */}
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  selectedNFT.rarity === '희귀 NFT' 
                    ? 'bg-orange-600/80 text-orange-100' 
                    : 'bg-gray-600/80 text-gray-100'
                }`}>
                  {selectedNFT.rarity}
                </div>

                {/* 호시타누의 경험담 */}
                <div className="bg-slate-700/50 rounded-xl p-4 mb-6 border border-slate-600/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-500 p-1">
                      <img 
                        src="/images/hoshitanu.png" 
                        alt="호시타누" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-purple-300">호시타누의 경험담</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed text-left">
                    &quot;{selectedNFT.story}&quot;
                  </p>
                </div>

                {/* 친구에게 자랑하기 버튼 */}
                <button
                  onClick={handleShareNFT}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg"
                >
                  친구에게 자랑하기 🚀
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}