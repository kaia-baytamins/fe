'use client';

import { useState, useEffect } from 'react';
import { inventoryService, InventoryResponse } from '@/services/inventoryService';

interface SpaceshipMaintenanceProps {
  setActiveSection: (section: 'launchpad' | 'pet' | 'maintenance') => void;
}

type ItemCategory = 'engine' | 'material' | 'special' | 'fuel';

export default function SpaceshipMaintenance({ setActiveSection }: SpaceshipMaintenanceProps) {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('engine');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellPrice, setSellPrice] = useState('');
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const [inventoryData, setInventoryData] = useState<InventoryResponse | null>(null);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  // 테스트용 지갑 주소
  const testWalletAddress = '0x1234567890123456789012345678901234567890';

  // 아이템 데이터 가져오기
  useEffect(() => {
    loadItemsData();
    fetchInventoryData();
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

  const fetchInventoryData = async () => {
    try {
      setIsLoadingInventory(true);
      setInventoryError(null);
      
      const inventory = await inventoryService.getInventoryByWallet(testWalletAddress);
      setInventoryData(inventory)
      console.log('📦 API 응답 받은 인벤토리 데이터:', inventory.inventory); //{0: 5, 1: 3, 16: 10, 17: 7, 32: 1}
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setInventoryError('인벤토리를 불러올 수 없습니다');
    } finally {
      setIsLoadingInventory(false);
    }
  };

  // 카테고리에 따른 아이템 필터링
  useEffect(() => {
    const filterItemsByCategory = () => {
      if (!inventoryData || !itemsData.length) {
        setFilteredItems([]);
        return;
      }

      let filtered = [];
      const inventoryIds = Object.keys(inventoryData.inventory).map(id => parseInt(id)); // API 응답에서 itemId 추출

      switch (selectedCategory) {
        case 'engine':
          filtered = itemsData.filter(
            item => inventoryIds.includes(item.id) && item.id >= 0 && item.id <= 15
          );
          break;
        case 'material':
          filtered = itemsData.filter(
            item => inventoryIds.includes(item.id) && item.id >= 16 && item.id <= 31
          );
          break;
        case 'special':
          filtered = itemsData.filter(
            item => inventoryIds.includes(item.id) && item.id >= 32 && item.id <= 47
          );
          break;
        case 'fuel':
          filtered = itemsData.filter(
            item => inventoryIds.includes(item.id) && item.id >= 48 && item.id <= 63
          );
          break;
        default:
          filtered = [];
      }

      setFilteredItems(filtered);
    };

    filterItemsByCategory();
  }, [selectedCategory, itemsData, inventoryData]);

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

  const categories = [
    { id: 'engine', name: '엔진', icon: '⚙️' },
    { id: 'material', name: '재질', icon: '🛠️' },
    { id: 'special', name: '특수장비', icon: '⚡' },
    { id: 'fuel', name: '연료', icon: '⛽' },
  ];

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
          {categories.map((category) => (
            <div key={category.id} className="p-3 rounded-xl border-2 border-gray-600 bg-gray-800/20">
              <div className="text-center">
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
              </div>
            </div>
          ))}
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
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border-2 border-gray-400 bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚙️</span> {/* 아이템 아이콘 */}
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-gray-400">스코어 +{item.score}</div>
                      <div className="text-xs text-blue-400">장착 여부: {item.equipped ? '장착됨' : '미장착'}</div>
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              보유한 아이템이 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
