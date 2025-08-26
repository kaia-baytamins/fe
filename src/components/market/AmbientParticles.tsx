'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      const particles: Particle[] = [];
      // 파티클 수를 줄여서 부담 감소
      const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 12000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, // 속도 줄임
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          color: Math.random() > 0.7 ? '#8b5cf6' : '#3b82f6', // 보라/파랑
          opacity: Math.random() * 0.6 + 0.2,
          life: 0,
          maxLife: Math.random() * 500 + 200 // 생명주기 늘림
        });
      }
      particlesRef.current = particles;
    };

    const updateParticles = () => {
      particlesRef.current.forEach(particle => {
        // 부드러운 움직임
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // 경계 처리 (반대편에서 나타나기)
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // 생명주기에 따른 투명도 변화
        const lifeCycle = particle.life / particle.maxLife;
        particle.opacity = Math.sin(lifeCycle * Math.PI) * 0.6 + 0.1;

        // 재생성
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        ctx.save();
        
        // 부드러운 글로우 효과
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 4;
        
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        opacity: 0.6 
      }}
    />
  );
}