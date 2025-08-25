interface DefiPortfolioProps {
  onDefiAction: (type: 'staking' | 'lp' | 'lending') => void;
}

export default function DefiPortfolio({ onDefiAction }: DefiPortfolioProps) {
  const portfolioItems = [
    { icon: '💰', amount: '$300', label: '스테이킹', type: 'staking' as const },
    { icon: '🌊', amount: '$200', label: 'LP 제공', type: 'lp' as const },
    { icon: '🏦', amount: '$150', label: '렌딩', type: 'lending' as const },
  ];

  return (
    <div className="bg-slate-800/5 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-slate-700/20">
      <div className="text-center mb-6">
        <div className="text-blue-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
          💎 내 DeFi 포트폴리오
        </div>
        <div className="text-white text-2xl font-bold">$650</div>
        <div className="text-gray-400 text-sm">총 투자 가치</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {portfolioItems.map((item, index) => (
          <div key={index} className="bg-slate-700/8 backdrop-blur-md rounded-xl p-3 text-center border border-slate-600/15">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="font-bold text-white text-lg">{item.amount}</div>
            <div className="text-xs text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        {portfolioItems.map((item) => (
          <button 
            key={item.type}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
              item.type === 'staking' ? 'bg-green-600 hover:bg-green-700' :
              item.type === 'lp' ? 'bg-blue-600 hover:bg-blue-700' :
              'bg-purple-600 hover:bg-purple-700'
            } text-white`}
            onClick={() => onDefiAction(item.type)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}