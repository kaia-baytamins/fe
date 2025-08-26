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

  const renderSection = () => {
    switch (activeSection) {
      case 'launchpad':
        return <LaunchPad setActiveSection={setActiveSection} profile={profile} />;
      case 'maintenance':
        return <SpaceshipMaintenance setActiveSection={setActiveSection} />;
      default:
        return <LaunchPad setActiveSection={setActiveSection} profile={profile} />;
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