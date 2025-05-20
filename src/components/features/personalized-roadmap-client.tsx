
"use client";

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RoadmapStep } from '@/lib/constants';
import { CheckCircle2, ListChecks, HelpCircle, Users, Banknote, FileText, Landmark, BookOpen, Home as HomeIcon, ShieldQuestion, CalendarPlus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addHours } from 'date-fns';

const iconMap: Record<string, LucideIcon> = {
  ListChecks,
  HelpCircle,
  Users,
  Banknote,
  FileText,
  Landmark,
  BookOpen,
  HomeIcon,
  ShieldQuestion,
};

interface PersonalizedRoadmapClientProps {
  steps: RoadmapStep[];
}

export function PersonalizedRoadmapClient({ steps }: PersonalizedRoadmapClientProps) {
  const [completedSteps, setCompletedSteps] = React.useState<Record<string, boolean>>({});

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const formatGoogleCalendarDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
  };

  const handleAddToCalendar = (step: RoadmapStep) => {
    const now = new Date();
    const oneHourLater = addHours(now, 1);

    const startDateStr = formatGoogleCalendarDate(now);
    const endDateStr = formatGoogleCalendarDate(oneHourLater);
    const datesParam = `${startDateStr}/${endDateStr}`;

    const details = `${step.description}${step.details ? `\n\nDetails:\n${step.details}` : ''}`;

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(step.title)}&details=${encodeURIComponent(details)}&dates=${datesParam}`;
    
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Estate Administration Journey</CardTitle>
        <CardDescription>
          This roadmap outlines the typical stages involved. Expand each step for more details, mark them as complete, and add them to your calendar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {steps.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {steps.map((step, index) => {
              const IconComponent = iconMap[step.iconName];
              return (
                <AccordionItem value={step.id} key={step.id} className="border rounded-md overflow-hidden bg-background hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center justify-between w-full p-0"> {/* Modified padding to p-0 */}
                    <AccordionTrigger className="flex-1 p-4 text-left hover:no-underline"> {/* Original padding for trigger */}
                      <div className="flex items-center">
                         {IconComponent && <IconComponent className={`h-6 w-6 mr-3 shrink-0 ${completedSteps[step.id] ? 'text-green-500' : 'text-primary'}`} />}
                        <span className={`font-medium ${completedSteps[step.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {index + 1}. {step.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <div className="pr-4 pl-2 py-4 flex items-center"> {/* Wrapper for the button to manage spacing correctly */}
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
                  </div>
                  <AccordionContent className="p-4 pt-0 bg-secondary/10">
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    {step.details && <p className="text-sm text-foreground whitespace-pre-line mb-4">{step.details}</p>}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToCalendar(step)}
                      className="text-sm"
                    >
                      <CalendarPlus className="mr-2 h-4 w-4 text-primary" />
                      Add to Google Calendar
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center">No roadmap steps available at this time.</p>
        )}
      </CardContent>
    </Card>
  );
}
