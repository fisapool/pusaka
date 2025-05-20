
import { PageHeader } from '@/components/layout/page-header';
import { PersonalizedRoadmapClient } from '@/components/features/personalized-roadmap-client';
import { MapPinned } from 'lucide-react';
import { ROADMAP_STEPS } from '@/lib/constants'; // ROADMAP_STEPS will still be used for the static part

export const metadata = {
  title: 'Roadmap & Timeline | PusakaPro',
  description: 'Get AI-powered timeline estimations and follow a step-by-step guide for Malaysian small estate administration.',
};

export default function RoadmapTimelinePage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Roadmap & Timeline"
        description="Estimate your estate administration timeline with AI and follow our comprehensive step-by-step guide."
        icon={MapPinned}
      />
      <PersonalizedRoadmapClient staticRoadmapSteps={ROADMAP_STEPS} />
    </div>
  );
}
