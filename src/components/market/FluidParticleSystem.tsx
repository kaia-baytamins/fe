'use client';

import { useEffect, useRef, useState } from 'react';

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
  connected: boolean;
}

export default function FluidParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const [isMouseInside, setIsMouseInside] = useState(false);

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
      const particleCount = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 8000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`, // 파랑-보라 계열
          opacity: Math.random() * 0.8 + 0.2,
          life: 0,
          maxLife: Math.random() * 300 + 100,
          connected: false
        });
      }
      particlesRef.current = particles;
    };

    const updateParticles = () => {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((particle, index) => {
        // 마우스 인력 효과
        if (isMouseInside) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.vx += (dx / distance) * force * 0.02;
            particle.vy += (dy / distance) * force * 0.02;
          }
        }

        // 중력과 마찰
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        
        // 위치 업데이트
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 경계 처리 (부드러운 반사)
        if (particle.x < 0) {
          particle.x = 0;
          particle.vx *= -0.8;
        }
        if (particle.x > canvas.width) {
          particle.x = canvas.width;
          particle.vx *= -0.8;
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.vy *= -0.8;
        }
        if (particle.y > canvas.height) {
          particle.y = canvas.height;
          particle.vy *= -0.8;
        }

        // 생명주기
        particle.life++;
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * 2;
          particle.vy = (Math.random() - 0.5) * 2;
        }

        // 투명도 변화
        const lifeCycle = particle.life / particle.maxLife;
        particle.opacity = Math.sin(lifeCycle * Math.PI) * 0.8 + 0.2;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;

      // 연결선 그리기
      ctx.lineWidth = 0.5;
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.3;
            ctx.strokeStyle = `rgba(138, 43, 226, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      // 파티클 그리기
      particles.forEach(particle => {
        ctx.save();
        
        // 글로우 효과
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 3;
        
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

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    };

    const handleMouseEnter = () => setIsMouseInside(true);
    const handleMouseLeave = () => setIsMouseInside(false);

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMouseInside]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen' 
      }}
    />
  );
}