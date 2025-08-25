'use client';

import { useEffect, useState } from 'react';

export default function FloatingAstronaut() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth - 0.5) * 20, // -10 to 10
        y: (event.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-1">
      {/* 우주인 */}
      <div
        className="absolute text-6xl transition-transform duration-300 ease-out"
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translateX(${mousePosition.x}px) translateY(${mousePosition.y}px)`,
          animation: 'float-astronaut 8s ease-in-out infinite',
          filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
          zIndex: -1
        }}
      >
        👨‍🚀
      </div>

      {/* 우주인 주변의 떠다니는 도구들 */}
      <div
        className="absolute text-2xl"
        style={{
          top: 'calc(50% - 80px)',
          left: 'calc(50% + 60px)',
          transform: `translateX(${mousePosition.x * 0.5}px) translateY(${mousePosition.y * 0.5}px)`,
          animation: 'orbit-tool 6s linear infinite',
          zIndex: -1
        }}
      >
        🔧
      </div>

      <div
        className="absolute text-2xl"
        style={{
          top: 'calc(50% + 60px)',
          left: 'calc(50% - 70px)',
          transform: `translateX(${mousePosition.x * 0.3}px) translateY(${mousePosition.y * 0.3}px)`,
          animation: 'orbit-tool 8s linear infinite reverse',
          zIndex: -1
        }}
      >
        📡
      </div>

      <div
        className="absolute text-xl"
        style={{
          top: 'calc(50% - 50px)',
          left: 'calc(50% - 90px)',
          transform: `translateX(${mousePosition.x * 0.4}px) translateY(${mousePosition.y * 0.4}px)`,
          animation: 'orbit-tool 10s linear infinite',
          zIndex: -1
        }}
      >
        🛰️
      </div>

      {/* 우주 정거장 (멀리) */}
      <div
        className="absolute text-4xl opacity-60"
        style={{
          top: '20%',
          right: '10%',
          transform: `translateX(${mousePosition.x * 0.1}px) translateY(${mousePosition.y * 0.1}px)`,
          animation: 'pulse-station 4s ease-in-out infinite',
          zIndex: -2
        }}
      >
        🛰️
      </div>

      <style jsx>{`
        @keyframes float-astronaut {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          25% {
            transform: translate(-50%, -50%) translateY(-15px) rotate(-2deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px) rotate(0deg);
          }
          75% {
            transform: translate(-50%, -50%) translateY(-20px) rotate(2deg);
          }
        }

        @keyframes orbit-tool {
          0% {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(50px) rotate(-360deg);
          }
        }

        @keyframes pulse-station {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}