interface SettingItemProps {
  icon: string;
  name: string;
  description: string;
  type?: 'navigation' | 'toggle' | 'select';
  value?: boolean | string;
  options?: { value: string; label: string }[];
  onClick?: () => void;
  onToggle?: (value: boolean) => void;
  onChange?: (value: string) => void;
}

export default function SettingItem({ 
  icon, 
  name, 
  description, 
  type = 'navigation',
  value,
  options,
  onClick,
  onToggle,
  onChange 
}: SettingItemProps) {
  const renderControl = () => {
    switch (type) {
      case 'toggle':
        return (
          <div 
            className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${
              value ? 'bg-purple-600' : 'bg-slate-600'
            }`}
            onClick={() => onToggle && onToggle(!value)}
          >
            <div 
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                value ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </div>
        );
      
      case 'select':
        return (
          <select
            className="bg-slate-700 text-white px-3 py-1 rounded-lg text-sm border border-slate-600"
            value={value as string}
            onChange={(e) => onChange && onChange(e.target.value)}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'navigation':
      default:
        return (
          <div className="text-gray-400 text-xl">
            ›
          </div>
        );
    }
  };

  return (
    <div 
      className={`flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl ${
        type === 'navigation' ? 'cursor-pointer hover:bg-slate-700/70' : ''
      } transition-all`}
      onClick={type === 'navigation' ? onClick : undefined}
    >
      {/* 아이콘 */}
      <div className="text-xl">
        {icon}
      </div>
      
      {/* 설정 정보 */}
      <div className="flex-1">
        <div className="text-white font-medium">
          {name}
        </div>
        <div className="text-gray-400 text-sm">
          {description}
        </div>
      </div>
      
      {/* 컨트롤 */}
      {renderControl()}
    </div>
  );
}