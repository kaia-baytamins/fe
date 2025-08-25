interface QuestTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function QuestTabs({ activeTab, onTabChange }: QuestTabsProps) {
  const tabs = [
    { id: 'daily', label: '일일', icon: '📅' },
    { id: 'weekly', label: '주간', icon: '🗓️' },
    { id: 'special', label: '특별', icon: '🌟' },
    { id: 'legendary', label: '전설', icon: '👑' },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all text-center ${
            activeTab === tab.id
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-700'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <div className="text-lg">{tab.icon}</div>
          <div className="text-sm">{tab.label}</div>
        </button>
      ))}
    </div>
  );
}