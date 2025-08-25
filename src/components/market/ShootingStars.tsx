'use client';

import { useEffect, useState } from 'react';

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  duration: number;
  delay: number;
}

export default function ShootingStars() {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    const createShootingStar = () => {
      const star: ShootingStar = {
        id: Date.now() + Math.random(),
        startX: Math.random() * window.innerWidth,
        startY: Math.random() * (window.innerHeight * 0.3), // 화면 상단 1/3에서만 시작
        angle: Math.random() * 45 + 15, // 15-60도 각도
        duration: Math.random() * 1.5 + 1, // 1-2.5초 지속
        delay: 0
      };

      setShootingStars(prev => [...prev, star]);

      // 애니메이션이 끝나면 별 제거
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== star.id));
      }, star.duration * 1000 + 500);
    };

    // 3-8초마다 랜덤하게 유성 생성
    const interval = setInterval(() => {
      if (Math.random() < 0.7) { // 70% 확률로 생성
        createShootingStar();
      }
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-1">
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${star.startX}px`,
            top: `${star.startY}px`,
            animation: `shooting-star ${star.duration}s ease-out forwards`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4)',
            transform: `rotate(${star.angle}deg)`
          }}
        >
          {/* 유성 꼬리 효과 */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-white to-transparent rounded-full"
            style={{
              width: '60px',
              height: '2px',
              top: '50%',
              left: '100%',
              transform: 'translateY(-50%)',
              opacity: 0.6
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes shooting-star {
          0% {
            transform: translateX(0) translateY(0) rotate(${45}deg) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            scale: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(150px) rotate(${45}deg) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}