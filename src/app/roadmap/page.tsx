import { PageHeader } from '@/components/layout/page-header';
import { PersonalizedRoadmapClient } from '@/components/features/personalized-roadmap-client';
import { MapPinned } from 'lucide-react';
import { ROADMAP_STEPS } from '@/lib/constants';

export const metadata = {
  title: 'Personalized Roadmap | PusakaPro',
  description: 'Step-by-step guidance through the Malaysian small estate administration process.',
};

export default function RoadmapPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Personalized Roadmap"
        description="Follow this step-by-step guide for administering a small estate in Malaysia. Each step provides key actions and considerations."
        icon={MapPinned}
      />
      <PersonalizedRoadmapClient steps={ROADMAP_STEPS} />
    </div>
  );
}
