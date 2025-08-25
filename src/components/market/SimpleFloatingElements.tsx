'use client';

export default function SimpleFloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-2">
      {/* 달 - 고정 위치, 부드러운 움직임 */}
      <div 
        className="absolute text-4xl"
        style={{
          top: '15%',
          right: '20%',
          animation: 'gentle-float 8s ease-in-out infinite',
          filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))'
        }}
      >
        🌙
      </div>
      
      {/* 작은 별들 - 반짝임만 */}
      <div 
        className="absolute text-2xl"
        style={{
          top: '25%',
          left: '15%',
          animation: 'gentle-twinkle 3s ease-in-out infinite'
        }}
      >
        ⭐
      </div>
      
      <div 
        className="absolute text-xl"
        style={{
          top: '60%',
          right: '30%',
          animation: 'gentle-twinkle 4s ease-in-out infinite',
          animationDelay: '1s'
        }}
      >
        ✨
      </div>
      
      <div 
        className="absolute text-lg"
        style={{
          bottom: '40%',
          left: '25%',
          animation: 'gentle-twinkle 3.5s ease-in-out infinite',
          animationDelay: '2s'
        }}
      >
        💫
      </div>
      
      {/* 은하 - 천천히 회전 */}
      <div 
        className="absolute text-3xl"
        style={{
          bottom: '20%',
          right: '15%',
          animation: 'slow-spin 30s linear infinite',
          filter: 'drop-shadow(0 0 25px rgba(138, 43, 226, 0.5))'
        }}
      >
        🌌
      </div>
      
      {/* 정적 우주선들 */}
      <div 
        className="absolute text-2xl"
        style={{
          top: '70%',
          left: '10%',
          animation: 'gentle-float 10s ease-in-out infinite',
          animationDelay: '3s'
        }}
      >
        🛸
      </div>

      {/* 추가 우주 요소들 */}
      <div 
        className="absolute text-xl"
        style={{
          top: '35%',
          left: '70%',
          animation: 'gentle-twinkle 5s ease-in-out infinite',
          animationDelay: '4s'
        }}
      >
        🪐
      </div>

      <div 
        className="absolute text-lg"
        style={{
          bottom: '60%',
          right: '40%',
          animation: 'gentle-float 12s ease-in-out infinite',
          animationDelay: '6s'
        }}
      >
        🌠
      </div>

      <style jsx>{`
        @keyframes gentle-float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-8px) rotate(1deg); 
          }
          50% { 
            transform: translateY(-12px) rotate(0deg); 
          }
          75% { 
            transform: translateY(-6px) rotate(-1deg); 
          }
        }
        
        @keyframes gentle-twinkle {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.1); 
          }
        }
        
        @keyframes slow-spin {
          from { 
            transform: rotate(0deg); 
          }
          to { 
            transform: rotate(360deg); 
          }
        }
      `}</style>
    </div>
  );
}