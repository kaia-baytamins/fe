import { API_CONFIG, getAuthHeaders, handleApiError } from './config';

// NFT 컨트랙트 주소 매핑
export const NFT_CONTRACT_ADDRESSES = {
  '0x0Fd693Fa212F7B42705EcFEC577c8236d45bf1A7': {
    name: '달',
    emoji: '🌙',
    image: '/images/hoshitanuNFT/moon-hoshitanu.png',
    externalImage: 'https://kaia-baytamins.github.io/planetNFT-metadata/hoshitanu/moon-hoshitanu.png',
    rarity: '기본 NFT',
    story: '처음으로 달에 발을 딛었을 때의 기분은... 와! 정말 대단했어! 지구에서 보던 것과는 완전히 달랐어. 고요한 크레이터들과 은빛 먼지가 반짝이는 모습이 너무 아름다웠어. 여기서 우주 탐험의 첫 걸음을 시작했다는 게 정말 뿌듯해!'
  },
  '0xB399AD2828D4535c0B30F73afbc50Ac96Efe4977': {
    name: '화성',
    emoji: '🔴',
    image: '/images/hoshitanuNFT/mars-hoshitanu.png',
    externalImage: 'https://kaia-baytamins.github.io/planetNFT-metadata/hoshitanu/mars-hoshitanu.png',
    rarity: '기본 NFT',
    story: '화성의 붉은 사막에서 모래폭풍을 만났을 때는 정말 무서웠어! 하지만 폭풍이 지나가고 나서 본 화성의 일몰은... 너무너무 아름다워서 눈물이 날 뻔했어. 지구와는 다른 파란색 일몰이 정말 신비로웠어!'
  },
  '0xb228cfCe3DCC0AF6b1B4b70790aD916301E6Bd1F': {
    name: '타이탄',
    emoji: '🌊',
    image: '/images/hoshitanuNFT/titan-hoshitanu.png',
    externalImage: 'https://kaia-baytamins.github.io/planetNFT-metadata/hoshitanu/titan-hoshitanu.png',
    rarity: '기본 NFT',
    story: '타이탄의 메탄 바다에서 수영(?)을 해봤어! 물론 우주복을 입고 말이야 ㅎㅎ. 오렌지색 하늘 아래 펼쳐진 액체 메탄 호수는 정말 환상적이었어. 지구의 바다와는 완전히 다른 느낌이었지만 그만큼 신기하고 재밌었어!'
  },
  '0x674ca2Ca5Cc7481ceaaead587E499398b5eDC8E1': {
    name: '유로파',
    emoji: '💧',
    image: '/images/hoshitanuNFT/europa-hoshitanu.png',
    externalImage: 'https://kaia-baytamins.github.io/planetNFT-metadata/hoshitanu/europa-hoshitanu.png',
    rarity: '기본 NFT',
    story: '유로파의 얼음 표면을 뚫고 지하 바다를 탐험했을 때... 정말 짜릿했어! 두꺼운 얼음 아래 숨겨진 거대한 바다에서 신비로운 생명체들을 발견할 수 있을 것 같은 기분이었어. 미지의 세계를 탐험하는 기분이 이런 거구나!'
  },
  '0x6C0D8F6B87dCFD9e1593a0307Bd22464c58f95F3': {
    name: '토성',
    emoji: '🌀',
    image: '/images/hoshitanuNFT/saturn-hoshitanu.png',
    externalImage: 'https://kaia-baytamins.github.io/planetNFT-metadata/hoshitanu/saturn-hoshitanu.png',
    rarity: '희귀 NFT',
    story: '토성의 고리 사이를 날아다녔을 때의 그 짜릿함! 무수한 얼음과 돌 조각들 사이를 스르륵 지나가는 기분은... 마치 우주의 롤러코스터를 타는 것 같았어! 아름답고 위험하지만 그만큼 스릴 넘치는 모험이었어!'
  }
};

export interface NFTCollectionItem {
  contractAddress: string;
  count: number;
}

export interface NFTCollectionResponse {
  totalExplorations: number;  // 총 탐험 횟수 (모든 NFT 개수 합)
  conqueredPlanets: number;    // 정복한 행성 수 (보유한 NFT 종류)
  ownedNFTs: Array<{
    contractAddress: string;
    count: number;
    planetInfo: typeof NFT_CONTRACT_ADDRESSES[keyof typeof NFT_CONTRACT_ADDRESSES];
  }>;
}

class NFTService {
  /**
   * 사용자의 NFT 컬렉션 조회
   */
  async getUserNFTCollection(walletAddress: string): Promise<NFTCollectionResponse> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/nft/collection/${walletAddress}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );
      
      await handleApiError(response);
      const nftData: NFTCollectionItem[] = await response.json();
      
      // 총 탐험 횟수 계산 (모든 NFT 개수 합)
      const totalExplorations = nftData.reduce((sum, item) => sum + item.count, 0);
      
      // 정복한 행성 수 (보유한 NFT 종류)
      const conqueredPlanets = nftData.length;
      
      // 보유한 NFT 정보 매핑
      const ownedNFTs = nftData
        .map(item => {
          const planetInfo = NFT_CONTRACT_ADDRESSES[item.contractAddress];
          if (!planetInfo) {
            console.warn(`Unknown NFT contract address: ${item.contractAddress}`);
            return null;
          }
          
          return {
            contractAddress: item.contractAddress,
            count: item.count,
            planetInfo
          };
        })
        .filter(item => item !== null);
      
      return {
        totalExplorations,
        conqueredPlanets,
        ownedNFTs
      };
    } catch (error) {
      console.error('Error fetching NFT collection:', error);
      // 에러 시 빈 데이터 반환
      return {
        totalExplorations: 0,
        conqueredPlanets: 0,
        ownedNFTs: []
      };
    }
  }
}

export const nftService = new NFTService();