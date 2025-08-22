'use client';

import { useState } from 'react';

interface LaunchPadProps {
  setActiveSection: (section: 'launchpad' | 'pet' | 'maintenance') => void;
}

export default function LaunchPad({ setActiveSection }: LaunchPadProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 임시 데이터
  const currentSpaceshipScore = {
    fuel: 230,
    defense: 80,
    totalScore: 310
  };

  const equippedItems = [
    { type: '엔진', name: '터보 엔진 V3', score: 150, icon: '⚙️' },
    { type: '연료통', name: '빈 통닫', score: 0, icon: '⛽', isEmpty: true },
    { type: '방어막', name: '강화유리', score: 80, icon: '🛡️' },
    { type: '특수장비', name: '특수장비', score: 0, icon: '⚡', isEmpty: true },
  ];

  const planets = [
    { 
      id: 1, 
      name: '달', 
      requiredScore: 100, 
      icon: '🌙', 
      unlocked: true,
      title: "액체 메탄 바다 탐험",
      description: "두꺼운 대기와 메탄 호수(액체 상태의 메탄과 에탄)가 존재. 지구와 유사한 환경을 가진 곳으로, 생명체 가능성이 연구되고 있음. 게임에서는 \"액체 메탄 바다 탐험\"으로 설정 기능.",
      rewardType: "기본 NFT"
    },
    { 
      id: 2, 
      name: '화성', 
      requiredScore: 200, 
      icon: '🔴', 
      unlocked: true,
      title: "붉은 사막의 비밀 탐사",
      description: "화성의 붉은 사막에는 과거 물이 흘렀던 흔적들이 남아있어! 지하에 얼음이 존재하고, 미생물의 흔적을 찾을 수 있을지도 몰라.",
      rewardType: "희귀 NFT"
    },
    { 
      id: 3, 
      name: '목성', 
      requiredScore: 300, 
      icon: '🪐', 
      unlocked: true,
      title: "거대한 폭풍의 중심 탐험",
      description: "목성의 대적점은 지구보다도 큰 거대한 폭풍이야! 이 폭풍의 중심에는 어떤 비밀이 숨어있을까? 강력한 중력과 방사능을 뚫고 탐험해보자!",
      rewardType: "전설 NFT"
    },
    { 
      id: 4, 
      name: '베텔기우스', 
      requiredScore: 500, 
      icon: '⭐', 
      unlocked: false,
      title: "초거성의 마지막 순간",
      description: "언젠가 폭발할 운명의 초거성! 엄청난 에너지와 신비로운 물질들이 가득한 곳이야. 위험하지만 그만큼 희귀한 보상을 얻을 수 있어!",
      rewardType: "신화 NFT"
    },
    { 
      id: 5, 
      name: '유로파', 
      requiredScore: 400, 
      icon: '🧊', 
      unlocked: true,
      title: "얼음 아래 바다 탐험",
      description: "얼음으로 뒤덮인 표면 아래에 거대한 물의 바다가 존재할 가능성이 있어! 외계 생명체의 흔적을 찾는 주요 탐사 대상인 곳이야!",
      rewardType: "우주 NFT"
    },
    { 
      id: 6, 
      name: '트리톤', 
      requiredScore: 600, 
      icon: '❄️', 
      unlocked: false,
      title: "얼음 화산 탐험",
      description: "얼음 화산(cryovolcano)이 분출하며, 표면은 얼음과 질소로 덮여 있어! 신비로운 얼음 세계의 비밀을 파헤쳐보자!",
      rewardType: "??? NFT"
    }
  ];

  const handleLaunch = () => {
    if (selectedPlanet && currentSpaceshipScore.totalScore >= planets.find(p => p.id === selectedPlanet)!.requiredScore) {
      setShowLaunchModal(false);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmLaunch = () => {
    // 실제 탐험 로직 실행
    console.log('탐험 시작!', selectedPlanet);
    setShowConfirmModal(false);
    setSelectedPlanet(null);
    // 여기에 실제 탐험 로직 추가 (컨트랙트 호출 등)
  };

  return (
    <div className="p-4 space-y-6">
      {/* 네비게이션 버튼들 */}
      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={() => setActiveSection('launchpad')}
          className="bg-purple-600 px-4 py-2 rounded-full text-white font-medium"
        >
          🚀 발사소
        </button>
        <button 
          onClick={() => setActiveSection('pet')}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-full text-white font-medium transition-colors"
        >
          🐕 펫 훈련
        </button>
        <button 
          onClick={() => setActiveSection('maintenance')}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-full text-white font-medium transition-colors"
        >
          🔧 우주선 정비
        </button>
      </div>

      {/* 현재 우주선 상태 */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-green-400 font-bold flex items-center gap-2">
            🚀 발사 준비 상태
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{currentSpaceshipScore.fuel}</div>
            <div className="text-sm text-gray-300">추진력</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{currentSpaceshipScore.defense}</div>
            <div className="text-sm text-gray-300">방어력</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{currentSpaceshipScore.totalScore}</div>
            <div className="text-sm text-gray-300">종합점수</div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 mb-4">
          🟡 우수 🟢 엔진 일부 기능
        </div>

        {/* 탐험 시 주의사항 */}
        <div className="bg-orange-600/20 p-3 rounded-xl mb-4">
          <div className="text-orange-400 text-sm font-medium mb-2">⚠️ 탐험 시 주의사항</div>
          <div className="text-sm text-gray-300 mb-2">
            탐험 시작하면 현재 장착된 모든 NFT가 소각됩니다.
          </div>
          <div className="space-y-1">
            {equippedItems.filter(item => !item.isEmpty).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                <span>{item.icon}</span>
                <span>{item.name}</span>
                <span className="text-yellow-400">(+{item.score})</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowLaunchModal(true)}
          className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white font-bold py-3 rounded-xl transition-all"
        >
          🚀 우주 탐험 시작!
        </button>
      </div>

      {/* 행성 선택 모달 */}
      {showLaunchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-slate-800 rounded-2xl p-4 w-full max-w-sm max-h-[80vh] flex flex-col mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-yellow-400">🪐 행성 선택</h3>
              <button 
                onClick={() => setShowLaunchModal(false)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center text-xs text-gray-300 mb-3">
              현재 스펙: {currentSpaceshipScore.totalScore}점
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3 overflow-y-auto flex-1 max-h-64">
              {planets.slice(0, 6).map((planet) => {
                const canExplore = planet.unlocked && currentSpaceshipScore.totalScore >= planet.requiredScore;
                const isLocked = !planet.unlocked || currentSpaceshipScore.totalScore < planet.requiredScore;
                const isSelected = selectedPlanet === planet.id;
                
                return (
                  <button
                    key={planet.id}
                    onClick={() => !isLocked && setSelectedPlanet(planet.id)}
                    disabled={isLocked}
                    className={`h-36 p-3 rounded-2xl border-2 transition-all duration-300 relative ${
                      isSelected && !isLocked
                        ? 'border-green-400 bg-slate-700/50'
                        : canExplore
                        ? 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                        : 'border-slate-600 bg-slate-800/50 opacity-70'
                    }`}
                  >
                    {/* 잠금 오버레이 */}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                        <div className="text-4xl opacity-60">🔒</div>
                      </div>
                    )}
                    
                    <div className="flex flex-col items-center text-center h-full justify-between">
                      <div className="flex-1 flex items-center">
                        <span className="text-3xl">{planet.icon}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="font-bold text-sm">{planet.name}</div>
                        <div className="text-xs text-gray-400">필요: {planet.requiredScore}점</div>
                        
                        {!isLocked && (
                          <div className="bg-yellow-600/80 px-2 py-1 rounded text-xs font-medium">
                            {planet.rewardType}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 선택된 행성 정보 */}
            {selectedPlanet && (
              <div className="bg-slate-700/50 p-3 rounded-lg mb-3 max-h-28 overflow-y-auto">
                {(() => {
                  const planet = planets.find(p => p.id === selectedPlanet);
                  return planet ? (
                    <div>
                      <h4 className="font-bold text-blue-400 mb-1 text-xs">
                        {planet.icon} {planet.title}
                      </h4>
                      <p className="text-xs text-gray-300 leading-tight">
                        {planet.description.substring(0, 80)}...
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowLaunchModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors text-xs"
              >
                취소
              </button>
              <button
                onClick={handleLaunch}
                disabled={!selectedPlanet || (selectedPlanet && (planets.find(p => p.id === selectedPlanet)?.unlocked === false || currentSpaceshipScore.totalScore < planets.find(p => p.id === selectedPlanet)!.requiredScore))}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors text-xs"
              >
                🚀 발사!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 최종 확인 모달 */}
      {showConfirmModal && selectedPlanet && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">
                {planets.find(p => p.id === selectedPlanet)?.icon}
              </div>
              <h3 className="text-lg font-bold text-yellow-400 mb-2">
                탐험 최종 확인
              </h3>
              <p className="text-sm text-gray-300">
                현재 우주선에 장착중인 아이템들을 소각하여{' '}
                <span className="text-blue-400 font-medium">
                  {planets.find(p => p.id === selectedPlanet)?.name}
                </span>을 탐험하시겠습니까?
              </p>
            </div>

            {/* 소각될 아이템 목록 */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
              <h4 className="text-red-400 font-medium mb-3 text-sm">🔥 소각될 아이템:</h4>
              <div className="space-y-2">
                {equippedItems.filter(item => !item.isEmpty).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span>{item.icon}</span>
                    <span className="text-gray-300">{item.name}</span>
                    <span className="text-yellow-400 ml-auto">(+{item.score})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition-colors text-sm"
              >
                취소
              </button>
              <button
                onClick={handleConfirmLaunch}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors text-sm"
              >
                🚀 탐험 시작!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}