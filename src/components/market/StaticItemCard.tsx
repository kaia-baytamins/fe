interface StaticItemCardProps {
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

export default function StaticItemCard({ 
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
}: StaticItemCardProps) {
  const isVisible = currentCategory === 'all' || currentCategory === category;
  
  if (!isVisible) return null;

  const getRarityStyles = () => {
    switch (rarity) {
      case 'common':
        return 'border-slate-600 bg-slate-800/60 hover:border-slate-500';
      case 'rare':
        return 'border-blue-500/50 bg-slate-800/80 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20';
      case 'legendary':
        return 'border-purple-500/50 bg-slate-800/90 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25';
      default:
        return 'border-slate-600 bg-slate-800/60';
    }
  };

  const getBadgeStyles = () => {
    switch (type) {
      case 'mint':
        return 'bg-green-600 text-white';
      case 'user':
        return 'bg-blue-600 text-white';
      case 'quest':
        return 'bg-purple-600 text-white';
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

  const getIconGlow = () => {
    switch (rarity) {
      case 'legendary':
        return 'drop-shadow(0 0 15px rgba(138, 43, 226, 0.6))';
      case 'rare':
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
      {/* 타입 배지 */}
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
      <div className="text-white font-semibold text-center mb-2">
        {name}
      </div>
      
      {/* 아이템 스탯 */}
      <div className="text-gray-300 text-sm text-center mb-4">
        {stats}
      </div>
      
      {/* 가격 및 구매 버튼 */}
      <div className="space-y-3">
        <div className="text-yellow-400 font-bold text-center text-lg">
          {price}
        </div>
        
        {seller && type !== 'mint' && (
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