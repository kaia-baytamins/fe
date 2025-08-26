import { API_CONFIG, handleApiError } from './config';

export type LeaderboardType = 
  | 'total_explorations' 
  | 'successful_explorations' 
  | 'total_staked' 
  | 'level' 
  | 'experience';

export type LeaderboardPeriod = 'all_time' | 'weekly' | 'monthly' | 'daily';

export interface LeaderboardUser {
  id: string;
  username: string;
  walletAddress: string;
  level: number;
}

export interface LeaderboardMetadata {
  petName?: string;
  petType?: 'momoco' | 'panlulu' | 'hoshitanu' | 'mizuru';
  spaceshipName?: string;
}

export interface LeaderboardEntry {
  rank: number;
  score: number;
  previousRank?: number;
  rankChange?: number;
  user: LeaderboardUser;
  metadata?: LeaderboardMetadata;
}

export interface LeaderboardParams {
  type?: LeaderboardType;
  period?: LeaderboardPeriod;
  limit?: number;
}

export interface TopPerformer {
  user: {
    username: string;
    totalExplorations?: number;
    totalStaked?: number;
    totalPower?: number;
  };
  pet?: {
    petName: string;
    petType: string;
  };
  metadata?: LeaderboardMetadata;
}

export interface TopPerformersResponse {
  topExplorer: TopPerformer;
  topStaker: TopPerformer;
  topPower: TopPerformer;
}

class LeaderboardService {
  /**
   * 전체 리더보드 조회 (인증 불필요)
   */
  async getLeaderboard(params: LeaderboardParams = {}): Promise<LeaderboardEntry[]> {
    const { 
      type = 'total_explorations', 
      period = 'all_time', 
      limit = 100 
    } = params;

    const queryParams = new URLSearchParams({
      type,
      period,
      limit: limit.toString()
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LEADERBOARD}?${queryParams}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    await handleApiError(response);
    const data = await response.json();
    
    console.log('📊 Leaderboard data:', data);
    return data;
  }

  /**
   * 톱 플레이어 요약 조회 (인증 불필요)
   */
  async getTopPerformers(): Promise<TopPerformersResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LEADERBOARD_TOP_PERFORMERS}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    await handleApiError(response);
    const data = await response.json();
    
    console.log('🏆 Top performers data:', data);
    return data;
  }

  /**
   * 펫 타입별 이미지 경로 반환
   */
  getPetImage(petType: string): string {
    const petImages = {
      momoco: '/images/Momoco.png',
      panlulu: '/images/Panlulu.png',
      hoshitanu: '/images/hoshitanu.png',
      mizuru: '/images/Mizuru.png',
    };
    
    return petImages[petType as keyof typeof petImages] || '/images/Momoco.png';
  }

  /**
   * 랭킹 변화 아이콘 반환
   */
  getRankChangeIcon(rankChange?: number): string {
    if (!rankChange) return '';
    if (rankChange > 0) return '📈';
    if (rankChange < 0) return '📉';
    return '➡️';
  }

  /**
   * 스코어 포맷팅 (숫자에 콤마 추가)
   */
  formatScore(score: number): string {
    return new Intl.NumberFormat('ko-KR').format(score);
  }
}

export const leaderboardService = new LeaderboardService();
export default leaderboardService;