'use client';

import { useState } from 'react';
import SunsetBackground from '@/components/home/SunsetBackground';

export default function HomePage() {
  const [activeRankingTab, setActiveRankingTab] = useState<'global' | 'friends'>('global');
  const [activeRankingType, setActiveRankingType] = useState<'score' | 'planets' | 'nfts'>('score');
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

  // 친구 리스트 데이터
  const friends = [
    { 
      id: 1, 
      name: '김철수', 
      status: 'active', 
      description: '보라색 · 항공 연구원 상급',
      avatar: '👨',
      canVisit: true
    },
    { 
      id: 2, 
      name: '박영희', 
      description: '오렌지색 · 2차원 칩',
      avatar: '👩',
      canVisit: true
    },
    { 
      id: 3, 
      name: '이민수', 
      description: '스페이스쉽 초보 대기중',
      avatar: '👱',
      canVisit: false
    },
    { 
      id: 4, 
      name: '최지영', 
      description: '우주 탐험 입문자',
      avatar: '👧',
      canVisit: false
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

  const currentRanking = getCurrentRanking();

  return (
    <div className="relative min-h-full p-4 space-y-6">
      {/* 노을지는 배경 */}
      <SunsetBackground />
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10">
        {/* 나의 업적 섹션 - 맨 위로 이동 */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6">
        <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
          🎖️ 나의 우주 업적
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🌍</div>
            <div className="font-bold text-white">5</div>
            <div className="text-xs text-gray-400">탐험한 행성</div>
          </div>
          
          <div className="bg-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🎁</div>
            <div className="font-bold text-white">23</div>
            <div className="text-xs text-gray-400">수집한 NFT</div>
          </div>
          
          <div className="bg-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="font-bold text-white">2,340</div>
            <div className="text-xs text-gray-400">총 점수</div>
          </div>
          
          <div className="bg-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">👥</div>
            <div className="font-bold text-white">12</div>
            <div className="text-xs text-gray-400">우주 친구</div>
          </div>
        </div>
      </div>

        {/* 탐험 랭킹 섹션 */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-yellow-400 font-bold flex items-center gap-2">
            🏆 탐험 랭킹
          </h2>
          
          {/* 글로벌/친구 탭 */}
          <div className="flex bg-slate-700/50 rounded-full p-1">
            <button
              onClick={() => setActiveRankingTab('global')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                activeRankingTab === 'global'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              글로벌
            </button>
            <button
              onClick={() => setActiveRankingTab('friends')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                activeRankingTab === 'friends'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              LINE 친구
            </button>
          </div>
        </div>

        {/* 랭킹 타입 선택 */}
        <div className="flex bg-slate-700/30 rounded-xl p-1 mb-4">
          <button
            onClick={() => setActiveRankingType('score')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeRankingType === 'score'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            총 점수
          </button>
          <button
            onClick={() => setActiveRankingType('planets')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeRankingType === 'planets'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            탐험 행성
          </button>
          <button
            onClick={() => setActiveRankingType('nfts')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeRankingType === 'nfts'
                ? 'bg-blue-600 text-white'
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
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                user.isMe
                  ? 'bg-yellow-500/20 border border-yellow-500/50'
                  : 'bg-slate-700/50 hover:bg-slate-700/70'
              }`}
            >
              {/* 순위 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                user.rank === 1 ? 'bg-yellow-500 text-black' :
                user.rank === 2 ? 'bg-gray-400 text-black' :
                user.rank === 3 ? 'bg-orange-600 text-white' :
                'bg-slate-600 text-white'
              }`}>
                {user.rank}
              </div>

              {/* 아바타 */}
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-lg">
                {user.avatar}
              </div>

              {/* 유저 정보 */}
              <div className="flex-1">
                <div className="font-medium text-white">
                  {user.name}
                  {user.isMe && <span className="text-yellow-400 ml-1">(나)</span>}
                </div>
                {'org' in user && (
                  <div className="text-xs text-gray-400">{user.org}</div>
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
                <button className="text-lg">🚀</button>
              )}
            </div>
          ))}
        </div>
      </div>

        {/* 친구와 함께 섹션 */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            🏆 LINE 친구와 함께
          </h3>
          
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700/70 transition-all"
              >
                {/* 친구 아바타 */}
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xl">
                  {friend.avatar}
                </div>

                {/* 친구 정보 */}
                <div className="flex-1">
                  <div className="font-medium text-white">{friend.name}</div>
                  <div className="text-sm text-gray-300">{friend.description}</div>
                </div>

                {/* 액션 버튼 */}
                {friend.canVisit ? (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    방문
                  </button>
                ) : (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    초대
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 더 많은 친구 초대 버튼 */}
          <button className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-all">
            + 더 많은 친구 초대하기
          </button>
        </div>

      </div>
    </div>
  );
}