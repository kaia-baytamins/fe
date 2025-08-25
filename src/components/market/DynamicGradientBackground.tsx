'use client';

import { useEffect, useState } from 'react';

export default function DynamicGradientBackground() {
  const [gradientPhase, setGradientPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPhase(prev => (prev + 0.5) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getGradientStyle = () => {
    const hue1 = (gradientPhase + 240) % 360; // 파랑 계열
    const hue2 = (gradientPhase + 280) % 360; // 보라 계열
    const hue3 = (gradientPhase + 320) % 360; // 자주 계열

    return {
      background: `
        radial-gradient(ellipse at 20% 50%, hsla(${hue1}, 70%, 30%, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, hsla(${hue2}, 80%, 25%, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 80%, hsla(${hue3}, 60%, 35%, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, 
          rgba(15, 23, 42, 0.95) 0%,
          rgba(30, 41, 59, 0.9) 25%,
          rgba(51, 65, 85, 0.8) 50%,
          rgba(30, 41, 59, 0.9) 75%,
          rgba(15, 23, 42, 0.95) 100%
        )
      `,
      animation: `gradient-shift 20s ease-in-out infinite`,
    };
  };

  return (
    <>
      <div
        className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out"
        style={getGradientStyle()}
      />
      
      {/* 추가 글로우 레이어 */}
      <div className="fixed inset-0 z-0 opacity-60">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-5000"
          style={{
            background: `radial-gradient(circle, hsla(${(gradientPhase + 260) % 360}, 70%, 50%, 0.1) 0%, transparent 70%)`,
            transform: `translate(${Math.sin(gradientPhase * 0.02) * 100}px, ${Math.cos(gradientPhase * 0.015) * 80}px) scale(${1 + Math.sin(gradientPhase * 0.01) * 0.2})`
          }}
        />
        
        <div 
          className="absolute top-2/3 right-1/4 w-80 h-80 rounded-full blur-3xl transition-all duration-4000"
          style={{
            background: `radial-gradient(circle, hsla(${(gradientPhase + 300) % 360}, 80%, 40%, 0.12) 0%, transparent 70%)`,
            transform: `translate(${Math.cos(gradientPhase * 0.018) * 120}px, ${Math.sin(gradientPhase * 0.012) * 90}px) scale(${1 + Math.cos(gradientPhase * 0.008) * 0.3})`
          }}
        />

        <div 
          className="absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full blur-3xl transition-all duration-6000"
          style={{
            background: `radial-gradient(circle, hsla(${(gradientPhase + 340) % 360}, 60%, 45%, 0.08) 0%, transparent 70%)`,
            transform: `translate(${Math.sin(gradientPhase * 0.025) * 80}px, ${Math.cos(gradientPhase * 0.02) * 60}px) scale(${1 + Math.sin(gradientPhase * 0.015) * 0.25})`
          }}
        />
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            filter: hue-rotate(0deg) brightness(1);
          }
          25% {
            filter: hue-rotate(15deg) brightness(1.1);
          }
          50% {
            filter: hue-rotate(30deg) brightness(0.9);
          }
          75% {
            filter: hue-rotate(15deg) brightness(1.05);
          }
        }
      `}</style>
    </>
  );
}