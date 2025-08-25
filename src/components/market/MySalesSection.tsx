interface MySalesSectionProps {
  onSellItem: () => void;
}

interface MyItem {
  id: string;
  icon: string;
  name: string;
  price: string;
  isActive: boolean;
}

export default function MySalesSection({ onSellItem }: MySalesSectionProps) {
  const myItems: MyItem[] = [
    {
      id: '1',
      icon: '🔥',
      name: '플라즈마 엔진',
      price: '10 KAIA',
      isActive: true
    },
    {
      id: '2',
      icon: '⛽',
      name: '대형 연료통',
      price: '판매 대기',
      isActive: false
    },
    {
      id: '3',
      icon: '💎',
      name: '다이아몬드 유리',
      price: '25 KAIA',
      isActive: true
    }
  ];

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-blue-400 font-bold flex items-center gap-2">
          📦 내 판매 현황
        </h3>
        
        <button 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          onClick={onSellItem}
        >
          + 내 아이템 판매하기
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {myItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl"
          >
            {/* 판매 중 표시 */}
            {item.isActive && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
            
            {/* 아이템 아이콘 */}
            <div className="text-2xl">
              {item.icon}
            </div>
            
            {/* 아이템 정보 */}
            <div className="flex-1">
              <div className="text-white font-medium">
                {item.name}
              </div>
              <div className={`text-sm ${
                item.isActive ? 'text-green-400' : 'text-gray-400'
              }`}>
                {item.price}
              </div>
            </div>
            
            {/* 상태 표시 */}
            <div className="text-xs">
              {item.isActive ? (
                <span className="text-green-400">판매중</span>
              ) : (
                <span className="text-gray-400">대기중</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}