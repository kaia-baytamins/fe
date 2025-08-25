interface ItemCardProps {
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

export default function ItemCard({ 
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
}: ItemCardProps) {
  const isVisible = currentCategory === 'all' || currentCategory === category;
  
  if (!isVisible) return null;

  const getRarityStyles = () => {
    switch (rarity) {
      case 'common':
        return 'border-gray-600 bg-slate-800/60';
      case 'rare':
        return 'border-blue-500 bg-slate-800/80';
      case 'legendary':
        return 'border-purple-500 bg-slate-800/90';
      default:
        return 'border-gray-600 bg-slate-800/60';
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

  return (
    <div 
      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 relative group ${getRarityStyles()}`}
      onClick={() => onClick(id)}
      style={{
        backgroundImage: rarity === 'legendary' ? 'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)' : undefined
      }}
    >
      {/* 타입 배지 */}
      <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mb-3 ${getBadgeStyles()}`}>
        {getBadgeText()}
      </div>
      
      {/* 아이템 아이콘 */}
      <div className="text-4xl text-center mb-3 group-hover:animate-pulse relative">
        {icon}
        {rarity === 'legendary' && (
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-spin" 
               style={{ animationDuration: '3s' }} />
        )}
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
      <div className="space-y-2">
        <div className="text-yellow-400 font-bold text-center text-lg">
          {price}
        </div>
        
        {seller && type !== 'mint' && (
          <div className="text-gray-400 text-xs text-center">
            {seller}
          </div>
        )}
        
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors">
          구매
        </button>
      </div>
    </div>
  );
}