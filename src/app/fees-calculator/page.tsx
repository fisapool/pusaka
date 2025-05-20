import { PageHeader } from '@/components/layout/page-header';
import { FeesCalculatorClient } from '@/components/features/fees-calculator-client';
import { Calculator } from 'lucide-react';

export const metadata = {
  title: 'Fees Calculator | PusakaPro',
  description: 'Estimate potential fees for Malaysian small estate administration.',
};

export default function FeesCalculatorPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Fees Calculator"
        description="Estimate potential fees involved in the small estate administration process. This tool provides estimates, and actual costs may vary."
        icon={Calculator}
      />
      <FeesCalculatorClient />
    </div>
  );
}
