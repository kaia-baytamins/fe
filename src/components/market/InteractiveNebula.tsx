'use client';

import { useEffect, useRef } from 'react';

interface NebulaPoint {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  intensity: number;
  hue: number;
  phase: number;
}

export default function InteractiveNebula() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<NebulaPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, influence: 0 });
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initNebula = () => {
      const points: NebulaPoint[] = [];
      const cols = Math.floor(canvas.width / 40);
      const rows = Math.floor(canvas.height / 40);

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const baseX = (x / cols) * canvas.width;
          const baseY = (y / rows) * canvas.height;
          
          points.push({
            x: baseX,
            y: baseY,
            baseX,
            baseY,
            vx: 0,
            vy: 0,
            size: Math.random() * 8 + 4,
            intensity: Math.random() * 0.6 + 0.2,
            hue: Math.random() * 60 + 240, // 파랑-보라 스펙트럼
            phase: Math.random() * Math.PI * 2
          });
        }
      }
      pointsRef.current = points;
    };

    const updateNebula = () => {
      timeRef.current += 0.01;
      const points = pointsRef.current;
      const mouse = mouseRef.current;

      points.forEach(point => {
        // 마우스 영향력 계산
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance && mouse.influence > 0) {
          const force = (maxDistance - distance) / maxDistance * mouse.influence * 0.05;
          point.vx += (dx / distance) * force;
          point.vy += (dy / distance) * force;
        }

        // 기본 위치로 돌아가려는 힘
        const returnForce = 0.02;
        point.vx += (point.baseX - point.x) * returnForce;
        point.vy += (point.baseY - point.y) * returnForce;

        // 주변 노이즈 효과
        const noise = Math.sin(timeRef.current + point.phase) * 0.5;
        point.vx += noise * 0.01;
        point.vy += Math.cos(timeRef.current + point.phase) * 0.01;

        // 마찰
        point.vx *= 0.95;
        point.vy *= 0.95;

        // 위치 업데이트
        point.x += point.vx;
        point.y += point.vy;

        // 색상 변화
        point.hue = (point.hue + 0.2) % 360;
      });
    };

    const drawNebula = () => {
      // 배경을 완전히 지우지 않고 페이드 효과
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';
      
      const points = pointsRef.current;

      // 각 점에서 그라데이션 원 그리기
      points.forEach(point => {
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.size * 3
        );

        const alpha = point.intensity * (0.3 + Math.sin(timeRef.current + point.phase) * 0.2);
        
        gradient.addColorStop(0, `hsla(${point.hue}, 70%, 60%, ${alpha})`);
        gradient.addColorStop(0.5, `hsla(${point.hue}, 70%, 50%, ${alpha * 0.3})`);
        gradient.addColorStop(1, `hsla(${point.hue}, 70%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 연결 효과 (가까운 점들 사이)
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < points.length; i++) {
        const point1 = points[i];
        
        for (let j = i + 1; j < Math.min(i + 6, points.length); j++) {
          const point2 = points[j];
          const dx = point1.x - point2.x;
          const dy = point1.y - point2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            const opacity = (1 - distance / 80) * 0.1;
            ctx.strokeStyle = `rgba(138, 43, 226, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      updateNebula();
      drawNebula();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      mouseRef.current.influence = Math.min(mouseRef.current.influence + 0.1, 1);
    };

    const handleMouseLeave = () => {
      mouseRef.current.influence = Math.max(mouseRef.current.influence - 0.05, 0);
    };

    resizeCanvas();
    initNebula();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initNebula();
    });
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen',
        opacity: 0.7 
      }}
    />
  );
}