
import { PageHeader } from '@/components/layout/page-header';
import { HelpCenterClient } from '@/components/features/help-center-client';
import { LifeBuoy } from 'lucide-react';

export const metadata = {
  title: 'Help Center | PusakaPro',
  description: 'Find answers to common questions and get support for PusakaPro.',
};

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Help Center"
        description="Get assistance with PusakaPro. Find FAQs and contact information below."
        icon={LifeBuoy}
      />
      <HelpCenterClient />
    </div>
  );
}
