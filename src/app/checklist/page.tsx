import { PageHeader } from '@/components/layout/page-header';
import { DocumentChecklistClient } from '@/components/features/document-checklist-client';
import { ListChecks } from 'lucide-react';
import { DOCUMENT_CHECKLIST_ITEMS, DOCUMENT_CATEGORIES } from '@/lib/constants';

export const metadata = {
  title: 'Document Checklist | PusakaPro',
  description: 'A comprehensive checklist for all required documents in Malaysian small estate administration.',
};

export default function DocumentChecklistPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Document Checklist"
        description="Ensure you have all necessary documents for a smooth estate administration process. Check off items as you gather them."
        icon={ListChecks}
      />
      <DocumentChecklistClient items={DOCUMENT_CHECKLIST_ITEMS} categories={DOCUMENT_CATEGORIES} />
    </div>
  );
}
