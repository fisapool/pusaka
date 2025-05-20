"use client";

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RoadmapStep } from '@/lib/constants';
import { CheckCircle2 } from 'lucide-react';

interface PersonalizedRoadmapClientProps {
  steps: RoadmapStep[];
}

export function PersonalizedRoadmapClient({ steps }: PersonalizedRoadmapClientProps) {
  const [completedSteps, setCompletedSteps] = React.useState<Record<string, boolean>>({});

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Estate Administration Journey</CardTitle>
        <CardDescription>
          This roadmap outlines the typical stages involved. Expand each step for more details and mark them as complete as you progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {steps.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {steps.map((step, index) => (
              <AccordionItem value={step.id} key={step.id} className="border rounded-md overflow-hidden bg-background hover:bg-secondary/20 transition-colors">
                <AccordionTrigger className="p-4 text-left hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                       <step.icon className={`h-6 w-6 mr-3 shrink-0 ${completedSteps[step.id] ? 'text-green-500' : 'text-primary'}`} />
                      <span className={`font-medium ${completedSteps[step.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {index + 1}. {step.title}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent accordion toggle
                        toggleStepCompletion(step.id);
                      }}
                      aria-label={completedSteps[step.id] ? 'Mark as incomplete' : 'Mark as complete'}
                      className={`p-1 rounded-full transition-colors ${
                        completedSteps[step.id] 
                          ? 'bg-green-100 hover:bg-green-200 dark:bg-green-700 dark:hover:bg-green-600' 
                          : 'bg-muted hover:bg-accent/50'
                      }`}
                    >
                      <CheckCircle2 className={`h-5 w-5 ${completedSteps[step.id] ? 'text-green-600 dark:text-green-300' : 'text-muted-foreground'}`} />
                    </button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 bg-secondary/10">
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  {step.details && <p className="text-sm text-foreground whitespace-pre-line">{step.details}</p>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center">No roadmap steps available at this time.</p>
        )}
      </CardContent>
    </Card>
  );
}
