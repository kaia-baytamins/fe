'use client';

import { useState } from 'react';
import StarBackground from '@/components/explore/StarBackground';
import StaticCosmicBackground from '@/components/market/StaticCosmicBackground';
import AmbientParticles from '@/components/market/AmbientParticles';
import SimpleFloatingElements from '@/components/market/SimpleFloatingElements';
import StaticUI from '@/components/market/StaticUI';
import MarketHeader from '@/components/market/MarketHeader';
import SearchAndFilter from '@/components/market/SearchAndFilter';
import StaticItemCard from '@/components/market/StaticItemCard';
import ItemModal from '@/components/market/ItemModal';
import MySalesSection from '@/components/market/MySalesSection';

interface Item {
  id: string;
  name: string;
  icon: string;
  stats: string;
  price: string;
  seller: string;
  type: 'mint' | 'user' | 'quest';
  category: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export default function MarketPage() {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentMarketType, setCurrentMarketType] = useState<'mint' | 'user'>('mint');
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const itemData: Record<string, Item> = {
    'basic_engine': {
      id: 'basic_engine',
      name: '기본 엔진 MK-1',
      icon: '⚙️',
      stats: '추진력 +100',
      price: '2 KAIA',
      seller: '보급형 아이템',
      type: 'mint',
      category: 'engine',
      rarity: 'common'
    },
    'advanced_engine': {
      id: 'advanced_engine',
      name: '플라즈마 엔진',
      icon: '🔥',
      stats: '추진력 +180',
      price: '8 KAIA',
      seller: '보급형 아이템',
      type: 'mint',
      category: 'engine',
      rarity: 'rare'
    },
    'turbo_v5': {
      id: 'turbo_v5',
      name: '터보 엔진 V5',
      icon: '⚙️',
      stats: '추진력 +250',
      price: '15 KAIA',
      seller: 'SpaceTrader님이 판매',
      type: 'user',
      category: 'engine',
      rarity: 'legendary'
    },
    'warp_drive': {
      id: 'warp_drive',
      name: '워프 드라이브',
      icon: '⚡',
      stats: '순간이동 능력',
      price: '50 KAIA',
      seller: 'CosmicMaster님이 판매 (퀘스트 전용)',
      type: 'quest',
      category: 'special',
      rarity: 'legendary'
    },
    'basic_glass': {
      id: 'basic_glass',
      name: '기본 강화유리',
      icon: '🛡️',
      stats: '방어력 +50',
      price: '1.5 KAIA',
      seller: '보급형 아이템',
      type: 'mint',
      category: 'material',
      rarity: 'common'
    },
    'crystal_glass': {
      id: 'crystal_glass',
      name: '크리스탈 유리',
      icon: '💎',
      stats: '방어력 +120',
      price: '6 KAIA',
      seller: '보급형 아이템',
      type: 'mint',
      category: 'material',
      rarity: 'rare'
    },
    'basic_fuel': {
      id: 'basic_fuel',
      name: '표준 연료통',
      icon: '⛽',
      stats: '용량 200L',
      price: '2 KAIA',
      seller: '보급형 아이템',
      type: 'mint',
      category: 'fuel',
      rarity: 'common'
    },
    'large_fuel': {
      id: 'large_fuel',
      name: '대형 연료통',
      icon: '🛢️',
      stats: '용량 500L',
      price: '7 KAIA',
      seller: '보급형 아이템',
      type: 'mint',
      category: 'fuel',
      rarity: 'rare'
    }
  };

  const getFilteredItems = () => {
    return Object.values(itemData).filter(item => {
      const matchesType = currentMarketType === 'mint' ? item.type === 'mint' : item.type !== 'mint';
      const matchesSearch = searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  };

  const openItemModal = (itemId: string) => {
    const item = itemData[itemId];
    if (item) {
      setSelectedItem(item);
      setShowItemModal(true);
    }
  };

  const closeModal = () => {
    setShowItemModal(false);
    setSelectedItem(null);
  };

  const purchaseItem = () => {
    if (selectedItem) {
      alert(`🎉 구매 완료!\n${selectedItem.name}이(가) 인벤토리에 추가되었습니다.`);
      closeModal();
    }
  };

  const openSellModal = () => {
    alert('🎒 인벤토리에서 판매할 아이템을 선택해주세요!\n\n보유 아이템:\n⚙️ 터보 엔진 V3 (1개)\n🔥 플라즈마 엔진 (2개)\n⛽ 대형 연료통 (1개)\n💎 다이아몬드 유리 (1개)\n\n가격을 직접 설정할 수 있습니다.');
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* 정적 우주 배경 시스템 */}
      <StarBackground />
      <AmbientParticles />
      <StaticCosmicBackground />
      <SimpleFloatingElements />
      
      {/* 정적 UI 컨테이너 */}
      <div className="relative z-20 p-4 space-y-6">
        <StaticUI>
        <MarketHeader walletBalance={1250} />
        
        <SearchAndFilter 
          currentCategory={currentCategory}
          currentMarketType={currentMarketType}
          onCategoryChange={setCurrentCategory}
          onMarketTypeChange={setCurrentMarketType}
          onSearch={setSearchQuery}
        />

        {/* 아이템 그리드 */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-yellow-400 font-bold flex items-center gap-2">
              {currentMarketType === 'mint' ? '🏭 보급형 아이템' : '👥 사용자 판매 아이템'}
            </h2>
            
            <select className="bg-slate-700 text-white px-3 py-1 rounded-lg text-sm border border-slate-600">
              <option value="price-low">가격 낮은순</option>
              <option value="price-high">가격 높은순</option>
              <option value="popular">인기순</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <StaticItemCard
                key={item.id}
                {...item}
                currentCategory={currentCategory}
                onClick={openItemModal}
              />
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">🔍</div>
              <div className="text-gray-400">해당 조건에 맞는 아이템이 없습니다.</div>
            </div>
          )}
        </div>

        <MySalesSection onSellItem={openSellModal} />
        </StaticUI>
      </div>

      <ItemModal
        item={selectedItem}
        isOpen={showItemModal}
        onClose={closeModal}
        onPurchase={purchaseItem}
      />
    </div>
  );
}