'use client';

import { useState, useEffect } from 'react';
import StarBackground from '@/components/explore/StarBackground';
import StaticCosmicBackground from '@/components/market/StaticCosmicBackground';
import AmbientParticles from '@/components/market/AmbientParticles';
import SimpleFloatingElements from '@/components/market/SimpleFloatingElements';
import StaticUI from '@/components/market/StaticUI';
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
  category: string;
  rarity: '기본' | '희귀' | '에픽' | '레전더리';
  type: 'mint' | 'user' | 'quest';
}

export default function MarketPage() {
  // const { getNumericBalance } = useWallet();
  const [currentCategory, setCurrentCategory] = useState('all');
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('price-low');
  const [itemData, setItemData] = useState<Record<string, Item>>({});

  // items.json 데이터를 로드하고 마켓 형식으로 변환
  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetch('/asset/items.json');
        const data = await response.json();
        
        const convertedItems: Record<string, Item> = {};
        
        // 희귀도별 아이템 필터링 (기본 3개, 희귀 2개, 에픽 2개, 레전더리 1개)
        const basicItems = data.items.filter((item: any) => item.score < 100).slice(0, 3);
        const rareItems = data.items.filter((item: any) => item.score >= 100 && item.score < 200).slice(0, 2);
        const epicItems = data.items.filter((item: any) => item.score >= 200 && item.score < 300).slice(0, 2);
        const legendaryItems = data.items.filter((item: any) => item.score >= 300).slice(0, 1);
        
        const filteredItems = [...basicItems, ...rareItems, ...epicItems, ...legendaryItems];

        filteredItems.forEach((item: any, index: number) => {
          // 카테고리 분류
          let category = 'special';
          let icon = '🔧';
          
          if (item.name.includes('엔진')) {
            category = 'engine';
            if (item.name.includes('플라스마') || item.name.includes('에테르')) {
              icon = '🔥';
            } else if (item.name.includes('터보')) {
              icon = '⚡';
            } else {
              icon = '⚙️';
            }
          } else if (item.name.includes('강철') || item.name.includes('티타늄') || 
                     item.name.includes('오리하르콘') || item.name.includes('비브라늄')) {
            category = 'material';
            if (item.name.includes('티타늄')) {
              icon = '🛡️';
            } else if (item.name.includes('오리하르콘') || item.name.includes('비브라늄')) {
              icon = '💎';
            } else {
              icon = '🔩';
            }
          } else if (item.name.includes('연료') || item.name.includes('추진체') || 
                     item.name.includes('메탄') || item.name.includes('플라즈마') ||
                     item.name.includes('바이오매스') || item.name.includes('수소') ||
                     item.name.includes('반물질') || item.name.includes('젤') ||
                     item.name.includes('양자') || item.name.includes('카오스')) {
            category = 'fuel';
            if (item.name.includes('플라즈마') || item.name.includes('반물질') || 
                item.name.includes('양자') || item.name.includes('카오스')) {
              icon = '🌟';
            } else if (item.name.includes('수소') || item.name.includes('이온')) {
              icon = '⚡';
            } else {
              icon = '⛽';
            }
          }
          
          // 희귀도 결정 (score 기반)
          let rarity: '기본' | '희귀' | '에픽' | '레전더리' = '기본';
          if (item.score >= 300) rarity = '레전더리';
          else if (item.score >= 200) rarity = '에픽';
          else if (item.score >= 100) rarity = '희귀';
          
          // 가격 결정 (희귀도 기반으로 수정)
          let price = '1 USDT';
          if (rarity === '레전더리') price = `${Math.floor(item.score / 6)} USDT`;
          else if (rarity === '에픽') price = `${Math.floor(item.score / 8)} USDT`;
          else if (rarity === '희귀') price = `${Math.floor(item.score / 12)} USDT`;
          else price = `${Math.max(1, Math.floor(item.score / 20))} USDT`;
          
          // 판매자 랜덤 생성
          const sellers = [
            '스타쉽테크', '갤럭시엔진', 'SpaceTrader', 'CosmicMaster',
            '아머텍코리아', '크리스탈웍스', '우주연료공사', '프로펠런트프로',
            '네뷸라코퍼레이션', '퀀텀시스템즈', '오리온테크', '안드로메다웍스'
          ];
          const seller = `${sellers[index % sellers.length]}님이 판매`;
          
          convertedItems[`item_${item.id}`] = {
            id: `item_${item.id}`,
            name: item.name,
            icon: icon,
            stats: `성능 +${item.score}`,
            price: price,
            seller: seller,
            category: category,
            rarity: rarity,
            type: 'user'
          };
        });
        
        setItemData(convertedItems);
      } catch (error) {
        console.error('Failed to load items:', error);
      }
    };
    
    loadItems();
  }, []);

  const getFilteredItems = () => {
    const items = Object.values(itemData).filter(item => {
      const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
      const matchesSearch = searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // 가격 정렬 적용
    items.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(' USDT', ''));
      const priceB = parseFloat(b.price.replace(' USDT', ''));
      
      switch (sortOrder) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        default:
          return 0;
      }
    });

    return items;
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
      <div className="relative z-20 p-4 pt-4 space-y-4">
        <StaticUI>
        <SearchAndFilter 
          currentCategory={currentCategory}
          onCategoryChange={setCurrentCategory}
          onSearch={setSearchQuery}
        />

        {/* 아이템 그리드 */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-yellow-400 font-bold flex items-center gap-2">
              🛒 판매 대기열
            </h2>
            
            <select 
              className="bg-slate-700 text-white px-3 py-1 rounded-lg text-sm border border-slate-600"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="price-low">가격 낮은순</option>
              <option value="price-high">가격 높은순</option>
              <option value="popular">인기순</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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