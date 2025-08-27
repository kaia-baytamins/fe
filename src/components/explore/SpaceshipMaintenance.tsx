'use client';

import { useState, useEffect } from 'react';
import { inventoryService, InventoryResponse } from '@/services/inventoryService';
import SellItemModal from './SellItemModal';

interface SpaceshipMaintenanceProps {
  setActiveSection: (section: 'launchpad' | 'maintenance') => void;
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
  const [equippedItems, setEquippedItems] = useState<any>({});
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  // 테스트용 지갑 주소
  const testWalletAddress = '0x1234567890123456789012345678901234567890';

  // 아이템 데이터 가져오기
  useEffect(() => {
    loadItemsData();
    fetchInventoryData();
    fetchEquippedItems(); // 장착 상태 조회 활성화
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

  const fetchEquippedItems = async () => {
    try {
      const equipped = await inventoryService.getEquippedItems(testWalletAddress);
      setEquippedItems(equipped?.equipment || {});
      console.log('🔧 장착된 아이템 데이터:', equipped);
    } catch (error) {
      console.error('Failed to fetch equipped items:', error);
      // 에러 발생 시 빈 객체로 설정하여 UI가 깨지지 않도록 함
      setEquippedItems({});
    }
  };

  // 아이템 ID로 아이템 정보 찾기
  const getItemById = (itemId: number) => {
    return itemsData.find(item => item.id === itemId);
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
      const equippedIds = Object.values(equippedItems)
        .map(item => item?.itemId)
        .filter(id => id !== undefined && id !== null);

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

      // API 데이터를 사용해서 장착 상태 업데이트
      filtered = filtered.map(item => ({
        ...item,
        equipped: equippedIds.includes(item.id)
      }));

      setFilteredItems(filtered);
    };

    filterItemsByCategory();
  }, [selectedCategory, itemsData, inventoryData, equippedItems]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotificationModal(true);
  };

  const handleEquip = async (item: any) => {
    try {
      console.log('⚙️ 장착 시작:', item);
      const response = await inventoryService.equipItem(testWalletAddress, item.id);
      
      if (response.success) {
        showNotification(`✅ ${item.name}이(가) 장착되었습니다!`, 'success');
        // 인벤토리와 장착 상태 다시 로드
        await fetchInventoryData();
        await fetchEquippedItems();
      }
    } catch (error) {
      console.error('장착 실패:', error);
      showNotification('장착에 실패했습니다.', 'error');
    }
  };

  const handleUnequip = async (item: any) => {
    try {
      console.log('🔓 해제 시작:', item);
      const response = await inventoryService.unequipItem(testWalletAddress, item.id);
      
      if (response.success) {
        showNotification(`🔓 ${item.name}이(가) 해제되었습니다!`, 'success');
        // 인벤토리와 장착 상태 다시 로드
        await fetchInventoryData();
        await fetchEquippedItems();
      }
    } catch (error) {
      console.error('해제 실패:', error);
      showNotification('해제에 실패했습니다.', 'error');
    }
  };

  const handleSell = (item: any) => {
    setSelectedItem(item);
    setShowSellModal(true);
  };

  const confirmSell = async (price: string) => {
    if (selectedItem && price) {
      try {
        console.log('판매:', selectedItem, '가격:', price);
        
        // API 호출하여 아이템을 인벤토리에서 제거
        const response = await inventoryService.sellItem(
          testWalletAddress, 
          selectedItem.id, 
          parseFloat(price)
        );
        
        if (response.success) {
          showNotification(`${selectedItem.name}을(를) ${price} USDT에 판매 등록했습니다!`, 'success');
          
          // 인벤토리 새로고침
          await fetchInventoryData();
          await fetchEquippedItems();
        }
      } catch (error) {
        console.error('판매 실패:', error);
        showNotification('판매에 실패했습니다.', 'error');
      } finally {
        setShowSellModal(false);
        setSelectedItem(null);
      }
    }
  };

  const categories = [
    { id: 'engine', name: '엔진', icon: '⚙️' },
    { id: 'material', name: '우주선소재', icon: '🛡️' },
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
            // API 응답 구조에 맞게 매핑
            const categoryMapping = {
              engine: 'engine',
              material: 'material',
              special: 'specialEquipment',
              fuel: 'fuelTank'
            };
            
            const equippedItem = equippedItems[categoryMapping[category.id]];
            const itemInfo = (equippedItem && equippedItem.itemId !== undefined && equippedItem.itemId !== null) ? getItemById(equippedItem.itemId) : null;

            return (
              <div 
                key={category.id} 
                className={`p-3 rounded-xl border-2 border-gray-600 bg-gray-800/20 ${
                  itemInfo ? 'cursor-pointer hover:bg-gray-700/30 transition-colors' : ''
                }`}
                onClick={itemInfo ? () => handleUnequip(itemInfo) : undefined}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{category.icon}</div>
                  {itemInfo ? (
                    <>
                      <div className="text-sm font-medium text-green-400">{itemInfo.name}</div>
                      <div className="text-xs text-blue-300">스코어 +{itemInfo.score}</div>
                      <div className="text-xs text-red-300 mt-1">클릭하여 해제</div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500">미장착</div>
                  )}
                </div>
              </div>
            );
          })}
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
                      <div className={`text-xs ${item.equipped ? 'text-green-400' : 'text-blue-400'}`}>
                        {item.equipped ? '✅ 장착됨' : '미장착'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => item.equipped ? handleUnequip(item) : handleEquip(item)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        item.equipped 
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {item.equipped ? '🔓 해제' : '⚡ 장착'}
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

      {/* 판매 모달 */}
      <SellItemModal
        item={selectedItem}
        isOpen={showSellModal}
        onClose={() => {
          setShowSellModal(false);
          setSelectedItem(null);
        }}
        onSell={confirmSell}
      />

      {/* 알림 모달 */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 border border-slate-600">
            <div className="text-center">
              <div className={`text-4xl mb-4 ${notificationType === 'success' ? '✅' : '❌'}`}>
                {notificationType === 'success' ? '✅' : '❌'}
              </div>
              <h3 className={`text-lg font-bold mb-4 ${
                notificationType === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {notificationType === 'success' ? '알림' : '오류'}
              </h3>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                {notificationMessage}
              </p>
              <button
                onClick={() => setShowNotificationModal(false)}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  notificationType === 'success' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
