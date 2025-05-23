
"use client";

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LegalGuideTopic } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Search, HelpCircle, Users, Landmark, Scale, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  HelpCircle,
  Users,
  Landmark,
  Scale,
  FileText,
};

interface LegalGuidesClientProps {
  topics: LegalGuideTopic[];
}

export function LegalGuidesClient({ topics: initialTopics }: LegalGuidesClientProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openAccordionItems, setOpenAccordionItems] = React.useState<string[]>([]);

  const filteredTopics = React.useMemo(() => {
    if (!searchTerm) return initialTopics;
    return initialTopics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.content.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialTopics]);

  React.useEffect(() => {
    if (searchTerm) {
      setOpenAccordionItems(filteredTopics.map(topic => topic.id));
    } else {
      setOpenAccordionItems([]); // Collapse all when search is cleared
    }
  }, [searchTerm, filteredTopics]);


  return (
    <Card className="shadow-lg">
      <CardHeader className="p-4"> {/* Adjusted padding */}
        <CardTitle>Explore Legal Topics</CardTitle>
        <CardDescription>
          Find information on various aspects of small estate administration. Use the search to quickly find relevant topics.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0"> {/* Adjusted padding */}
        <div className="mb-4 relative"> {/* Adjusted margin */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {filteredTopics.length > 0 ? (
          <Accordion 
            type="multiple" 
            className="w-full space-y-2"
            value={openAccordionItems}
            onValueChange={setOpenAccordionItems}
          >
            {filteredTopics.map((topic) => {
              const IconComponent = iconMap[topic.iconName];
              return (
                <AccordionItem value={topic.id} key={topic.id} className="border rounded-md overflow-hidden bg-background hover:bg-secondary/20 transition-colors">
                  <AccordionTrigger className="p-4 text-left hover:no-underline">
                    <div className="flex items-start gap-3">
                      {IconComponent && <IconComponent className="h-6 w-6 text-primary mt-1 shrink-0" />}
                      <div>
                        <h3 className="font-medium text-foreground">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{topic.summary}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0 bg-secondary/10">
                    <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                      {topic.content.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No guides match your search criteria. Try a different term.
          </p>
        )}
         <div className="mt-8 p-4 bg-accent/20 text-accent-foreground/80 border border-accent/30 rounded-md text-sm">
            <strong>Note:</strong> The information provided here is for general guidance only and does not constitute legal advice. It's recommended to consult with a legal professional for advice specific to your situation.
        </div>
      </CardContent>
    </Card>
  );
}
