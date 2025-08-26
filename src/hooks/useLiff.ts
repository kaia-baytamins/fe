'use client';

import { useState, useEffect } from 'react';

export const useLiff = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [liffInitialized, setLiffInitialized] = useState(true);

  useEffect(() => {
    const initializeLiff = async () => {
      if (typeof window !== 'undefined') {
        try {
          const liffModule = await import('@line/liff');
          const liff = liffModule.default;

          await liff.init({
            liffId: '2007977169-WBZPyzZj',
          });

          console.log('LIFF 초기화 완료!');
          
        

          if (!liff.isLoggedIn()) {
            console.log('로그인 필요');
            liff.login();
          } else {
            //   //IdToken 출력 (디버깅용)
            //   const idToken = liff.getIDToken();
            //   console.log(idToken); // print idToken object

            //Decode된 ID Token 출력 (디버깅용)
            const idToken2 = liff.getDecodedIDToken();
            console.log(idToken2); // print decoded idToken object
            console.log('sub: ',idToken2.sub); // print userId
            
            console.log('로그인 상태 확인 완료');
            const token = liff.getAccessToken();
            setAccessToken(token);
            console.log('Access Token:', token);
            
            const userProfile = await liff.getProfile();
            setProfile(userProfile);
            console.log('User Profile:', userProfile);
          }
        } catch (error) {
          console.error('LIFF 초기화 실패:', error);
        } finally {
          setLiffInitialized(false);
        }
      }
    };

    initializeLiff();
  }, []);


  return { accessToken, profile, liffInitialized };
};