'use client';

import { useState, useEffect } from 'react';

export default function SpecialEvent() {
  const [timeLeft, setTimeLeft] = useState(15 * 3600 + 23 * 60 + 47); // 15:23:47

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-gradient-to-r from-purple-600/5 to-blue-600/5 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-purple-500/20">
      {/* 반짝이는 이모지들 */}
      <div className="absolute top-2 left-4 animate-pulse">✨</div>
      <div className="absolute top-4 right-5 animate-bounce">⭐</div>
      <div className="absolute bottom-3 right-3 animate-pulse">✨</div>
      
      <div className="text-center">
        <div className="text-yellow-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
          🌟 DeFi 부스트 이벤트!
        </div>
        <div className="text-white mb-2">
          모든 DeFi 퀘스트 보상 2배! + 추가 수익률 증가!
        </div>
        <div className="text-orange-400 font-semibold">
          ⏰ {timeLeft > 0 ? `${formatTime(timeLeft)} 남음` : '이벤트 종료'}
        </div>
      </div>
    </div>
  );
}