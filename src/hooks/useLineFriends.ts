'use client';

import { useState } from 'react';

export const useLineFriends = (accessToken: string | null) => {
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  // 친구 초대하기 (공유 기능 사용)
  const inviteFriends = async () => {
    setIsLoadingFriends(true); // 로딩 상태 표시
    try {
      if (typeof window !== 'undefined') {
        const liffModule = await import('@line/liff');
        const liff = liffModule.default;
  
        // Share Target Picker 실행
        const res = await liff.shareTargetPicker([
          {
            type: 'text',
            text: '🚀 우주 탐험 게임에 함께 참여해요! 멋진 NFT도 수집하고 랭킹도 올려봐요! 지금 바로 시작하기: [https://61ef4b766415.ngrok-free.app]' //여기 초대 식별자 넣어야함!!! 백이랑 소통하자. 예시 : (https://61ef4b766415.ngrok-free.app/invite?friendId=12345)
          },
        ], {
          isMultiple: true // 여러 친구에게 동시 전송 가능
        });
  
        // 성공 여부 확인
        if (res) {
          console.log(`[${res.status}] 메시지 전송 성공!`);
          return { success: true, status: res.status };
        } else {
          console.log('사용자가 공유를 취소했습니다.');
          return { success: false, message: '공유가 취소되었습니다.' };
        }
      }
    } catch (error) {
      console.error('친구 초대 실패:', error);
      if (error.message?.includes('TargetPicker was closed')) {
        console.log('사용자가 공유를 취소했습니다.');
        return { success: false, message: '공유가 취소되었습니다.' };
      } else {
        console.log('예상치 못한 에러 발생:', error.message);
        return { success: false, message: '초대 중 오류가 발생했습니다.' };
      }
    } finally {
      setIsLoadingFriends(false); // 로딩 상태 종료
    }
  };

  // NFT 자랑하기 (행성명, 유저명, NFT 정보를 파라미터로 받음)
  const shareNFTToFriends = async (
    planetName: string, 
    userName: string,
    nftImage?: string,
    nftStory?: string,
    nftRarity?: string
  ) => {
    setIsLoadingFriends(true); // 로딩 상태 표시
    try {
      if (typeof window !== 'undefined') {
        const liffModule = await import('@line/liff');
        const liff = liffModule.default;

        // 행성별 이모지 매핑
        const planetEmojis = {
          '달': '🌙',
          '화성': '🔴', 
          '타이탄': '🌊',
          '유로파': '💧',
          '토성': '🌀'
        };

        const emoji = planetEmojis[planetName] || '🚀';
        
        // 메시지 배열 구성 (이미지 + 텍스트)
        const messages: any[] = [];
        
        // 이미지 메시지 추가 (이미지가 있을 경우 - 이제 외부 URL 사용)
        if (nftImage) {
          console.log('NFT 이미지 URL:', nftImage); // 디버깅용
          
          messages.push({
            type: 'image',
            originalContentUrl: nftImage, // 이미 완전한 외부 URL
            previewImageUrl: nftImage // 이미 완전한 외부 URL
          });
        }
        
        // 텍스트 메시지 구성
        let textMessage = `${emoji} 탐험가 ${userName}님이 ${planetName} 탐험을 완수했어요!\n\n`;
        textMessage += `🎭 호시타누의 우주 이야기\n\n`;
        
        if (nftStory) {
          // 스토리를 문단별로 나누어 가독성 향상
          const storyLines = nftStory.split('. ').join('.\n\n');
          textMessage += `${storyLines}\n\n`;
        }
        
        if (nftRarity) {
          textMessage += `\n희귀도: ${nftRarity}\n\n`;
        }
        
        textMessage += `🚀 우주 탐험에 도전해볼 준비 됐나요?\n\n`;
        textMessage += `지금 바로 탐험을 시작하세요! 👇\n`;
        textMessage += `https://61ef4b766415.ngrok-free.app`;
        
        messages.push({
          type: 'text',
          text: textMessage
        });

        // Share Target Picker 실행
        const res = await liff.shareTargetPicker(messages, {
          isMultiple: true // 여러 친구에게 동시 전송 가능
        });

        // 성공 여부 확인
        if (res) {
          console.log(`[${res.status}] NFT 자랑 메시지 전송 성공!`);
          return { success: true, status: res.status };
        } else {
          console.log('사용자가 NFT 자랑을 취소했습니다.');
          return { success: false, message: '자랑하기가 취소되었습니다.' };
        }
      }
    } catch (error) {
      console.error('NFT 자랑 실패:', error);
      if (error.message?.includes('TargetPicker was closed')) {
        console.log('사용자가 NFT 자랑을 취소했습니다.');
        return { success: false, message: '자랑하기가 취소되었습니다.' };
      } else {
        console.log('예상치 못한 에러 발생:', error.message);
        return { success: false, message: '자랑하기 중 오류가 발생했습니다.' };
      }
    } finally {
      setIsLoadingFriends(false); // 로딩 상태 종료
    }
  };
  
  return {
    inviteFriends,        // 친구 초대 함수
    shareNFTToFriends,    // NFT 자랑하기 함수
    isLoadingFriends      // 로딩 상태
  };
};