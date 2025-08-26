'use client';

import { useState, useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface Planet {
  x: number;
  y: number;
  size: number;
  color: string;
  secondaryColor: string;
  shadowColor: string;
  rotation: number;
  rotationSpeed: number;
  orbitRadius: number;
  orbitSpeed: number;
  centerX: number;
  centerY: number;
  angle: number;
  hasRing: boolean;
}

export function useCosmicAnimation() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  // 마우스 위치 추적
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth - 0.5) * 100,
        y: (event.clientY / window.innerHeight - 0.5) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 파티클 초기화
  useEffect(() => {
    const initParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2 + 0.5,
          color: `rgba(${Math.random() > 0.5 ? '255, 255, 255' : '138, 43, 226'}, 0.8)`,
          opacity: Math.random() * 0.8 + 0.2,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100,
          maxLife: 100
        });
      }
      setParticles(newParticles);
    };

    initParticles();
    window.addEventListener('resize', initParticles);
    return () => window.removeEventListener('resize', initParticles);
  }, []);

  // 행성 초기화
  useEffect(() => {
    const initPlanets = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const newPlanets: Planet[] = [
        {
          x: centerX + 200,
          y: centerY - 150,
          size: 15,
          color: '#FF6B6B',
          secondaryColor: '#FF8E8E',
          shadowColor: '#CC5555',
          rotation: 0,
          rotationSpeed: 0.01,
          orbitRadius: 250,
          orbitSpeed: 0.005,
          centerX,
          centerY,
          angle: 0,
          hasRing: false
        },
        {
          x: centerX - 300,
          y: centerY + 100,
          size: 20,
          color: '#4ECDC4',
          secondaryColor: '#7ED5CE',
          shadowColor: '#3BA99A',
          rotation: 0,
          rotationSpeed: 0.008,
          orbitRadius: 350,
          orbitSpeed: 0.003,
          centerX,
          centerY,
          angle: Math.PI,
          hasRing: true
        },
        {
          x: centerX + 100,
          y: centerY + 200,
          size: 12,
          color: '#A8E6CF',
          secondaryColor: '#C4F0DB',
          shadowColor: '#85D1A8',
          rotation: 0,
          rotationSpeed: 0.015,
          orbitRadius: 180,
          orbitSpeed: 0.008,
          centerX,
          centerY,
          angle: Math.PI / 2,
          hasRing: false
        }
      ];
      
      setPlanets(newPlanets);
    };

    initPlanets();
    window.addEventListener('resize', initPlanets);
    return () => window.removeEventListener('resize', initPlanets);
  }, []);

  // 애니메이션 루프
  useEffect(() => {
    const animate = () => {
      // 파티클 업데이트
      setParticles(prev => prev.map(particle => {
        const newX = particle.x + particle.vx;
        const newY = particle.y + particle.vy;
        const newLife = particle.life + 1;

        // 화면 경계를 벗어나면 반대편에서 나타나기
        const x = newX < 0 ? window.innerWidth : newX > window.innerWidth ? 0 : newX;
        const y = newY < 0 ? window.innerHeight : newY > window.innerHeight ? 0 : newY;
        
        // 생명주기에 따른 투명도 변화
        const opacity = Math.sin((newLife / particle.maxLife) * Math.PI) * 0.8 + 0.2;

        return {
          ...particle,
          x,
          y,
          life: newLife > particle.maxLife ? 0 : newLife,
          opacity
        };
      }));

      // 행성 궤도 운동 및 자전
      setPlanets(prev => prev.map(planet => {
        const newAngle = planet.angle + planet.orbitSpeed;
        const newRotation = planet.rotation + planet.rotationSpeed;
        
        return {
          ...planet,
          x: planet.centerX + Math.cos(newAngle) * planet.orbitRadius,
          y: planet.centerY + Math.sin(newAngle) * planet.orbitRadius,
          angle: newAngle,
          rotation: newRotation
        };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    particles,
    planets,
    mousePosition
  };
}