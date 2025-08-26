import { API_CONFIG, handleApiError } from './config';

export interface InventoryResponse {
  [itemId: string]: number; // itemId를 키로, quantity를 값으로 하는 객체
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
    return !!(inventoryResponse[itemId] && inventoryResponse[itemId] > 0);
  }

  /**
   * 특정 아이템 개수 확인
   */
  getItemQuantity(inventoryResponse: InventoryResponse, itemId: string): number {
    return inventoryResponse[itemId] || 0;
  }

  /**
   * 인벤토리 데이터를 배열로 변환
   */
  getInventoryItemsArray(inventoryResponse: InventoryResponse): {itemId: string, quantity: number}[] {
    return Object.entries(inventoryResponse).map(([itemId, quantity]) => ({
      itemId,
      quantity
    }));
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;