export default function DefiStats() {
  const defiStats = [
    { icon: '💰', name: '총 스테이킹', value: '$300' },
    { icon: '🌊', name: 'LP 제공', value: '$200' },
    { icon: '🏦', name: '렌딩', value: '$150' },
    { icon: '📈', name: '총 수익률', value: '+18.4%' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {defiStats.map((stat, index) => (
        <div key={index} className="bg-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-white font-bold text-lg">{stat.value}</div>
          <div className="text-gray-400 text-sm">{stat.name}</div>
        </div>
      ))}
    </div>
  );
}