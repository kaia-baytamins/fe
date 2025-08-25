'use client';

import { useEffect, useRef } from 'react';

interface EnhancedUIProps {
  children: React.ReactNode;
}

export default function EnhancedUI({ children }: EnhancedUIProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 마우스 이동에 따른 3D 틸트 효과
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (event.clientX - centerX) / (rect.width / 2);
      const deltaY = (event.clientY - centerY) / (rect.height / 2);
      
      const rotateX = deltaY * -5; // 위아래 움직임
      const rotateY = deltaX * 5;  // 좌우 움직임
      
      container.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateZ(0)
      `;
    };

    const handleMouseLeave = () => {
      container.style.transform = `
        perspective(1000px) 
        rotateX(0deg) 
        rotateY(0deg) 
        translateZ(0)
      `;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative transition-transform duration-300 ease-out"
      style={{ 
        transformStyle: 'preserve-3d',
        willChange: 'transform' 
      }}
    >
      {/* 글래스모피즘 레이어 */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl pointer-events-none" />
      
      {/* 네온 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-50 pointer-events-none animate-pulse" />
      
      {/* 컨텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* 홀로그래픽 오버레이 */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-20"
        style={{
          background: `
            linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, rgba(138,43,226,0.1) 50%, transparent 70%)
          `,
          animation: 'hologram 3s ease-in-out infinite alternate'
        }}
      />

      <style jsx>{`
        @keyframes hologram {
          0% {
            opacity: 0.1;
            transform: translateX(-2px);
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.2;
            transform: translateX(2px);
          }
        }
      `}</style>
    </div>
  );
}