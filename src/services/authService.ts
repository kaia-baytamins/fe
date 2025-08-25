import { API_CONFIG, getAuthHeaders, handleApiError } from './config';

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

    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/simple-login`, {
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