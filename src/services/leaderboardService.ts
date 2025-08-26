import { API_CONFIG, handleApiError } from './config';

export interface LeaderboardRankingEntry {
  rank: number;
  username: string;
  score: number;
}

export interface LeaderboardRankingsResponse {
  totalExplorations: LeaderboardRankingEntry[];
  successfulExplorations: LeaderboardRankingEntry[];
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
   * 랭킹 데이터 조회 (인증 불필요)
   */
  async getRankings(): Promise<LeaderboardRankingsResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LEADERBOARD}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    await handleApiError(response);
    const data = await response.json();
    
    console.log('📊 Rankings data:', data);
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