
"use client";

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { RoadmapStep } from '@/lib/constants';
import { CheckCircle2, ListChecks, HelpCircle, Users, Banknote, FileText, Landmark, BookOpen, Home as HomeIcon, ShieldQuestion, CalendarPlus, Loader2, Lightbulb, AlertTriangle, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input as UiInput } from '@/components/ui/input'; // Renamed to avoid conflict with Genkit flow input type
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addHours } from 'date-fns';
import { estimateTimeline, type EstimateTimelineInput, type EstimateTimelineOutput } from '@/ai/flows/estimate-timeline';

const timelineFormSchema = z.object({
  familyRelationships: z.string().min(10, "Please provide more details about family relationships.").max(500),
  assetTypes: z.string().min(10, "Please describe the types of assets involved.").max(500),
  location: z.string().min(3, "Please specify the location (e.g., state or major city).").max(100),
  additionalDetails: z.string().max(500).optional(),
});
type TimelineFormData = z.infer<typeof timelineFormSchema>;


const staticIconMap: Record<string, LucideIcon> = {
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
  staticRoadmapSteps: RoadmapStep[];
}

export function PersonalizedRoadmapClient({ staticRoadmapSteps }: PersonalizedRoadmapClientProps) {
  const [completedSteps, setCompletedSteps] = React.useState<Record<string, boolean>>({});
  const [estimationResult, setEstimationResult] = React.useState<EstimateTimelineOutput | null>(null);
  const [isLoadingTimeline, setIsLoadingTimeline] = React.useState(false);
  const { toast } = useToast();

  const timelineForm = useForm<TimelineFormData>({
    resolver: zodResolver(timelineFormSchema),
    defaultValues: {
      familyRelationships: '',
      assetTypes: '',
      location: '',
      additionalDetails: '',
    },
  });

  const onTimelineSubmit: SubmitHandler<TimelineFormData> = async (data) => {
    setIsLoadingTimeline(true);
    setEstimationResult(null);
    try {
      const result = await estimateTimeline(data as EstimateTimelineInput);
      setEstimationResult(result);
      toast({
        title: "Timeline Estimated",
        description: "The AI has generated an estimated timeline for your review.",
      });
    } catch (error) {
      console.error("Error estimating timeline:", error);
      toast({
        title: "Error",
        description: "Failed to estimate timeline. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTimeline(false);
    }
  };

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
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Clock className="h-7 w-7 text-primary" />
            <CardTitle>AI Timeline Estimator</CardTitle>
          </div>
          <CardDescription>
            Provide details about the estate to receive an AI-powered timeline estimation. This helps in planning the steps outlined below.
          </CardDescription>
        </CardHeader>
        <Form {...timelineForm}>
          <form onSubmit={timelineForm.handleSubmit(onTimelineSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={timelineForm.control}
                name="familyRelationships"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Relationships</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Deceased survived by spouse and 3 adult children. All are cooperative." {...field} rows={3} />
                    </FormControl>
                    <FormDescription>Describe family relationships, number of heirs, and their relationship to the deceased.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={timelineForm.control}
                name="assetTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Types</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., One house, two bank accounts, one car, and some EPF savings." {...field} rows={3} />
                    </FormControl>
                    <FormDescription>List the types of assets in the estate (real estate, bank accounts, vehicles, investments, etc.).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={timelineForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location of Estate Administration</FormLabel>
                    <FormControl>
                      <UiInput placeholder="e.g., Kuala Lumpur, Malaysia" {...field} />
                    </FormControl>
                    <FormDescription>Specify the primary state or city where the estate will be administered.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={timelineForm.control}
                name="additionalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., All documents readily available. No known disputes among beneficiaries." {...field} rows={3} />
                    </FormControl>
                    <FormDescription>Any other information that might affect the timeline (e.g., known disputes, missing documents).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <Button type="submit" disabled={isLoadingTimeline} className="w-full sm:w-auto">
                {isLoadingTimeline ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Estimating Timeline...
                  </>
                ) : (
                  'Get AI Timeline Estimation'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoadingTimeline && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {estimationResult && estimationResult.stepEstimations && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>AI-Generated Timeline Estimates</CardTitle>
            <CardDescription>
              Below is the AI-generated timeline estimation based on the information you provided. Use this as a general guide.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {estimationResult.stepEstimations.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {estimationResult.stepEstimations.map((step, index) => (
                  <AccordionItem value={`estimate-step-${index}`} key={`estimate-step-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex flex-col w-full">
                        <span className="font-medium text-primary">{index + 1}. {step.step}</span>
                        <span className="text-sm text-foreground mt-1">{step.estimatedTimeline}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-secondary/30 rounded-md">
                      {step.factors ? (
                        <>
                          <h4 className="font-semibold mb-1 text-sm">Factors Influencing Timeline:</h4>
                          <p className="text-sm text-muted-foreground">{step.factors}</p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No specific factors highlighted for this step.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
               <div className="flex flex-col items-center justify-center p-6 text-center bg-muted rounded-md">
                  <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                  <p className="text-lg font-semibold">No Estimation Available</p>
                  <p className="text-muted-foreground">The AI could not generate an estimation based on the provided details. Please try refining your input.</p>
              </div>
            )}
             <div className="mt-6 flex items-start p-3 bg-accent/20 text-accent-foreground/80 border border-accent/30 rounded-md text-sm">
                <Lightbulb className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-accent" />
                <div>
                  <strong>Disclaimer:</strong> This tool provides an estimate based on AI analysis and typical scenarios. Actual timelines can vary significantly due to individual circumstances, legal complexities, and administrative processing times. It is not legal advice.
                </div>
              </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center gap-3">
            <MapPinned className="h-7 w-7 text-primary" />
            <CardTitle>Estate Administration Roadmap</CardTitle>
          </div>
          <CardDescription>
            Follow this step-by-step guide for administering a small estate. Mark steps as complete and add them to your calendar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staticRoadmapSteps.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {staticRoadmapSteps.map((step, index) => {
                const IconComponent = staticIconMap[step.iconName];
                return (
                  <AccordionItem value={step.id} key={step.id} className="border rounded-md overflow-hidden bg-background hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center justify-between w-full p-0">
                      <AccordionTrigger className="flex-1 p-4 text-left hover:no-underline">
                        <div className="flex items-center">
                           {IconComponent && <IconComponent className={`h-6 w-6 mr-3 shrink-0 ${completedSteps[step.id] ? 'text-green-500' : 'text-primary'}`} />}
                          <span className={`font-medium ${completedSteps[step.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {index + 1}. {step.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <div className="pr-4 pl-2 py-4 flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
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
    </div>
  );
}
