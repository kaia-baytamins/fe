'use client';

import { useEffect, useRef } from 'react';

interface Meteor {
  x: number;
  y: number;
  speed: number;
  size: number;
  trail: { x: number; y: number; opacity: number }[];
  life: number;
}

interface BlackHole {
  x: number;
  y: number;
  size: number;
  rotation: number;
  intensity: number;
}

export default function StaticCosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meteorsRef = useRef<Meteor[]>([]);
  const blackHoleRef = useRef<BlackHole | null>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // 블랙홀 위치 재설정
      blackHoleRef.current = {
        x: canvas.width * 0.8,
        y: canvas.height * 0.3,
        size: 80,
        rotation: 0,
        intensity: 0.3
      };
    };

    const createMeteor = () => {
      const meteor: Meteor = {
        x: Math.random() * canvas.width * 1.2 - canvas.width * 0.1,
        y: -50,
        speed: Math.random() * 3 + 2,
        size: Math.random() * 3 + 2,
        trail: [],
        life: 0
      };
      meteorsRef.current.push(meteor);
    };

    const updateMeteors = () => {
      meteorsRef.current = meteorsRef.current.filter(meteor => {
        // 운석 위치 업데이트
        meteor.x += meteor.speed * 0.8;
        meteor.y += meteor.speed;
        meteor.life++;

        // 꼬리 효과 업데이트
        meteor.trail.unshift({ x: meteor.x, y: meteor.y, opacity: 1 });
        if (meteor.trail.length > 20) {
          meteor.trail.pop();
        }

        meteor.trail.forEach((point, index) => {
          point.opacity = (1 - index / meteor.trail.length) * 0.8;
        });

        // 화면을 벗어나면 제거
        return meteor.y < canvas.height + 100 && meteor.x < canvas.width + 100;
      });

      // 랜덤하게 새 운석 생성 (확률 낮춤)
      if (Math.random() < 0.003) {
        createMeteor();
      }
    };

    const drawMeteors = () => {
      meteorsRef.current.forEach(meteor => {
        // 꼬리 그리기
        meteor.trail.forEach((point, index) => {
          if (index < meteor.trail.length - 1) {
            const nextPoint = meteor.trail[index + 1];
            
            ctx.save();
            ctx.globalAlpha = point.opacity;
            ctx.strokeStyle = `hsl(${20 + Math.sin(timeRef.current * 0.1) * 10}, 100%, ${60 + Math.sin(timeRef.current * 0.05) * 20}%)`;
            ctx.lineWidth = meteor.size * (1 - index / meteor.trail.length);
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
            ctx.restore();
          }
        });

        // 운석 본체
        ctx.save();
        ctx.shadowColor = '#ff6b00';
        ctx.shadowBlur = meteor.size * 3;
        
        const gradient = ctx.createRadialGradient(
          meteor.x, meteor.y, 0,
          meteor.x, meteor.y, meteor.size * 2
        );
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(0.3, '#ff8800');
        gradient.addColorStop(0.7, '#ff4400');
        gradient.addColorStop(1, '#aa0000');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const drawBlackHole = () => {
      const blackHole = blackHoleRef.current;
      if (!blackHole) return;

      ctx.save();
      ctx.translate(blackHole.x, blackHole.y);
      ctx.rotate(blackHole.rotation);

      // 이벤트 호라이즌 (완전 검은색)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, blackHole.size * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // 강착 원반 (여러 링)
      for (let i = 1; i <= 5; i++) {
        const radius = blackHole.size * (0.3 + i * 0.15);
        const alpha = (6 - i) * 0.15 * blackHole.intensity;
        
        const gradient = ctx.createRadialGradient(0, 0, radius * 0.8, 0, 0, radius);
        gradient.addColorStop(0, `rgba(255, 100, 0, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(255, 50, 100, ${alpha * 0.7})`);
        gradient.addColorStop(1, `rgba(100, 0, 200, ${alpha * 0.3})`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 중력 렌즈 효과 (왜곡 링)
      for (let i = 1; i <= 3; i++) {
        const radius = blackHole.size * (1 + i * 0.3);
        const alpha = (4 - i) * 0.05;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();

      // 블랙홀 회전
      blackHole.rotation += 0.02;
    };

    const drawSpaceDistortion = () => {
      const blackHole = blackHoleRef.current;
      if (!blackHole) return;

      // 시공간 왜곡 효과
      const distortionRadius = blackHole.size * 2;
      
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      
      const gradient = ctx.createRadialGradient(
        blackHole.x, blackHole.y, 0,
        blackHole.x, blackHole.y, distortionRadius
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(blackHole.x, blackHole.y, distortionRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      timeRef.current += 1;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 우주 배경 그라데이션
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0.3)');
      bgGradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.2)');
      bgGradient.addColorStop(1, 'rgba(15, 23, 42, 0.3)');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      updateMeteors();
      drawSpaceDistortion();
      drawBlackHole();
      drawMeteors();

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

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
      className="fixed inset-0 pointer-events-none z-1"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen',
        opacity: 0.8
      }}
    />
  );
}