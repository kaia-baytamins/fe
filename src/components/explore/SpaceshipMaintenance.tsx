'use client';

import { useState } from 'react';

interface SpaceshipMaintenanceProps {
  setActiveSection: (section: 'launchpad' | 'pet' | 'maintenance') => void;
}

type ItemCategory = 'engine' | 'fuel' | 'defense' | 'special';

export default function SpaceshipMaintenance({ setActiveSection }: SpaceshipMaintenanceProps) {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('engine');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellPrice, setSellPrice] = useState('');

  // 현재 장착된 아이템들
  const equippedItems = {
    engine: { id: 1, name: '터보 엔진 V3', score: 150, icon: '⚙️', equipped: true },
    fuel: null,
    defense: { id: 2, name: '강화유리', score: 80, icon: '🛡️', equipped: true },
    special: null,
  };

  // 인벤토리 아이템들 (카테고리별)
  const inventoryItems = {
    engine: [
      { id: 1, name: '터보 엔진 V5', score: 200, rarity: 'epic', icon: '⚙️', equipped: false },
      { id: 3, name: '플라즈마 엔진', score: 180, rarity: 'rare', icon: '⚙️', equipped: false },
      { id: 4, name: '기본 엔진', score: 100, rarity: 'common', icon: '⚙️', equipped: false },
    ],
    fuel: [
      { id: 5, name: '크리스탈 유리', score: 200, rarity: 'epic', icon: '⛽', equipped: false },
      { id: 6, name: '빈 술잔', score: 0, rarity: 'common', icon: '⛽', equipped: false },
    ],
    defense: [
      { id: 7, name: '안전 데다', score: 800, rarity: 'legendary', icon: '🛡️', equipped: false },
      { id: 8, name: '기본 방어막', score: 100, rarity: 'common', icon: '🛡️', equipped: false },
    ],
    special: [
      { id: 9, name: '기본 특수장비', score: 100, rarity: 'common', icon: '⚡', equipped: false },
      { id: 10, name: '미지의 NFT', score: 1000, rarity: 'legendary', icon: '⚡', equipped: false },
    ],
  };

  const categories = [
    { id: 'engine', name: '엔진', icon: '⚙️' },
    { id: 'fuel', name: '연료', icon: '⛽' },
    { id: 'defense', name: '방어', icon: '🛡️' },
    { id: 'special', name: '특수', icon: '⚡' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-800/30';
      case 'rare': return 'border-blue-500 bg-blue-800/30';
      case 'epic': return 'border-purple-500 bg-purple-800/30';
      case 'legendary': return 'border-yellow-500 bg-yellow-800/30';
      default: return 'border-gray-500 bg-gray-800/30';
    }
  };

  const handleEquip = (item: any) => {
    // 장착 로직
    console.log('장착:', item);
  };

  const handleSell = (item: any) => {
    setSelectedItem(item);
    setShowSellModal(true);
  };

  const confirmSell = () => {
    if (selectedItem && sellPrice) {
      console.log('판매:', selectedItem, '가격:', sellPrice);
      setShowSellModal(false);
      setSellPrice('');
      setSelectedItem(null);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* 네비게이션 버튼들 */}
      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={() => setActiveSection('launchpad')}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-full text-white font-medium transition-colors"
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
          className="bg-purple-600 px-4 py-2 rounded-full text-white font-medium"
        >
          🔧 우주선 정비
        </button>
      </div>

      {/* 우주선 장착 상태 */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4">
        <h2 className="text-xl font-bold text-center mb-4">🚀 우주선 장착</h2>
        
        <div className="text-center mb-4">
          <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto flex items-center justify-center mb-2">
            <span className="text-4xl">🚀</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => {
            const equipped = equippedItems[category.id as keyof typeof equippedItems];
            return (
              <div key={category.id} className={`p-3 rounded-xl border-2 ${
                equipped ? 'border-green-500 bg-green-800/20' : 'border-dashed border-gray-600 bg-gray-800/20'
              }`}>
                <div className="text-center">
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-sm font-medium">{category.name}</div>
                  {equipped ? (
                    <div className="text-xs text-green-400 mt-1">
                      {equipped.name}
                      <div className="text-yellow-400">+{equipped.score}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mt-1">빈 슬롯</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-yellow-600/20 p-3 rounded-xl mt-4">
          <div className="text-center">
            <h3 className="font-bold text-yellow-400 mb-2">⭐ 총 우주선 스펙</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-bold text-yellow-400">230</div>
                <div className="text-gray-300">추진력</div>
              </div>
              <div>
                <div className="font-bold text-yellow-400">80</div>
                <div className="text-gray-300">방어력</div>
              </div>
              <div>
                <div className="font-bold text-yellow-400">310</div>
                <div className="text-gray-300">종합점수</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 인벤토리 섹션 */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4">
        <h2 className="text-xl font-bold text-red-400 mb-4">🎒 인벤토리</h2>
        
        {/* 카테고리 탭 */}
        <div className="flex gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as ItemCategory)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* 아이템 목록 */}
        <div className="space-y-3">
          {inventoryItems[selectedCategory].map((item) => (
            <div key={item.id} className={`p-4 rounded-xl border-2 ${getRarityColor(item.rarity)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-400">추진력 +{item.score}</div>
                    <div className="text-xs text-yellow-400 capitalize">{item.rarity} NFT</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEquip(item)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    ⚡ 장착
                  </button>
                  <button
                    onClick={() => handleSell(item)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    💰 판매
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {inventoryItems[selectedCategory].length === 0 && (
            <div className="text-center py-8 text-gray-400">
              이 카테고리에 아이템이 없습니다
            </div>
          )}
        </div>
      </div>

      {/* 판매 모달 */}
      {showSellModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-center mb-4">💰 아이템 판매</h3>
            
            <div className="bg-slate-700/50 p-4 rounded-xl mb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{selectedItem.icon}</span>
                <div>
                  <div className="font-medium">{selectedItem.name}</div>
                  <div className="text-sm text-gray-400">추진력 +{selectedItem.score}</div>
                  <div className="text-xs text-yellow-400 capitalize">{selectedItem.rarity} NFT</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-300">
                마켓플레이스에 등록하여 다른 플레이어들에게 판매할 수 있습니다.
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">판매 가격 (KAIA)</label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="판매하고 싶은 가격을 입력하세요"
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSellModal(false);
                  setSellPrice('');
                  setSelectedItem(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmSell}
                disabled={!sellPrice || parseFloat(sellPrice) <= 0}
                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
              >
                판매 등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}