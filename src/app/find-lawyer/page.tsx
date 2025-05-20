
import { PageHeader } from '@/components/layout/page-header';
import { FindLawyerClient } from '@/components/features/find-lawyer-client';
import { Gavel } from 'lucide-react';

export const metadata = {
  title: 'Find a Lawyer | PusakaPro',
  description: 'Search for legal professionals specializing in estate law near your location.',
};

export default function FindLawyerPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Find a Lawyer"
        description="Enter your location to find lawyers specializing in estate administration and inheritance law."
        icon={Gavel}
      />
      <FindLawyerClient />
    </div>
  );
}
