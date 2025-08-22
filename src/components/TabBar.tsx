'use client';
// 5개 탭 버튼, activeTab props 받아서 렌더링

'use client';

interface TabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabBar({ activeTab, setActiveTab }: TabBarProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'explore', label: 'Explore', icon: '🌌' },
    { id: 'market', label: 'Market', icon: '🛒' },
    { id: 'quest', label: 'Quest', icon: '⚔️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-2 text-center transition-colors ${
              activeTab === tab.id
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="text-lg mb-1">{tab.icon}</div>
            <div className="text-xs font-medium">{tab.label}</div>
          </button>
        ))}
      </div>
    </nav>
  );
}