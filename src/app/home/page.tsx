'use client';

import { useState } from 'react';
import SunsetBackground from '@/components/home/SunsetBackground';
import { useLineFriends } from '@/hooks/useLineFriends';

export default function HomePage({ accessToken, profile, isLoading }) {
  const [activeRankingTab, setActiveRankingTab] = useState<'global' | 'friends'>('global');
  const [activeRankingType, setActiveRankingType] = useState<'score' | 'planets' | 'nfts'>('score');
  const [showInviteSuccessModal, setShowInviteSuccessModal] = useState(false);
  
  const { 
    inviteFriends,      // 친구 초대 함수
    isLoadingFriends    // 로딩 상태
  } = useLineFriends(accessToken); 

  console.log('여기는 home/page');

  // 글로벌 랭킹 데이터 (점수)
  const globalScoreRanking = [
    { rank: 1, name: '우주탐험가123', value: 2890, avatar: '🚀', isMe: false },
    { rank: 2, name: '스타워즈팬', value: 2750, avatar: '⭐', isMe: false },
    { rank: 3, name: '나', value: 2340, avatar: '🛸', isMe: true },
    { rank: 4, name: '코스모스', value: 2180, avatar: '🌌', isMe: false },
    { rank: 5, name: '은하수여행자', value: 2050, avatar: '🌟', isMe: false },
    { rank: 6, name: '화성정착민', value: 1890, avatar: '🔴', isMe: false },
    { rank: 7, name: '달탐험대', value: 1720, avatar: '🌙', isMe: false },
  ];

  // 글로벌 랭킹 데이터 (탐험한 행성)
  const globalPlanetRanking = [
    { rank: 1, name: '행성마스터', value: 15, avatar: '🌍', isMe: false },
    { rank: 2, name: '우주탐험가123', value: 12, avatar: '🚀', isMe: false },
    { rank: 3, name: '갤럭시헌터', value: 10, avatar: '🌌', isMe: false },
    { rank: 4, name: '스타워즈팬', value: 8, avatar: '⭐', isMe: false },
    { rank: 5, name: '나', value: 5, avatar: '🛸', isMe: true },
    { rank: 6, name: '코스모스', value: 4, avatar: '🌟', isMe: false },
    { rank: 7, name: '달탐험대', value: 3, avatar: '🌙', isMe: false },
  ];

  // 글로벌 랭킹 데이터 (NFT 수)
  const globalNFTRanking = [
    { rank: 1, name: 'NFT컬렉터', value: 89, avatar: '💎', isMe: false },
    { rank: 2, name: '보물사냥꾼', value: 67, avatar: '🏆', isMe: false },
    { rank: 3, name: '우주탐험가123', value: 54, avatar: '🚀', isMe: false },
    { rank: 4, name: '갤럭시헌터', value: 43, avatar: '🌌', isMe: false },
    { rank: 5, name: '스타워즈팬', value: 38, avatar: '⭐', isMe: false },
    { rank: 6, name: '나', value: 23, avatar: '🛸', isMe: true },
    { rank: 7, name: '코스모스', value: 19, avatar: '🌟', isMe: false },
  ];

  // 친구 랭킹 데이터 (점수)
  const friendsScoreRanking = [
    { rank: 1, name: '김철수', value: 1850, avatar: '👨', isMe: false, org: 'LINE 친구' },
    { rank: 2, name: '나', value: 1340, avatar: '🛸', isMe: true, org: 'CosmicExplorer' },
    { rank: 3, name: '박영희', value: 1120, avatar: '👩', isMe: false, org: 'LINE 친구' },
    { rank: 4, name: '이민수', value: 890, avatar: '👱', isMe: false, org: 'LINE 친구' },
  ];

  // 친구 랭킹 데이터 (탐험한 행성)
  const friendsPlanetRanking = [
    { rank: 1, name: '김철수', value: 8, avatar: '👨', isMe: false, org: 'LINE 친구' },
    { rank: 2, name: '박영희', value: 6, avatar: '👩', isMe: false, org: 'LINE 친구' },
    { rank: 3, name: '나', value: 5, avatar: '🛸', isMe: true, org: 'CosmicExplorer' },
    { rank: 4, name: '이민수', value: 2, avatar: '👱', isMe: false, org: 'LINE 친구' },
  ];

  // 친구 랭킹 데이터 (NFT 수)
  const friendsNFTRanking = [
    { rank: 1, name: '박영희', value: 45, avatar: '👩', isMe: false, org: 'LINE 친구' },
    { rank: 2, name: '김철수', value: 32, avatar: '👨', isMe: false, org: 'LINE 친구' },
    { rank: 3, name: '나', value: 23, avatar: '🛸', isMe: true, org: 'CosmicExplorer' },
    { rank: 4, name: '이민수', value: 12, avatar: '👱', isMe: false, org: 'LINE 친구' },
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
      name: '박영희', 
      description: '오렌지색 · 2차원 칩',
      avatar: '👩',
    },
    { 
      id: 3, 
      name: '이민수', 
      description: '스페이스쉽 초보 대기중',
      avatar: '👱',
    },
    { 
      id: 4, 
      name: '최지영', 
      description: '우주 탐험 입문자',
      avatar: '👧',
    },
  ];

  // 현재 선택된 랭킹 데이터 가져오기
  const getCurrentRanking = () => {
    if (activeRankingTab === 'global') {
      switch (activeRankingType) {
        case 'score': return globalScoreRanking;
        case 'planets': return globalPlanetRanking;
        case 'nfts': return globalNFTRanking;
        default: return globalScoreRanking;
      }
    } else {
      switch (activeRankingType) {
        case 'score': return friendsScoreRanking;
        case 'planets': return friendsPlanetRanking;
        case 'nfts': return friendsNFTRanking;
        default: return friendsScoreRanking;
      }
    }
  };

  // 랭킹 타입별 단위 가져오기
  const getRankingUnit = () => {
    switch (activeRankingType) {
      case 'score': return '점수';
      case 'planets': return '행성';
      case 'nfts': return 'NFT';
      default: return '점수';
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
    <div className="relative min-h-full p-4 space-y-6">
      {/* 노을지는 배경 */}
      <SunsetBackground />
      
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
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10">
        {/* 나의 업적 섹션 */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-slate-700/50">
          <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
            🎖️ 나의 우주 업적
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-xl p-3 text-center border border-slate-600/30">
              <div className="text-2xl mb-1">🌍</div>
              <div className="font-bold text-white">5</div>
              <div className="text-xs text-gray-400">탐험한 행성</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-3 text-center border border-slate-600/30">
              <div className="text-2xl mb-1">🎁</div>
              <div className="font-bold text-white">23</div>
              <div className="text-xs text-gray-400">수집한 NFT</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-3 text-center border border-slate-600/30">
              <div className="text-2xl mb-1">⭐</div>
              <div className="font-bold text-white">2,340</div>
              <div className="text-xs text-gray-400">총 점수</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-3 text-center border border-slate-600/30">
              <div className="text-2xl mb-1">👥</div>
              <div className="font-bold text-white">12</div>
              <div className="text-xs text-gray-400">우주 친구</div>
            </div>
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
              onClick={() => setActiveRankingType('score')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeRankingType === 'score'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              총 점수
            </button>
            <button
              onClick={() => setActiveRankingType('planets')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeRankingType === 'planets'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              탐험 행성
            </button>
            <button
              onClick={() => setActiveRankingType('nfts')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeRankingType === 'nfts'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              NFT 수
            </button>
          </div>

          {/* 랭킹 리스트 */}
          <div className="space-y-2">
            {currentRanking.map((user) => (
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
                  <div className="font-bold text-blue-400">{
                    activeRankingType === 'score' ? user.value.toLocaleString() : user.value
                  }</div>
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
      </div>
    </div>
  );
}