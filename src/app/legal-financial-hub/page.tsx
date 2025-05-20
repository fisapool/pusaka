
import { PageHeader } from '@/components/layout/page-header';
import { LegalFinancialHubClient } from '@/components/features/legal-financial-hub-client';
import { Library } from 'lucide-react';
import { LEGAL_GUIDE_TOPICS } from '@/lib/constants';

export const metadata = {
  title: 'Legal & Financial Hub | PusakaPro',
  description: 'Access legal guides, estimate fees, and find legal professionals for Malaysian small estate administration.',
};

export default function LegalFinancialHubPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Legal & Financial Hub"
        description="Your central resource for legal information, fee estimations, and finding professional help."
        icon={Library}
      />
      <LegalFinancialHubClient legalGuidesTopics={LEGAL_GUIDE_TOPICS} />
    </div>
  );
}
