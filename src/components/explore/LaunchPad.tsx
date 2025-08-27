'use client';

import { useState, useEffect } from 'react';
import { inventoryService } from '@/services/inventoryService';
import StaticUI from '@/components/market/StaticUI';

interface LaunchPadProps {
  setActiveSection: (section: 'launchpad' | 'maintenance') => void;
  profile?: any; // LIFF 프로필 정보
}

export default function LaunchPad({ setActiveSection, profile }: LaunchPadProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [showTrainModal, setShowTrainModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // 펫 점수 데이터 (state로 변경)
  const [petStats, setPetStats] = useState({
    health: 30, // 체력
    agility: 20, // 민첩성
    intelligence: 30, // 지능
  });

  // 펫 아이템 보유량 (state로 변경)
  const [petItems, setPetItems] = useState({
    food: 5, // 사료 개수
    toy: 3,  // 장난감 개수
  });

  // 실제 장착된 아이템 데이터
  const [equippedItems, setEquippedItems] = useState<any>({});
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [isLoadingEquipped, setIsLoadingEquipped] = useState(true);

  // 테스트용 지갑 주소 (SpaceshipMaintenance와 동일)
  const testWalletAddress = '0x1234567890123456789012345678901234567890';

  // 아이템 ID로 아이템 정보 찾기
  const getItemById = (itemId: number) => {
    return itemsData.find(item => item.id === itemId);
  };

  // 실제 장착된 아이템들을 배열로 변환
  const getEquippedItemsArray = () => {
    const equipped = [];
    // SpaceshipMaintenance와 동일한 매핑 구조 사용
    const categoryMapping = {
      engine: { name: '엔진', icon: '⚙️' },
      material: { name: '우주선소재', icon: '🛡️' },  
      specialEquipment: { name: '특수장비', icon: '⚡' },
      fuelTank: { name: '연료', icon: '⛽' }
    };

    Object.entries(categoryMapping).forEach(([key, category]) => {
      const equippedItem = equippedItems[key];
      console.log(`🔍 발사소에서 ${key} 체크:`, {
        key,
        equippedItem,
        hasItemId: equippedItem?.itemId,
        itemInfo: (equippedItem?.itemId !== undefined && equippedItem?.itemId !== null) ? getItemById(equippedItem.itemId) : null
      });
      
      if (equippedItem && equippedItem.itemId !== undefined && equippedItem.itemId !== null) {
        const itemInfo = getItemById(equippedItem.itemId);
        if (itemInfo) {
          equipped.push({
            type: category.name,
            name: itemInfo.name,
            score: itemInfo.score,
            icon: category.icon,
            isEmpty: false
          });
        }
      } else {
        equipped.push({
          type: category.name,
          name: category.name,
          score: 0,
          icon: category.icon,
          isEmpty: true
        });
      }
    });

    return equipped;
  };

  const equippedItemsArray = getEquippedItemsArray();
  const spaceshipScore = equippedItemsArray.reduce((total, item) => total + item.score, 0);
  
  // 디버깅용 로그
  console.log('🚀 발사소 전체 상태:', {
    equippedItems,
    equippedItemsArray,
    spaceshipScore
  });

  const planets = [
    {
      "id": 1,
      "name": "달",
      "requiredScore": 10,
      "icon": "🌙",
      "unlocked": true,
      "title": "지구의 위성 탐험",
      "description": "밤하늘에 언제나 떠 있는 달. 가장 가까운 곳이지만, 수많은 운석 충돌 자국과 고요한 암석 평원이 숨겨져 있어. 우주 탐사의 첫걸음을 떼보자!",
      "rewardType": "기본 NFT"
    },
    {
      "id": 2,
      "name": "화성",
      "requiredScore": 20,
      "icon": "🔴",
      "unlocked": true,
      "title": "붉은 행성 생명체 탐사",
      "description": "화성의 붉은 사막에는 과거 물이 흘렀던 흔적들이 남아있어! 지하에 얼음이 존재하고, 미생물의 흔적을 찾을 수 있을지도 몰라.",
      "rewardType": "기본 NFT"
    },
    {
      "id": 3,
      "name": "타이탄",
      "requiredScore": 40,
      "icon": "🌊",
      "unlocked": true,
      "title": "액체 메탄 바다 탐험",
      "description": "두꺼운 오렌지색 대기 아래에는 액체 메탄과 에탄으로 이루어진 바다와 호수가 펼쳐져! 지구와 비슷하지만 전혀 다른 환경을 탐험하며 생명체의 단서를 찾아봐.",
      "rewardType": "기본 NFT"
    },
    {
      "id": 4,
      "name": "유로파",
      "requiredScore": 60,
      "icon": "💧",
      "unlocked": true,
      "title": "얼음 아래의 바다 탐험",
      "description": "수십 킬로미터 두께의 얼음 껍질 아래에 거대한 물의 바다가 숨겨져 있어! 외계 생명체가 존재할 가장 유력한 후보지에서 너의 탐사선을 띄워봐.",
      "rewardType": "기본 NFT"
    },
    {
      "id": 5,
      "name": "토성",
      "requiredScore": 100,
      "icon": "🌀",
      "unlocked": true,
      "title": "토성의 아름다운 고리 탐험",
      "description": "토성 주위를 둘러싼 얼음과 먼지로 이루어진 거대한 고리야. 수많은 조각들을 뚫고 고리 속으로 진입해 미지의 물질들을 수집할 수 있어!",
      "rewardType": "희귀 NFT"
    },
    {
      "id": 6,
      "name": "천왕성",
      "requiredScore": 150,
      "icon": "🥶",
      "unlocked": false,
      "title": "차가운 청록색 행성 탐사",
      "description": "푸른색의 차가운 가스 행성이야. 가끔은 수평으로 회전하는 독특한 자전축 때문에 엄청난 폭풍이 몰아치곤 하지. 신비로운 가스들을 채집해봐!",
      "rewardType": "희귀 NFT"
    },
    {
      "id": 7,
      "name": "트리톤",
      "requiredScore": 300,
      "icon": "🧊",
      "unlocked": false,
      "title": "얼음 화산의 신비",
      "description": "해왕성의 위성인 트리톤에는 얼음 화산이 존재해! 표면을 뒤덮은 얼음과 질소가 분출되는 신비로운 곳이야. 극한의 환경을 극복하고 미지의 광물을 찾아내!",
      "rewardType": "희귀 NFT"
    },
    {
      "id": 8,
      "name": "해왕성",
      "requiredScore": 350,
      "icon": "❄️",
      "unlocked": false,
      "title": "태양계 끝의 미스터리",
      "description": "태양계 가장 바깥에서 거친 바람을 맞으며 홀로 빛나는 푸른 행성이야. 아직 인간의 발길이 닿지 않은 미지의 영역을 개척해봐!",
      "rewardType": "희귀 NFT"
    },
    {
      "id": 9,
      "name": "명왕성",
      "requiredScore": 400,
      "icon": "💫",
      "unlocked": false,
      "title": "외로운 얼음 세계 탐험",
      "description": "태양계의 가장 외딴 곳에 있는 왜소 행성이야. 고대의 비밀이 잠들어 있는 얼음과 바위의 세계에서 누구도 보지 못한 유물을 발견할 수 있어!",
      "rewardType": "희귀 NFT"
    },
    {
      "id": 10,
      "name": "시리우스",
      "requiredScore": 500,
      "icon": "✨",
      "unlocked": false,
      "title": "밤하늘에서 가장 밝은 별",
      "description": "태양계 밖에서 가장 가까운 항성이야. 엄청난 에너지를 뿜어내는 이 거대한 별을 탐사하며, 인류의 에너지 기술을 한 단계 진보시킬 수 있어!",
      "rewardType": "에픽 NFT"
    },
    {
      "id": 11,
      "name": "알데바란",
      "requiredScore": 550,
      "icon": "⭐️",
      "unlocked": false,
      "title": "황소자리의 눈 탐험",
      "description": "황소자리의 눈을 이루는 황색 거성 알데바란이야. 수백 년에 걸쳐 타오르는 거대한 별의 표면을 탐험하고, 별의 진화를 연구해봐!",
      "rewardType": "에픽 NFT"
    },
    {
      "id": 12,
      "name": "베텔기우스",
      "requiredScore": 600,
      "icon": "💥",
      "unlocked": false,
      "title": "초거성 폭발의 순간",
      "description": "언제 폭발할지 모르는 거대한 붉은 별! 엄청난 에너지와 희귀한 물질들이 가득하지만, 위험도 상상을 초월해. 최고의 조종사만이 도전할 수 있는 곳이야!",
      "rewardType": "에픽 NFT"
    },
    {
      "id": 13,
      "name": "블랙홀",
      "requiredScore": 1000,
      "icon": "⚫",
      "unlocked": false,
      "title": "중력의 끝없는 구멍",
      "description": "빛조차 탈출할 수 없는 강력한 중력의 끝없는 구멍이야. 우주 최강의 도전! 이 미지의 영역을 탐사하면 우주의 가장 큰 비밀을 알게 될지도 몰라.",
      "rewardType": "전설 NFT"
    },
    {
      "id": 14,
      "name": "안드로메다 은하",
      "requiredScore": 700,
      "icon": "🌌",
      "unlocked": false,
      "title": "먼 은하의 신비",
      "description": "우리 은하와 가장 가까운 대형 은하인 안드로메다 은하야. 수조 개의 별과 행성들을 탐험하며 미지의 세계를 탐사하고 새로운 문명의 흔적을 찾아봐.",
      "rewardType": "에픽 NFT"
    },
    {
      "id": 15,
      "name": "오르트 구름",
      "requiredScore": 800,
      "icon": "☁️",
      "unlocked": false,
      "title": "태양계 경계의 장막",
      "description": "태양계를 둘러싼 얼음 천체들의 집합체야. 태양계의 끝에서 신비로운 얼음 물질들을 채굴하며 다음 탐사 장소를 위한 자원을 모아봐!",
      "rewardType": "에픽 NFT"
    },
    {
      "id": 16,
      "name": "WASP-12b",
      "requiredScore": 900,
      "icon": "🔥",
      "unlocked": false,
      "title": "별 가까이의 위험한 행성",
      "description": "별에 너무 가까워 표면이 증발하고 있는 뜨거운 가스 행성이야. 극한의 환경을 견뎌내고 특별한 보상을 얻을 수 있는 최고의 모험지야!",
      "rewardType": "에픽 NFT"
    }
  ]
  

  const handleLaunch = () => {
    if (selectedPlanet && spaceshipScore >= planets.find(p => p.id === selectedPlanet)!.requiredScore) {
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

  // 데이터 로드
  useEffect(() => {
    loadItemsData();
    fetchEquippedItems();
  }, []);

  // items.json 데이터 로드
  const loadItemsData = async () => {
    try {
      const response = await fetch('/asset/items.json'); 
      const data = await response.json(); 
      setItemsData(data.items || []); 
      console.log('📜 아이템 데이터 로드:', data.items); 
    } catch (error) {
      console.error('Failed to load items data:', error);
    }
  };

  const fetchEquippedItems = async () => {
    try {
      setIsLoadingEquipped(true);
      const equipped = await inventoryService.getEquippedItems(testWalletAddress);
      setEquippedItems(equipped?.equipment || {});
      console.log('🔧 발사소에서 장착된 아이템 데이터:', equipped);
    } catch (error) {
      console.error('Failed to fetch equipped items:', error);
      setEquippedItems({});
    } finally {
      setIsLoadingEquipped(false);
    }
  };

  const handleFeedPet = () => {
    if (petItems.food <= 0) {
      alert('사료가 부족합니다!');
      return;
    }
    console.log('🍖 펫에게 사료 주기');
    
    // 사료 개수 감소
    setPetItems(prev => ({
      ...prev,
      food: prev.food - 1
    }));
    
    // 체력 증가
    setPetStats(prev => ({
      ...prev,
      health: prev.health + 5
    }));
    
    setShowFeedModal(true);
    // TODO: API 호출로 펫 사료 주기 구현
  };

  const handleTrainPet = () => {
    if (petItems.toy <= 0) {
      alert('장난감이 부족합니다!');
      return;
    }
    console.log('💪 펫 훈련하기');
    
    // 장난감 개수 감소
    setPetItems(prev => ({
      ...prev,
      toy: prev.toy - 1
    }));
    
    // 민첩성과 지능 증가
    setPetStats(prev => ({
      ...prev,
      agility: prev.agility + 3,
      intelligence: prev.intelligence + 2
    }));
    
    setShowTrainModal(true);
    // TODO: API 호출로 펫 훈련 구현
  };

  return (
    <div className="p-4 space-y-6">
      <StaticUI>
      {/* 네비게이션 버튼들 */}
      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={() => setActiveSection('launchpad')}
          className="bg-purple-600 px-4 py-2 rounded-full text-white font-medium"
        >
          🚀 발사소
        </button>
        <button 
          onClick={() => setActiveSection('maintenance')}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-full text-white font-medium transition-colors"
        >
          🔧 우주선 정비
        </button>
      </div>

      {/* 우주친구 상태 */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-green-400 font-bold flex items-center gap-2">
            🌟 나 {profile?.displayName || '탐험가'}의 우주 탐험을 도와줄 준비가 되었어!
          </h2>
        </div>
        
        {/* 펫 캐릭터 이미지 */}
        <div className="text-center mb-4">
          <div className="relative">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-500 p-1">
              <img 
                src="/images/hoshitanu.png" 
                alt="Hoshitanu" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* 속성 설명 버튼 */}
            <button
              onClick={() => setShowStatsModal(true)}
              className="absolute top-2 right-2 w-6 h-6 bg-white/30 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors shadow-lg"
            >
              ?
            </button>
          </div>
          <div className="text-sm text-gray-300 mt-2 font-medium">호시타누</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{petStats.health}</div>
            <div className="text-sm text-gray-300">체력</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{petStats.agility}</div>
            <div className="text-sm text-gray-300">민첩성</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{petStats.intelligence}</div>
            <div className="text-sm text-gray-300">지능</div>
          </div>
        </div>
        
        {/* 펫 관리 버튼들 */}
        <div className="space-y-3">
          <button 
            onClick={() => handleFeedPet()}
            className={`w-full font-medium py-3 px-4 rounded-xl transition-colors flex flex-col items-center justify-center gap-1 ${
              petItems.food > 0 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={petItems.food <= 0}
          >
            <div className="flex items-center gap-2">
              <span>🍖 사료주기</span>
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{petItems.food}</span>
            </div>
            <div className="text-xs opacity-80">체력이 랜덤으로 증가합니다</div>
          </button>
          
          <button 
            onClick={() => handleTrainPet()}
            className={`w-full font-medium py-3 px-4 rounded-xl transition-colors flex flex-col items-center justify-center gap-1 ${
              petItems.toy > 0 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={petItems.toy <= 0}
          >
            <div className="flex items-center gap-2">
              <span>🎾 훈련하기</span>
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{petItems.toy}</span>
            </div>
            <div className="text-xs opacity-80">민첩성과 지능이 랜덤으로 증가합니다</div>
          </button>
        </div>
      </div>

      {/* 우주선 상태 */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-green-400 font-bold flex items-center gap-2">
            🚀 발사 준비 상태
          </h2>
        </div>
        
        <div className="text-center text-2xl font-bold text-purple-400 mb-4">
          {spaceshipScore} 점
        </div>
        <div className="text-center text-sm text-gray-400 mb-4">
          장착된 아이템 점수의 합산
        </div>

        {/* 탐험 시 주의사항 */}
        <div className="bg-orange-600/20 p-3 rounded-xl mb-4">
          <div className="text-orange-400 text-sm font-medium mb-2">⚠️ 탐험 시 주의사항</div>
          <div className="text-sm text-gray-300 mb-2">
            탐험 시작하면 현재 장착된 모든 NFT가 소각됩니다.
          </div>
          <div className="space-y-1">
            {equippedItemsArray.filter(item => !item.isEmpty).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                <span>{item.icon}</span>
                <span>{item.name}</span>
                <span className="text-yellow-400">(+{item.score})</span>
              </div>
            ))}
            {equippedItemsArray.filter(item => !item.isEmpty).length === 0 && (
              <div className="text-xs text-gray-500">장착된 아이템이 없습니다</div>
            )}
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
              현재 스펙: {spaceshipScore}점
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3 overflow-y-auto flex-1 max-h-64">
              {planets.map((planet) => {
                const canExplore = planet.unlocked && spaceshipScore >= planet.requiredScore;
                const isLocked = !planet.unlocked || spaceshipScore < planet.requiredScore;
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
              <div className="bg-slate-700/50 p-4 rounded-lg mb-3 max-h-40 overflow-y-auto">
                {(() => {
                  const planet = planets.find(p => p.id === selectedPlanet);
                  return planet ? (
                    <div>
                      <h4 className="font-bold text-blue-400 mb-2 text-sm">
                        {planet.icon} {planet.title}
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {planet.description}
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
                disabled={!selectedPlanet || (selectedPlanet && (planets.find(p => p.id === selectedPlanet)?.unlocked === false || spaceshipScore < planets.find(p => p.id === selectedPlanet)!.requiredScore))}
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
                {equippedItemsArray.filter(item => !item.isEmpty).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span>{item.icon}</span>
                    <span className="text-gray-300">{item.name}</span>
                    <span className="text-yellow-400 ml-auto">(+{item.score})</span>
                  </div>
                ))}
                {equippedItemsArray.filter(item => !item.isEmpty).length === 0 && (
                  <div className="text-sm text-gray-500">장착된 아이템이 없습니다</div>
                )}
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

      {/* 사료주기 모달 */}
      {showFeedModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-500 p-1">
                <img 
                  src="/images/hoshitanu.png" 
                  alt="Hoshitanu" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-green-400 mb-2">
                움냠냠!! 맛있다! 너무 고마워!
              </h3>
              <p className="text-sm text-gray-300">
                🍖 덕분에 체력이 <span className="text-green-400 font-bold">+5</span> 늘었어!
              </p>
            </div>

            <button
              onClick={() => setShowFeedModal(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 훈련하기 모달 */}
      {showTrainModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-500 p-1">
                <img 
                  src="/images/hoshitanu.png" 
                  alt="Hoshitanu" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                열심히 훈련했어! 고마워!
              </h3>
              <p className="text-sm text-gray-300">
                💪 덕분에 민첩성이 <span className="text-yellow-400 font-bold">+3</span>, 지능이 <span className="text-blue-400 font-bold">+2</span> 늘었어!
              </p>
            </div>

            <button
              onClick={() => setShowTrainModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 속성 설명 모달 */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 relative">
            {/* 닫기 버튼 */}
            <button 
              onClick={() => setShowStatsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600 transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-500 p-1">
                <img 
                  src="/images/hoshitanu.png" 
                  alt="Hoshitanu" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                🌟 호시타누 능력치 설명
              </h3>
            </div>

            <div className="space-y-4">
              {/* 체력 설명 */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">❤️</div>
                  <div className="font-bold"><span className="text-red-400">체력</span> <span className="text-white">현재: {petStats.health}</span></div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  탐험 보낼 때의 소요 시간이 체력 수치에 비례해 감소해요!
                </p>
              </div>

              {/* 민첩성 설명 */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">⚡</div>
                  <div className="font-bold"><span className="text-yellow-400">민첩성</span> <span className="text-white">현재: {petStats.agility}</span></div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  돌발 이벤트 발생 시 회피 또는 캐치 확률이 올라가요!
                </p>
              </div>

              {/* 지능 설명 */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🧠</div>
                  <div className="font-bold"><span className="text-blue-400">지능</span> <span className="text-white">현재: {petStats.intelligence}</span></div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  좋은 등급의 보상을 받아올 확률이 올라가요!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      </StaticUI>
    </div>
  );
}
