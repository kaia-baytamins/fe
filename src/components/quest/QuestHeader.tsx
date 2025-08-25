interface QuestHeaderProps {
  walletBalance: number;
}

export default function QuestHeader({ walletBalance }: QuestHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-green-400 font-bold text-xl flex items-center gap-2">
        📋 DeFi 퀘스트
      </h1>
      <div className="bg-slate-700/8 backdrop-blur-lg px-4 py-2 rounded-full border border-slate-600/20">
        <span className="text-yellow-400 font-semibold">💰 {walletBalance.toLocaleString()} KAIA</span>
      </div>
    </div>
  );
}