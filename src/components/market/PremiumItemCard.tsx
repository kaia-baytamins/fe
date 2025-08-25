interface PremiumItemCardProps {
  id: string;
  icon: string;
  name: string;
  stats: string;
  price: string;
  seller?: string;
  type: 'mint' | 'user' | 'quest';
  rarity: 'common' | 'rare' | 'legendary';
  category: string;
  currentCategory: string;
  onClick: (id: string) => void;
}

export default function PremiumItemCard({ 
  id, 
  icon, 
  name, 
  stats, 
  price, 
  seller, 
  type, 
  rarity, 
  category, 
  currentCategory,
  onClick 
}: PremiumItemCardProps) {
  const isVisible = currentCategory === 'all' || currentCategory === category;
  
  if (!isVisible) return null;

  const getRarityStyles = () => {
    switch (rarity) {
      case 'common':
        return 'border-slate-600 bg-slate-800/60 hover:border-slate-500';
      case 'rare':
        return 'border-blue-500/50 bg-slate-800/80 hover:border-blue-400 hover:shadow-blue-500/20';
      case 'legendary':
        return 'border-purple-500/50 bg-slate-800/90 hover:border-purple-400 hover:shadow-purple-500/30';
      default:
        return 'border-slate-600 bg-slate-800/60';
    }
  };

  const getBadgeStyles = () => {
    switch (type) {
      case 'mint':
        return 'bg-green-600 text-white shadow-lg shadow-green-600/30';
      case 'user':
        return 'bg-blue-600 text-white shadow-lg shadow-blue-600/30';
      case 'quest':
        return 'bg-purple-600 text-white shadow-lg shadow-purple-600/30';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getBadgeText = () => {
    switch (type) {
      case 'mint':
        return '보급형';
      case 'user':
        return '사용자';
      case 'quest':
        return '퀘스트';
      default:
        return '일반';
    }
  };

  const getRarityGlow = () => {
    switch (rarity) {
      case 'legendary':
        return 'drop-shadow(0 0 20px rgba(138, 43, 226, 0.6)) drop-shadow(0 0 40px rgba(138, 43, 226, 0.3))';
      case 'rare':
        return 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.2))';
      default:
        return 'none';
    }
  };

  return (
    <div 
      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl relative group overflow-hidden ${getRarityStyles()}`}
      onClick={() => onClick(id)}
      style={{
        backgroundImage: rarity === 'legendary' ? 
          'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.1) 0%, transparent 60%), linear-gradient(45deg, rgba(138, 43, 226, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)' : 
          rarity === 'rare' ? 
          'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)' :
          undefined,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      {/* 애니메이션 배경 레이어 */}
      {rarity === 'legendary' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
        </>
      )}

      {rarity === 'rare' && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/15 to-cyan-600/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
      )}

      {/* 홀로그래픽 스캔 라인 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-full w-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      {/* 타입 배지 */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 transition-all duration-300 group-hover:scale-110 ${getBadgeStyles()}`}>
        {getBadgeText()}
      </div>
      
      {/* 아이템 아이콘 */}
      <div 
        className="text-5xl text-center mb-4 group-hover:animate-pulse relative transition-all duration-300"
        style={{
          filter: getRarityGlow(),
          transform: 'translateZ(20px)'
        }}
      >
        {icon}
        
        {/* 회전하는 링 (전설급) */}
        {rarity === 'legendary' && (
          <div className="absolute -inset-4 rounded-full border-2 border-purple-500/30 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
               style={{ animationDuration: '3s' }} />
        )}

        {/* 파티클 효과 */}
        {(rarity === 'legendary' || rarity === 'rare') && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 ${rarity === 'legendary' ? 'bg-purple-400' : 'bg-blue-400'} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                style={{
                  top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 20}%`,
                  left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 30}%`,
                  animation: `particle-float-${i} 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 아이템 이름 */}
      <div className="text-white font-semibold text-center mb-2 group-hover:text-shadow-lg transition-all duration-300">
        {name}
      </div>
      
      {/* 아이템 스탯 */}
      <div className="text-gray-300 text-sm text-center mb-4 group-hover:text-gray-200 transition-colors duration-300">
        {stats}
      </div>
      
      {/* 가격 및 구매 버튼 */}
      <div className="space-y-3">
        <div className="text-yellow-400 font-bold text-center text-lg group-hover:text-yellow-300 transition-colors duration-300">
          {price}
        </div>
        
        {seller && type !== 'mint' && (
          <div className="text-gray-400 text-xs text-center group-hover:text-gray-300 transition-colors duration-300">
            {seller}
          </div>
        )}
        
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          구매
        </button>
      </div>

      <style jsx>{`
        ${[...Array(6)].map((_, i) => `
          @keyframes particle-float-${i} {
            0%, 100% {
              transform: translateY(0px) scale(0.8);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-10px) scale(1.2);
              opacity: 0.8;
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
}