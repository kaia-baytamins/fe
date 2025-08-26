import { API_CONFIG, getAuthHeaders, handleApiError } from './config';

interface UpdateWalletAddressResponse {
  success: boolean;
  message: string;
  walletAddress: string;
}

class UserService {
  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    await handleApiError(response);
    return response.json();
  }

  /**
   * Update user's wallet address
   */
  async updateWalletAddress(walletAddress: string): Promise<UpdateWalletAddressResponse> {
    return this.fetchApi<UpdateWalletAddressResponse>(API_CONFIG.ENDPOINTS.USER_UPDATE_WALLET, {
      method: 'PUT',
      body: JSON.stringify({ walletAddress }),
    });
  }
}

export const userService = new UserService();
export default userService;