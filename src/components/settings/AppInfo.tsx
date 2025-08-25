export default function AppInfo() {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6">
      <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
        📱 앱 정보
      </h3>
      
      <div className="flex items-center gap-4">
        {/* 앱 로고 */}
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl">
          🚀
        </div>
        
        {/* 앱 정보 */}
        <div className="flex-1">
          <div className="text-white font-bold text-lg">스페이스펫</div>
          <div className="text-gray-400 text-sm mb-1">버전 1.2.0</div>
          <div className="text-gray-300 text-sm leading-relaxed">
            우주 탐험 동물 키우기 게임<br/>
            Built on Kaia Blockchain
          </div>
        </div>
      </div>
    </div>
  );
}