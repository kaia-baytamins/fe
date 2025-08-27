import { useState } from 'react';

interface SellItemModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onSell: (price: string) => void;
}

export default function SellItemModal({ item, isOpen, onClose, onSell }: SellItemModalProps) {
  const [sellPrice, setSellPrice] = useState('');

  if (!isOpen || !item) return null;

  const handleSell = () => {
    if (sellPrice && parseFloat(sellPrice) > 0) {
      onSell(sellPrice);
      setSellPrice('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-slate-600">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-2">아이템 판매</h2>
          <div className="text-4xl mb-3">⚙️</div>
          <div className="text-lg font-semibold text-white">{item.name}</div>
        </div>

        {/* 아이템 스펙 정보 */}
        <div className="bg-slate-700 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">아이템 스펙</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">성능</span>
              <span className="text-white">스코어 +{item.score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">등급</span>
              <span className="text-blue-400">
                {item.score >= 300 ? '레전더리' : 
                 item.score >= 200 ? '에픽' : 
                 item.score >= 100 ? '희귀' : '기본'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">카테고리</span>
              <span className="text-white">엔진</span>
            </div>
          </div>
        </div>

        {/* 희망 판매가 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            희망 판매가 (USDT)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            placeholder="판매 가격을 입력하세요"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          <div className="text-xs text-gray-400 mt-1">
            추천 가격: {Math.floor(item.score / 15)} USDT
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSell}
            disabled={!sellPrice || parseFloat(sellPrice) <= 0}
            className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
          >
            판매
          </button>
        </div>
      </div>
    </div>
  );
}