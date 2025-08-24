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
  
  return {
    inviteFriends,      // 친구 초대 함수
    isLoadingFriends    // 로딩 상태
  };
};