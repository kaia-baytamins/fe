interface Item {
  name: string;
  icon: string;
  stats: string;
  price: string;
  seller: string;
  type: 'mint' | 'user' | 'quest';
}

interface ItemModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

export default function ItemModal({ item, isOpen, onClose, onPurchase }: ItemModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 border border-slate-600">
        {/* 아이템 아이콘 */}
        <div className="text-6xl text-center mb-4">
          {item.icon}
        </div>
        
        {/* 아이템 이름 */}
        <div className="text-white font-bold text-xl text-center mb-2">
          {item.name}
        </div>
        
        {/* 아이템 스탯 */}
        <div className="text-gray-300 text-center mb-4">
          {item.stats}
        </div>
        
        {/* 가격 */}
        <div className="text-yellow-400 font-bold text-2xl text-center mb-2">
          {item.price}
        </div>
        
        {/* 판매자 정보 */}
        <div className="text-gray-400 text-sm text-center mb-6">
          {item.seller}
        </div>
        
        {/* 버튼들 */}
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors"
            onClick={onClose}
          >
            취소
          </button>
          <button 
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors"
            onClick={onPurchase}
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}