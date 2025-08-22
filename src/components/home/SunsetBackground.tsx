'use client';

export default function SunsetBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/sunset-background.png')",
          backgroundColor: '#ff6b6b', // 테스트용 빨간 배경
        }}
      >
        {/* 어두운 오버레이 (텍스트 가독성을 위해) */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* 선택사항: 추가 효과들 */}
      
      {/* 작은 별들 (하늘 위쪽에) - 선택사항 */}
      <div className="absolute top-5 left-10 text-xs opacity-30">⭐</div>
      <div className="absolute top-12 right-20 text-xs opacity-40">✨</div>
      <div className="absolute top-8 left-1/3 text-xs opacity-25">⭐</div>
      <div className="absolute top-15 right-1/3 text-xs opacity-35">✨</div>
    </div>
  );
}