interface QuestCardProps {
  type: 'daily' | 'weekly' | 'special' | 'legendary';
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  progressText: string;
  rewardIcon: string;
  rewardName: string;
  rewardValue: string;
  status: 'completed' | 'in-progress' | 'locked';
  buttonText: string;
  buttonDisabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function QuestCard({
  type,
  title,
  description,
  progress,
  maxProgress,
  progressText,
  rewardIcon,
  rewardName,
  rewardValue,
  status,
  buttonText,
  buttonDisabled = false,
  onClick,
  children
}: QuestCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'daily':
        return 'bg-blue-600 text-white';
      case 'weekly':
        return 'bg-green-600 text-white';
      case 'special':
        return 'bg-purple-600 text-white';
      case 'legendary':
        return 'bg-yellow-600 text-black';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '⏳';
      case 'locked':
        return '🔒';
      default:
        return '🔒';
    }
  };

  const getCardStyles = () => {
    switch (status) {
      case 'completed':
        return 'border-green-500/30 bg-slate-800/8 backdrop-blur-lg';
      case 'in-progress':
        return 'border-yellow-500/30 bg-slate-800/6 backdrop-blur-lg';
      case 'locked':
        return 'border-gray-600/30 bg-slate-800/5 backdrop-blur-lg';
      default:
        return 'border-gray-600/30 bg-slate-800/5 backdrop-blur-lg';
    }
  };

  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

  return (
    <div className={`rounded-2xl p-4 border-2 mb-4 ${getCardStyles()}`}>
      {/* 퀘스트 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeStyles()}`}>
          {type === 'daily' ? '일일' : type === 'weekly' ? '주간' : type === 'special' ? '특별' : '전설'}
        </div>
        <div className="text-xl">{getStatusIcon()}</div>
      </div>
      
      {/* 퀘스트 제목 */}
      <div className="text-white font-bold text-lg mb-2">
        {title}
      </div>
      
      {/* 퀘스트 설명 */}
      <div className="text-gray-300 text-sm mb-4 leading-relaxed">
        {description}
      </div>
      
      {/* 추가 컨텐츠 (옵션 선택 등) */}
      {children}
      
      {/* 진행률 */}
      <div className="mb-4">
        <div className="bg-slate-700/50 rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              status === 'completed' ? 'bg-green-500' : 
              status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-600'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">진행률</span>
          <span className="text-white">{progressText}</span>
        </div>
      </div>
      
      {/* 보상 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{rewardIcon}</div>
          <div>
            <div className="text-white font-medium">{rewardName}</div>
            <div className="text-gray-400 text-sm">{rewardValue}</div>
          </div>
        </div>
        
        <button
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            buttonDisabled || status === 'completed'
              ? 'bg-slate-600 text-gray-400 cursor-not-allowed'
              : status === 'in-progress'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
          disabled={buttonDisabled || status === 'completed'}
          onClick={onClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}