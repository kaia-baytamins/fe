'use client';

import { useEffect, useRef } from 'react';

interface Meteor {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  trail: { x: number; y: number; opacity: number }[];
  life: number;
  burning: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: number;
  consumed: boolean;
  regenerating: boolean;
  regenerationTime: number;
}

interface BlackHole {
  x: number;
  y: number;
  size: number;
  active: boolean;
  consumeRadius: number;
  nextActivation: number;
  rotation: number;
}

export default function DynamicCosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meteorsRef = useRef<Meteor[]>([]);
  const starsRef = useRef<Star[]>([]);
  const blackHolesRef = useRef<BlackHole[]>([]);
  const animationRef = useRef<number>();
  const lastMeteorTime = useRef(0);
  const lastBlackHoleTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas 크기 설정
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 초기 별들 생성
    const initStars = () => {
      starsRef.current = [];
      for (let i = 0; i < 150; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkle: Math.random() * Math.PI * 2,
          consumed: false,
          regenerating: false,
          regenerationTime: 0
        });
      }
    };

    // 블랙홀 생성
    const initBlackHoles = () => {
      blackHolesRef.current = [
        {
          x: canvas.width * 0.7,
          y: canvas.height * 0.3,
          size: 0,
          active: false,
          consumeRadius: 80,
          nextActivation: Date.now() + 15000, // 15초 후 첫 활성화
          rotation: 0
        },
        {
          x: canvas.width * 0.2,
          y: canvas.height * 0.7,
          size: 0,
          active: false,
          consumeRadius: 60,
          nextActivation: Date.now() + 45000, // 45초 후 활성화 (30초 간격 유지)
          rotation: 0
        }
      ];
    };

    // 불타는 운석 생성
    const createMeteor = () => {
      // 왼쪽 위에서 오른쪽 아래로 떨어지는 방향만
      const meteor: Meteor = {
        x: -Math.random() * 200,  // 화면 왼쪽 밖에서 시작
        y: -Math.random() * 200,  // 화면 위쪽 밖에서 시작
        speedX: Math.random() * 4 + 3, // 오른쪽으로 3~7
        speedY: Math.random() * 3 + 2, // 아래로 2~5
        size: Math.random() * 4 + 2,
        trail: [],
        life: 1,
        burning: true
      };
      
      meteorsRef.current.push(meteor);
    };

    initStars();
    initBlackHoles();

    // 메인 애니메이션 루프
    const animate = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 불타는 운석 생성 (20초마다)
      if (currentTime - lastMeteorTime.current > 20000) {
        createMeteor();
        lastMeteorTime.current = currentTime;
      }

      // 블랙홀 활성화 체크 (30초마다)
      blackHolesRef.current.forEach(blackHole => {
        if (!blackHole.active && currentTime > blackHole.nextActivation) {
          blackHole.active = true;
          blackHole.size = 0;
          blackHole.nextActivation = currentTime + 30000; // 다음 30초 후
        }
      });

      // 별 렌더링 및 업데이트
      starsRef.current.forEach(star => {
        if (star.consumed && star.regenerating) {
          star.regenerationTime += 16;
          if (star.regenerationTime > 5000) { // 5초 후 재생성
            star.consumed = false;
            star.regenerating = false;
            star.regenerationTime = 0;
            star.opacity = Math.random() * 0.8 + 0.2;
          }
        }

        if (!star.consumed) {
          star.twinkle += 0.02;
          const twinkleOpacity = star.opacity + Math.sin(star.twinkle) * 0.3;
          
          ctx.save();
          ctx.globalAlpha = Math.max(0.1, twinkleOpacity);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // 블랙홀 렌더링 및 별 소비
      blackHolesRef.current.forEach(blackHole => {
        if (blackHole.active) {
          blackHole.rotation += 0.1;
          
          if (blackHole.size < 25) {
            blackHole.size += 0.8; // 크기 증가
          }

          // 블랙홀 그라디언트
          const gradient = ctx.createRadialGradient(
            blackHole.x, blackHole.y, 0,
            blackHole.x, blackHole.y, blackHole.size * 2
          );
          gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
          gradient.addColorStop(0.3, 'rgba(75, 0, 130, 0.8)');
          gradient.addColorStop(0.6, 'rgba(138, 43, 226, 0.4)');
          gradient.addColorStop(1, 'rgba(138, 43, 226, 0.1)');

          ctx.save();
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(blackHole.x, blackHole.y, blackHole.size, 0, Math.PI * 2);
          ctx.fill();

          // 소용돌이 효과
          for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = `rgba(138, 43, 226, ${0.3 - i * 0.1})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            const radius = blackHole.size + i * 10;
            ctx.arc(blackHole.x, blackHole.y, radius, blackHole.rotation + i, blackHole.rotation + i + Math.PI);
            ctx.stroke();
          }
          ctx.restore();

          // 근처 별들 소비
          starsRef.current.forEach(star => {
            if (!star.consumed) {
              const dx = star.x - blackHole.x;
              const dy = star.y - blackHole.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < blackHole.consumeRadius) {
                star.consumed = true;
                star.regenerating = true;
                star.regenerationTime = 0;
                
                // 새로운 별을 다른 위치에 생성
                setTimeout(() => {
                  star.x = Math.random() * canvas.width;
                  star.y = Math.random() * canvas.height;
                }, Math.random() * 2000 + 1000);
              }
            }
          });

          // 5초 후 블랙홀 비활성화
          if (currentTime - (blackHole.nextActivation - 30000) > 5000) {
            blackHole.active = false;
            blackHole.size = 0;
          }
        }
      });

      // 불타는 운석 렌더링 및 업데이트
      meteorsRef.current = meteorsRef.current.filter(meteor => {
        // 운석 이동
        meteor.x += meteor.speedX;
        meteor.y += meteor.speedY;

        // 꼬리 업데이트
        meteor.trail.push({
          x: meteor.x,
          y: meteor.y,
          opacity: meteor.life
        });

        if (meteor.trail.length > 12) {
          meteor.trail.shift();
        }

        // 꼬리 감소
        meteor.trail.forEach((point, index) => {
          point.opacity *= 0.95;
        });

        // 운석 꼬리 그리기
        meteor.trail.forEach((point, index) => {
          if (point.opacity > 0.1) {
            const size = meteor.size * (point.opacity * 0.8);
            
            ctx.save();
            ctx.globalAlpha = point.opacity;
            
            // 불 효과
            const fireGradient = ctx.createRadialGradient(
              point.x, point.y, 0,
              point.x, point.y, size * 2
            );
            fireGradient.addColorStop(0, '#ffff00');
            fireGradient.addColorStop(0.3, '#ff6600');
            fireGradient.addColorStop(0.7, '#ff0000');
            fireGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.fillStyle = fireGradient;
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        // 운석 본체
        ctx.save();
        ctx.globalAlpha = meteor.life;
        
        const meteorGradient = ctx.createRadialGradient(
          meteor.x, meteor.y, 0,
          meteor.x, meteor.y, meteor.size
        );
        meteorGradient.addColorStop(0, '#ffffff');
        meteorGradient.addColorStop(0.3, '#ffff00');
        meteorGradient.addColorStop(0.6, '#ff6600');
        meteorGradient.addColorStop(1, '#ff0000');
        
        ctx.fillStyle = meteorGradient;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 글로우 효과
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        // 생명력 감소 (더 천천히)
        meteor.life -= 0.005;

        // 화면을 완전히 통과할 때까지 유지 (더 넓은 범위)
        return meteor.x > -200 && meteor.x < canvas.width + 200 && 
               meteor.y > -200 && meteor.y < canvas.height + 200 && 
               meteor.life > 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

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
        background: 'transparent'
      }}
    />
  );
}