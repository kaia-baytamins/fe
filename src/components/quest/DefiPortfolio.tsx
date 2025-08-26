import type { DefiPortfolio as DefiPortfolioType } from '@/services/types';

interface DefiPortfolioProps {
  onDefiAction: (type: 'staking' | 'lp_providing' | 'lending') => void;
  portfolio: DefiPortfolioType | null;
  loading?: boolean;
}

export default function DefiPortfolio({ onDefiAction, portfolio, loading = false }: DefiPortfolioProps) {
  // Safe number parsing function
  const safeParseFloat = (value: string | number | undefined | null): number => {
    if (value === undefined || value === null || value === '') return 0;
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Debug log to check portfolio data
  console.log('DefiPortfolio - portfolio:', portfolio);
  console.log('DefiPortfolio - loading:', loading);

  const stakingValue = safeParseFloat(portfolio?.portfolio?.stakingValue);
  const lpValue = safeParseFloat(portfolio?.portfolio?.lpValue);
  const lendingValue = safeParseFloat(portfolio?.portfolio?.lendingValue);
  const totalValue = safeParseFloat(portfolio?.portfolio?.totalValue);

  console.log('DefiPortfolio - parsed values:', { stakingValue, lpValue, lendingValue, totalValue });

  const portfolioItems = [
    { 
      icon: '💰', 
      amount: loading ? '$0' : `$${stakingValue.toFixed(0)}`, 
      label: '스테이킹', 
      type: 'staking' as const 
    },
    { 
      icon: '🌊', 
      amount: loading ? '$0' : `$${lpValue.toFixed(0)}`, 
      label: 'LP 제공', 
      type: 'lp_providing' as const 
    },
    { 
      icon: '🏦', 
      amount: loading ? '$0' : `$${lendingValue.toFixed(0)}`, 
      label: '렌딩', 
      type: 'lending' as const 
    },
  ];

  return (
    <div className="bg-slate-800/5 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-slate-700/20">
      <div className="text-center mb-6">
        <div className="text-blue-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
          💎 내 DeFi 포트폴리오
          {loading && (
            <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full" />
          )}
        </div>
        <div className="text-white text-2xl font-bold">
          {loading ? '로딩 중...' : `$${totalValue.toFixed(0)}`}
        </div>
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
              item.type === 'lp_providing' ? 'bg-blue-600 hover:bg-blue-700' :
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