interface StaticItemCardProps {
  id: string;
  icon: string;
  name: string;
  stats: string;
  price: string;
  seller?: string;
  rarity: '기본' | '희귀' | '에픽' | '레전더리';
  category: string;
  currentCategory: string;
  onClick: (id: string) => void;
}

export default function StaticItemCard({ 
  id, 
  icon, 
  name, 
  stats, 
  price, 
  seller, 
  rarity, 
  category, 
  currentCategory,
  onClick 
}: StaticItemCardProps) {
  const isVisible = currentCategory === 'all' || currentCategory === category;
  
  if (!isVisible) return null;

  const getRarityStyles = () => {
    switch (rarity) {
      case '기본':
        return 'border-slate-600 bg-slate-800/60 hover:border-slate-500';
      case '희귀':
        return 'border-blue-500/50 bg-slate-800/80 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20';
      case '에픽':
        return 'border-purple-500/50 bg-slate-800/80 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20';
      case '레전더리':
        return 'border-yellow-500/50 bg-slate-800/90 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-500/25';
      default:
        return 'border-slate-600 bg-slate-800/60';
    }
  };

  const getBadgeStyles = () => {
    switch (rarity) {
      case '기본':
        return 'bg-gray-600 text-white';
      case '희귀':
        return 'bg-blue-600 text-white';
      case '에픽':
        return 'bg-purple-600 text-white';
      case '레전더리':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getBadgeText = () => {
    return rarity;
  };

  const getIconGlow = () => {
    switch (rarity) {
      case '레전더리':
        return 'drop-shadow(0 0 15px rgba(234, 179, 8, 0.6))';
      case '에픽':
        return 'drop-shadow(0 0 12px rgba(138, 43, 226, 0.5))';
      case '희귀':
        return 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))';
      default:
        return 'none';
    }
  };

  return (
    <div 
      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 hover:scale-[1.02] relative ${getRarityStyles()}`}
      onClick={() => onClick(id)}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      {/* 등급 배지 */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${getBadgeStyles()}`}>
        {getBadgeText()}
      </div>
      
      {/* 아이템 아이콘 */}
      <div 
        className="text-5xl text-center mb-4 transition-all duration-300"
        style={{
          filter: getIconGlow()
        }}
      >
        {icon}
      </div>
      
      {/* 아이템 이름 */}
      <div className="text-white font-semibold text-center mb-2 h-12 flex items-center justify-center">
        <div className="line-clamp-2 text-sm leading-tight">
          {name}
        </div>
      </div>
      
      {/* 아이템 스탯 */}
      <div className="text-gray-300 text-sm text-center mb-4 h-6 flex items-center justify-center">
        {stats}
      </div>
      
      {/* 가격 및 구매 버튼 */}
      <div className="space-y-3">
        <div className="text-yellow-400 font-bold text-center text-lg">
          {price}
        </div>
        
        {seller && (
          <div className="text-gray-400 text-xs text-center">
            {seller}
          </div>
        )}
        
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-xl font-medium transition-colors duration-200">
          구매
        </button>
      </div>
    </div>
  );
}