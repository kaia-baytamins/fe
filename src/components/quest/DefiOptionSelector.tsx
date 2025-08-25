interface DefiOption {
  id: string;
  title: string;
  details: string;
}

interface DefiOptionSelectorProps {
  title: string;
  options: DefiOption[];
  selectedOption: string | null;
  onOptionSelect: (optionId: string) => void;
}

export default function DefiOptionSelector({ title, options, selectedOption, onOptionSelect }: DefiOptionSelectorProps) {
  return (
    <div className="bg-slate-700/30 rounded-xl p-4 mb-4">
      <div className="text-center mb-4">
        <div className="text-yellow-400 font-bold flex items-center justify-center gap-2">
          🎯 {title}
        </div>
      </div>
      
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.id}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              selectedOption === option.id
                ? 'bg-purple-600 text-white border-2 border-purple-400'
                : 'bg-slate-600/50 text-gray-300 hover:bg-slate-600 border-2 border-transparent'
            }`}
            onClick={() => onOptionSelect(option.id)}
          >
            <div className="font-medium">{option.title}</div>
            <div className="text-sm opacity-80">{option.details}</div>
          </button>
        ))}
      </div>
    </div>
  );
}