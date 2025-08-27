'use client';

import { useState } from 'react';
import StarBackground from '@/components/explore/StarBackground';
import StaticCosmicBackground from '@/components/market/StaticCosmicBackground';
import AmbientParticles from '@/components/market/AmbientParticles';
import SimpleFloatingElements from '@/components/market/SimpleFloatingElements';
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
    <div className="relative h-full overflow-hidden">
      {/* 정적 우주 배경 시스템 */}
      <StarBackground />
      <AmbientParticles />
      <StaticCosmicBackground />
      <SimpleFloatingElements />
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 h-full overflow-y-auto">
        {renderSection()}
      </div>
    </div>
  );
}