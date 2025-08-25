interface SettingsSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, icon, children }: SettingsSectionProps) {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 mb-6">
      <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}