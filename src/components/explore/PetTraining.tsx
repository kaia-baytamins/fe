'use client';

interface PetTrainingProps {
  setActiveSection: (section: 'launchpad' | 'pet' | 'maintenance') => void;
}

export default function PetTraining({ setActiveSection }: PetTrainingProps) {
  const petStats = {
    agility: 85,
    intelligence: 62,
    skill: 73
  };

  return (
    <div className="p-4 space-y-6">
      {/* 네비게이션 버튼들 */}
      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={() => setActiveSection('launchpad')}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-full text-white font-medium transition-colors"
        >
          🚀 발사소
        </button>
        <button 
          onClick={() => setActiveSection('pet')}
          className="bg-purple-600 px-4 py-2 rounded-full text-white font-medium"
        >
          🐕 펫 훈련
        </button>
        <button 
          onClick={() => setActiveSection('maintenance')}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-full text-white font-medium transition-colors"
        >
          🔧 우주선 정비
        </button>
      </div>

      {/* 펫 정보 */}
      <div className="text-center mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-6xl">🐕</span>
        </div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">🐕 코스모 훈련장</h2>
      </div>

      {/* 펫 스탯 */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{petStats.agility}</div>
            <div className="text-sm text-gray-300">체력</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{petStats.intelligence}</div>
            <div className="text-sm text-gray-300">민첩성</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{petStats.skill}</div>
            <div className="text-sm text-gray-300">지능</div>
          </div>
        </div>

        {/* 훈련 버튼들 */}
        <div className="space-y-4">
          <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition-all">
            🥕 사료 주기
          </button>
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl transition-all">
            ✨ 훈련하기
          </button>
        </div>
      </div>

      {/* 스테이킹 영역 */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          💰 스테이킹으로 성장시키기
        </h3>
        <p className="text-center text-yellow-100 mb-4">
          토큰을 스테이킹하여 펫을 더 빠르게 성장시키세요!
        </p>
        <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-bold py-3 rounded-xl transition-colors">
          스테이킹 시작하기
        </button>
      </div>
    </div>
  );
}