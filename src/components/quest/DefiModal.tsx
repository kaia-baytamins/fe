interface DefiModalProps {
  isOpen: boolean;
  type: 'staking' | 'lp' | 'lending' | null;
  onClose: () => void;
  onParticipate: () => void;
}

export default function DefiModal({ isOpen, type, onClose, onParticipate }: DefiModalProps) {
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
        
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <div className="text-gray-400 text-sm font-bold mb-2 text-center">현재 APY</div>
          <div className="text-green-400 text-2xl font-bold text-center">
            {info.apy}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors"
            onClick={onClose}
          >
            취소
          </button>
          <button 
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
            onClick={onParticipate}
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
}