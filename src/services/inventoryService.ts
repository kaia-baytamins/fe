import { API_CONFIG, handleApiError, getAuthHeaders } from './config';

export interface InventoryResponse {
  inventory: {
    [itemId: string]: number; // itemId를 키로, quantity를 값으로 하는 객체
  }
}

class InventoryService {
  /**
   * 지갑 주소로 인벤토리 조회
   */
  async getInventoryByWallet(walletAddress: string): Promise<InventoryResponse> {
    const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY_WALLET}/${walletAddress}`;
    
    console.log('📦 Inventory API call:', { url: apiUrl, walletAddress });

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📦 Inventory response status:', response.status, response.statusText);

    await handleApiError(response);
    const data = await response.json();

    console.log('📦 Inventory data received:', data);
    return data;
  }

  /**
   * 특정 아이템 보유 여부 확인
   */
  hasItem(inventoryResponse: InventoryResponse, itemId: string): boolean {
    return !!(inventoryResponse.inventory[itemId] && inventoryResponse.inventory[itemId] > 0);
  }

  /**
   * 특정 아이템 개수 확인
   */
  getItemQuantity(inventoryResponse: InventoryResponse, itemId: string): number {
    return inventoryResponse.inventory[itemId] || 0;
  }

  /**
   * 아이템 장착
   */
  async equipItem(walletAddress: string, itemId: number): Promise<any> {
    const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY_EQUIP}`;
    
    const requestBody = {
      walletAddress,
      itemId
    };
    
    console.log('⚙️ Equip API call:', { url: apiUrl, requestBody });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('⚙️ Equip response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('⚙️ Equip API error:', errorText);
      throw new Error(`장착 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('⚙️ Equip data received:', data);
    return data;
  }

  /**
   * 아이템 해제
   */
  async unequipItem(walletAddress: string, itemId: number): Promise<any> {
    const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY_UNEQUIP}`;
    
    const requestBody = {
      walletAddress,
      itemId
    };
    
    console.log('🔓 Unequip API call:', { url: apiUrl, requestBody });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('🔓 Unequip response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔓 Unequip API error:', errorText);
      throw new Error(`해제 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('🔓 Unequip data received:', data);
    return data;
  }

  /**
   * 장착된 아이템 조회
   */
  async getEquippedItems(walletAddress: string): Promise<any> {
    const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY_EQUIPPED}/${walletAddress}`;
    
    console.log('🔧 Equipped items API call:', { url: apiUrl });

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔧 Equipped items response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔧 Equipped items API error:', errorText);
      throw new Error(`장착 아이템 조회 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('🔧 Equipped items data received:', data);
    return data;
  }

  /**
   * 아이템 판매
   */
  async sellItem(walletAddress: string, itemId: number, price: number): Promise<any> {
    const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVENTORY_SELL}`;
    
    const requestBody = {
      walletAddress,
      itemId,
      price
    };
    
    console.log('💰 Sell API call:', { url: apiUrl, requestBody });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('💰 Sell response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('💰 Sell API error:', errorText);
      throw new Error(`판매 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('💰 Sell data received:', data);
    return data;
  }

  /**
   * 인벤토리 데이터를 배열로 변환
   */
  getInventoryItemsArray(inventoryResponse: InventoryResponse): {itemId: string, quantity: number}[] {
    return Object.entries(inventoryResponse.inventory).map(([itemId, quantity]) => ({
      itemId,
      quantity
    }));
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;