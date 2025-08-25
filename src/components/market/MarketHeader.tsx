interface MarketHeaderProps {
  walletBalance: number;
}

export default function MarketHeader({ walletBalance }: MarketHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-green-400 font-bold text-xl flex items-center gap-2">
        🛍️ 마켓플레이스
      </h1>
      <div className="bg-slate-700/50 px-4 py-2 rounded-full">
        <span className="text-yellow-400 font-semibold">💰 {walletBalance.toLocaleString()} KAIA</span>
      </div>
    </div>
  );
}