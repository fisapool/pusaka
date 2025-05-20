
"use client";

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LegalGuidesClient } from '@/components/features/legal-guides-client';
import { FeesCalculatorClient } from '@/components/features/fees-calculator-client';
import { FindLawyerClient } from '@/components/features/find-lawyer-client';
import type { LegalGuideTopic } from '@/lib/constants';
import { ScrollText, Calculator, Gavel } from 'lucide-react';

interface LegalFinancialHubClientProps {
  legalGuidesTopics: LegalGuideTopic[];
}

export function LegalFinancialHubClient({ legalGuidesTopics }: LegalFinancialHubClientProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Explore Resources</CardTitle>
        <CardDescription>
          Navigate through legal guides, estimate potential fees, or find a lawyer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="guides" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Legal Guides
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Fees Calculator
            </TabsTrigger>
            <TabsTrigger value="lawyer" className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Find a Lawyer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="guides">
            {/* No extra Card needed here as LegalGuidesClient already has one */}
            <LegalGuidesClient topics={legalGuidesTopics} />
          </TabsContent>
          <TabsContent value="fees">
            {/* No extra Card needed here as FeesCalculatorClient already has one */}
            <FeesCalculatorClient />
          </TabsContent>
          <TabsContent value="lawyer">
            {/* No extra Card needed here as FindLawyerClient already has one */}
            <FindLawyerClient />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
