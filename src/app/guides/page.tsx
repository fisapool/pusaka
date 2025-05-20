import { PageHeader } from '@/components/layout/page-header';
import { LegalGuidesClient } from '@/components/features/legal-guides-client';
import { ScrollText } from 'lucide-react';
import { LEGAL_GUIDE_TOPICS } from '@/lib/constants';

export const metadata = {
  title: 'Legal Guides | PusakaPro',
  description: 'Essential legal information and guides on Malaysian small estate administration.',
};

export default function LegalGuidesPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Legal Guides"
        description="Explore these guides to understand the key aspects of Malaysian small estate law and administration processes."
        icon={ScrollText}
      />
      <LegalGuidesClient topics={LEGAL_GUIDE_TOPICS} />
    </div>
  );
}
