interface StaticUIProps {
  children: React.ReactNode;
  transparent?: boolean;
}

export default function StaticUI({ children, transparent = false }: StaticUIProps) {
  return (
    <div className="relative">
      {/* 글래스모피즘 배경 - 극도로 투명하게 조정 */}
      <div className={`absolute inset-0 ${transparent ? 'bg-slate-800/5' : 'bg-slate-800/40'} ${transparent ? 'backdrop-blur-xl' : 'backdrop-blur-md'} border ${transparent ? 'border-slate-700/20' : 'border-slate-700/30'} rounded-2xl pointer-events-none`} />
      
      {/* 부드러운 테두리 글로우 - 거의 투명하게 */}
      <div className={`absolute inset-0 bg-gradient-to-r ${transparent ? 'from-purple-500/2 via-blue-500/2 to-purple-500/2' : 'from-purple-500/10 via-blue-500/10 to-purple-500/10'} rounded-2xl blur-sm pointer-events-none`} />
      
      {/* 컨텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}