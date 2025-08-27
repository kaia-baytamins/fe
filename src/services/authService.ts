import { API_CONFIG, handleApiError } from './config';

interface SimpleLoginRequest {
  userId: string;
  displayName?: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface SimpleLoginResponse {
  user: {
    id: string;
    lineUserId: string;
    username: string;
    avatar?: string;
    level: number;
    experience: number;
  };
  isNewUser: boolean;
}

interface RegisterPetRequest {
  lineUserId: string;
  petType: string;
}

interface RegisterPetResponse {
  pet: {
    id: string;
    name: string;
    type: string;
    createdAt: string;
  };
}

class AuthService {
  private readonly USER_KEY = 'authUser';
  private readonly LINE_USER_ID_KEY = 'lineUserId';

  /**
   * Simplified login with LINE profile data
   */
  async simpleLogin(profile: any): Promise<SimpleLoginResponse> {
    const request: SimpleLoginRequest = {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIMPLE_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    await handleApiError(response);
    const data = await response.json();

    // Store user data and LINE user ID
    this.setUser(data.user);
    this.setLineUserId(data.user.lineUserId);

    return data;
  }

  /**
   * Register a pet for the user
   */
  async registerPet(petType: string): Promise<RegisterPetResponse> {
    const lineUserId = this.getLineUserId();
    if (!lineUserId) {
      throw new Error('User not authenticated');
    }

    const request: RegisterPetRequest = {
      lineUserId,
      petType,
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PET_REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    await handleApiError(response);
    const data = await response.json();

    // Store pet data
    this.setUserPet(data.pet);

    return data;
  }

  /**
   * Store pet data in localStorage
   */
  setUserPet(pet: RegisterPetResponse['pet']) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPet', JSON.stringify(pet));
      console.log('Pet registered successfully:', pet);
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.LINE_USER_ID_KEY);
    }
  }

  /**
   * Get stored LINE user ID
   */
  getLineUserId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.LINE_USER_ID_KEY);
    }
    return null;
  }

  /**
   * Set LINE user ID
   */
  setLineUserId(lineUserId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.LINE_USER_ID_KEY, lineUserId);
    }
  }

  /**
   * Get stored user data
   */
  getUser(): SimpleLoginResponse['user'] | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Set user data
   */
  setUser(user: SimpleLoginResponse['user']): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getLineUserId() && !!this.getUser();
  }

  /**
   * Get user's LINE user ID
   */
  getUserId(): string | null {
    return this.getLineUserId();
  }

  /**
   * Create auth headers for API requests
   */
  getAuthHeaders(): Record<string, string> {
    const lineUserId = this.getLineUserId();
    if (!lineUserId) {
      throw new Error('User not authenticated');
    }

    return {
      'Content-Type': 'application/json',
      'x-line-user-id': lineUserId,
    };
  }
}

export const authService = new AuthService();
export default authService;
