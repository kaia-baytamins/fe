'use client';

import { useEffect, useRef } from 'react';
import { useCosmicAnimation } from './useCosmicAnimation';

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { particles, planets, mousePosition } = useCosmicAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 은하수 그라데이션 배경
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(139, 69, 19, 0.1)');
      gradient.addColorStop(0.3, 'rgba(75, 0, 130, 0.15)');
      gradient.addColorStop(0.7, 'rgba(25, 25, 112, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 파티클 (우주 먼지) 그리기
      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 행성들 그리기
      planets.forEach(planet => {
        ctx.save();
        ctx.translate(planet.x, planet.y);
        ctx.rotate(planet.rotation);
        
        // 행성 본체
        const planetGradient = ctx.createRadialGradient(-planet.size/4, -planet.size/4, 0, 0, 0, planet.size);
        planetGradient.addColorStop(0, planet.color);
        planetGradient.addColorStop(0.7, planet.secondaryColor);
        planetGradient.addColorStop(1, planet.shadowColor);
        
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
        ctx.fill();

        // 행성 고리 (토성 스타일)
        if (planet.hasRing) {
          ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 0, planet.size * 1.5, planet.size * 0.3, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [particles, planets]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'transparent' }}
      />
      
      {/* 떠다니는 이모지 요소들 */}
      <div className="fixed inset-0 pointer-events-none z-1">
        {/* 달 */}
        <div 
          className="absolute text-4xl animate-float-slow"
          style={{
            top: '15%',
            right: '20%',
            animationDelay: '0s',
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
          }}
        >
          🌙
        </div>
        
        {/* 작은 별들 */}
        <div 
          className="absolute text-2xl animate-twinkle"
          style={{
            top: '25%',
            left: '15%',
            animationDelay: '1s'
          }}
        >
          ⭐
        </div>
        
        <div 
          className="absolute text-xl animate-twinkle"
          style={{
            top: '60%',
            right: '30%',
            animationDelay: '2.5s'
          }}
        >
          ✨
        </div>
        
        <div 
          className="absolute text-lg animate-twinkle"
          style={{
            bottom: '30%',
            left: '25%',
            animationDelay: '4s'
          }}
        >
          💫
        </div>
        
        {/* 은하 */}
        <div 
          className="absolute text-3xl animate-spin-slow"
          style={{
            bottom: '20%',
            right: '15%',
            animationDelay: '1.5s',
            filter: 'drop-shadow(0 0 15px rgba(138, 43, 226, 0.4))'
          }}
        >
          🌌
        </div>
        
        {/* 우주선 */}
        <div 
          className="absolute text-2xl animate-float"
          style={{
            top: '70%',
            left: '10%',
            animationDelay: '3s',
            transform: `translateX(${mousePosition.x * 0.02}px) translateY(${mousePosition.y * 0.02}px)`
          }}
        >
          🛸
        </div>
        
        {/* 혜성 */}
        <div 
          className="absolute text-2xl animate-comet"
          style={{
            top: '40%',
            left: '-10%',
            animationDelay: '6s'
          }}
        >
          ☄️
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-15px) translateX(0px); }
          75% { transform: translateY(-5px) translateX(-5px); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes comet {
          0% { transform: translateX(-100px) translateY(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-50px); opacity: 0; }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-comet {
          animation: comet 12s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}