import { PageHeader } from '@/components/layout/page-header';
import { TimelineEstimatorClient } from '@/components/features/timeline-estimator-client';
import { Clock } from 'lucide-react';

export const metadata = {
  title: 'Timeline Estimator | PusakaPro',
  description: 'Estimate the timeline for your small estate administration process based on specific details.',
};

export default function TimelineEstimatorPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Timeline Estimator"
        description="Provide details about the estate to receive an AI-powered timeline estimation for each administration step. This is an estimate and actual times may vary."
        icon={Clock}
      />
      <TimelineEstimatorClient />
    </div>
  );
}
