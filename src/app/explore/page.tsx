'use client';

import { useState } from 'react';
import StarBackground from '@/components/explore/StarBackground';
import LaunchPad from '@/components/explore/LaunchPad';
import SpaceshipMaintenance from '@/components/explore/SpaceshipMaintenance';

type ExploreSection = 'launchpad' | 'maintenance';

interface ExplorePageProps {
  profile?: any;
}

export default function ExplorePage({ profile }: ExplorePageProps) {
  const [activeSection, setActiveSection] = useState<ExploreSection>('launchpad');
  const [launchpadKey, setLaunchpadKey] = useState(0);

  const handleSectionChange = (section: ExploreSection) => {
    if (section === 'launchpad') {
      // LaunchPad로 돌아올 때 키를 변경해서 컴포넌트를 새로 렌더링
      setLaunchpadKey(prev => prev + 1);
    }
    setActiveSection(section);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'launchpad':
        return <LaunchPad key={`launchpad-${launchpadKey}`} setActiveSection={handleSectionChange} profile={profile} />;
      case 'maintenance':
        return <SpaceshipMaintenance key="maintenance" setActiveSection={handleSectionChange} />;
      default:
        return <LaunchPad key={`launchpad-default-${launchpadKey}`} setActiveSection={handleSectionChange} profile={profile} />;
    }
  };

  return (
    <div className="relative h-full">
      {/* 반짝이는 별 배경 */}
      <StarBackground />
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 h-full overflow-y-auto">
        {renderSection()}
      </div>
    </div>
  );
}