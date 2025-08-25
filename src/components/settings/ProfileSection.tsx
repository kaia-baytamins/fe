interface ProfileSectionProps {
  onViewProfile: () => void;
}

export default function ProfileSection({ onViewProfile }: ProfileSectionProps) {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6">
      <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
        👤 내 프로필
      </h3>
      
      <div className="flex items-center gap-4">
        {/* 프로필 아바타 */}
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-3xl">
          🐕
        </div>
        
        {/* 프로필 정보 */}
        <div className="flex-1">
          <div className="text-white font-bold text-lg">우주견 코스모</div>
          <div className="text-blue-400 text-sm mb-2">Level 5 • 탐험가</div>
          <div className="flex gap-4 text-xs text-gray-300">
            <span>🪐 3개 행성</span>
            <span>💎 12개 NFT</span>
            <span>💰 45.2 KAIA</span>
          </div>
        </div>
        
        {/* 프로필 보기 버튼 */}
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          onClick={onViewProfile}
        >
          프로필 보기
        </button>
      </div>
    </div>
  );
}