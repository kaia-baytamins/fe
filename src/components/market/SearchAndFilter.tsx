interface SearchAndFilterProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
}

export default function SearchAndFilter({ 
  currentCategory, 
  onCategoryChange, 
  onSearch 
}: SearchAndFilterProps) {
  const categories = [
    { id: 'all', label: '전체', icon: '' },
    { id: 'engine', label: '엔진', icon: '⚙️' },
    { id: 'material', label: '우주선소재', icon: '🛡️' },
    { id: 'special', label: '특수장비', icon: '⚡' },
    { id: 'fuel', label: '연료통', icon: '⛽' },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* 검색바 */}
      <div className="relative">
        <input 
          type="text" 
          className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" 
          placeholder="🔍 아이템 이름 검색..." 
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button 
            key={category.id}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              currentCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

    </div>
  );
}