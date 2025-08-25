import { useState, useEffect } from 'react';

interface DefiModalProps {
  isOpen: boolean;
  type: 'staking' | 'lp' | 'lending' | null;
  onClose: () => void;
  onParticipate: (amount: number) => void;
  walletBalance?: number;
  loading?: boolean;
}

export default function DefiModal({ isOpen, type, onClose, onParticipate, walletBalance = 1250, loading = false }: DefiModalProps) {
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  // 모달이 열릴 때 초기화 - 조건문보다 먼저 배치
  useEffect(() => {
    if (isOpen) {
      setAmount(0);
      setSliderValue(0);
    }
  }, [isOpen]);

  // 조건부 렌더링을 모든 Hooks 이후로 이동
  if (!isOpen || !type) return null;

  const getDefiInfo = (defiType: string) => {
    const defiInfo = {
      'staking': {
        title: '💰 스테이킹',
        desc: 'KAIA 토큰을 스테이킹하여 안정적인 수익을 얻으세요.',
        apy: '12.5%'
      },
      'lp': {
        title: '🌊 LP 제공',
        desc: 'KAIA-USDT 페어에 유동성을 제공하고 더 높은 수익을 얻으세요.',
        apy: '24.8%'
      },
      'lending': {
        title: '🏦 렌딩',
        desc: 'KAIA를 예치하고 다른 토큰을 대출받아 레버리지 거래를 하세요.',
        apy: '18.3%'
      }
    };
    return defiInfo[defiType as keyof typeof defiInfo] || defiInfo.staking;
  };

  const info = getDefiInfo(type);

  // APY를 숫자로 변환
  const apyRate = parseFloat(info.apy.replace('%', '')) / 100;
  
  // 연간 예상 수익 계산
  const estimatedYearlyReturn = amount * apyRate;
  
  // 월간 예상 수익 계산
  const estimatedMonthlyReturn = estimatedYearlyReturn / 12;

  // 슬라이더 값 변경 핸들러
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    const calculatedAmount = (walletBalance * value) / 100;
    setAmount(calculatedAmount);
  };

  // 직접 입력 핸들러
  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const maxAmount = Math.min(value, walletBalance);
    setAmount(maxAmount);
    setSliderValue((maxAmount / walletBalance) * 100);
  };

  // 최대 금액 설정
  const handleMaxAmount = () => {
    setAmount(walletBalance);
    setSliderValue(100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 border border-slate-600">
        <div className="text-yellow-400 font-bold text-xl mb-4 text-center">
          {info.title}
        </div>
        
        <div className="text-gray-300 text-sm mb-6 text-center">
          {info.desc}
        </div>
        
        {/* 지갑 잔액 표시 */}
        <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
          <div className="text-gray-400 text-xs mb-1">지갑 잔액</div>
          <div className="text-white font-medium">{walletBalance.toLocaleString()} KAIA</div>
        </div>

        {/* 투자 금액 입력 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">투자 금액</span>
            <button 
              onClick={handleMaxAmount}
              className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
            >
              최대
            </button>
          </div>
          
          <div className="relative mb-3">
            <input
              type="number"
              value={amount || ''}
              onChange={handleAmountInput}
              placeholder="0"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-right pr-12"
              max={walletBalance}
              min="0"
              step="0.01"
            />
            <span className="absolute right-3 top-3 text-gray-400 text-sm">KAIA</span>
          </div>

          {/* 슬라이더 */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sliderValue}%, #475569 ${sliderValue}%, #475569 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* APY 및 예상 수익 */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">현재 APY</span>
            <span className="text-green-400 font-bold text-lg">{info.apy}</span>
          </div>
          
          {amount > 0 && (
            <>
              <div className="border-t border-slate-600 pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">예상 월간 수익</span>
                  <span className="text-yellow-400 font-medium">
                    +{estimatedMonthlyReturn.toFixed(2)} KAIA
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">예상 연간 수익</span>
                  <span className="text-green-400 font-bold">
                    +{estimatedYearlyReturn.toFixed(2)} KAIA
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors"
            onClick={onClose}
          >
            취소
          </button>
          <button 
            className={`flex-1 py-3 px-2 rounded-xl font-medium transition-colors text-sm leading-tight ${
              amount > 0 
                ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white' 
                : 'bg-slate-700 text-gray-400 cursor-not-allowed'
            }`}
            onClick={() => amount > 0 && onParticipate(amount)}
            disabled={amount <= 0}
          >
            {amount > 0 ? (
              <div className="flex flex-col items-center justify-center">
                <span className="font-bold">{amount.toFixed(2)} KAIA</span>
                <span className="text-xs opacity-90">참여하기</span>
              </div>
            ) : (
              '금액을 입력하세요'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}