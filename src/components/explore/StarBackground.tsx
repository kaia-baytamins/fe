'use client';

import { useEffect } from 'react';

export default function StarBackground() {
  useEffect(() => {
    // 별들에 랜덤 애니메이션 딜레이 적용
    const stars = document.querySelectorAll('.star');
    stars.forEach((star: Element) => {
      const htmlStar = star as HTMLElement;
      htmlStar.style.animationDelay = Math.random() * 3 + 's';
      htmlStar.style.animationDuration = (Math.random() * 2 + 1) + 's';
    });
  }, []);

  // 더 많은 별들과 행성들 추가
  const stars = [
    // 기존 별들
    {top: '10%', left: '10%', icon: '⭐', size: 'text-lg'},
    {top: '20%', right: '15%', icon: '✨', size: 'text-sm'},
    {top: '40%', left: '20%', icon: '⭐', size: 'text-base'},
    {top: '60%', right: '25%', icon: '✨', size: 'text-lg'},
    {top: '80%', left: '30%', icon: '⭐', size: 'text-sm'},
    {top: '15%', left: '70%', icon: '⭐', size: 'text-base'},
    {top: '35%', right: '40%', icon: '✨', size: 'text-sm'},
    {top: '55%', left: '60%', icon: '⭐', size: 'text-lg'},
    {top: '75%', right: '10%', icon: '✨', size: 'text-base'},
    {top: '90%', left: '80%', icon: '⭐', size: 'text-sm'},
    {top: '5%', left: '50%', icon: '✨', size: 'text-lg'},
    {top: '65%', left: '5%', icon: '⭐', size: 'text-base'},
    {top: '30%', left: '90%', icon: '✨', size: 'text-sm'},
    {top: '85%', right: '60%', icon: '⭐', size: 'text-lg'},
    {top: '45%', right: '80%', icon: '✨', size: 'text-base'},
    
    // 추가 별들 (아래쪽 포함)
    {top: '70%', left: '15%', icon: '✨', size: 'text-sm'},
    {top: '95%', right: '30%', icon: '⭐', size: 'text-base'},
    {top: '88%', left: '45%', icon: '✨', size: 'text-lg'},
    {top: '92%', right: '20%', icon: '⭐', size: 'text-sm'},
    {top: '78%', left: '75%', icon: '✨', size: 'text-base'},
    {top: '82%', left: '8%', icon: '⭐', size: 'text-sm'},
    {top: '96%', left: '65%', icon: '✨', size: 'text-lg'},
    
    // 작은 별들 추가
    {top: '12%', left: '25%', icon: '·', size: 'text-xs'},
    {top: '28%', right: '35%', icon: '·', size: 'text-xs'},
    {top: '42%', left: '8%', icon: '·', size: 'text-xs'},
    {top: '58%', right: '45%', icon: '·', size: 'text-xs'},
    {top: '72%', left: '35%', icon: '·', size: 'text-xs'},
    {top: '86%', right: '15%', icon: '·', size: 'text-xs'},
    {top: '94%', left: '25%', icon: '·', size: 'text-xs'},
    
    // 멀리 있는 행성들
    {top: '25%', left: '85%', icon: '🪐', size: 'text-xs opacity-30'},
    {top: '70%', right: '5%', icon: '🌕', size: 'text-sm opacity-40'},
    {top: '15%', left: '3%', icon: '🌍', size: 'text-xs opacity-25'},
    {top: '90%', right: '85%', icon: '🔴', size: 'text-xs opacity-35'},
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-b from-black via-slate-900 to-slate-800">
      {stars.map((star, index) => (
        <div
          key={index}
          className={`star absolute ${star.size} animate-pulse`}
          style={{
            top: star.top,
            left: star.left,
            right: star.right,
            animationDuration: 'inherit'
          }}
        >
          {star.icon}
        </div>
      ))}
      <style jsx>{`
        .star {
          animation: twinkle 2s infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(0.8);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}