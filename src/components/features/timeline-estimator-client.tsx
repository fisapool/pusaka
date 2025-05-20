
"use client";

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { estimateTimeline, type EstimateTimelineInput, type EstimateTimelineOutput } from '@/ai/flows/estimate-timeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const formSchema = z.object({
  familyRelationships: z.string().min(10, "Please provide more details about family relationships.").max(500),
  assetTypes: z.string().min(10, "Please describe the types of assets involved.").max(500),
  location: z.string().min(3, "Please specify the location (e.g., state or major city).").max(100),
  additionalDetails: z.string().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function TimelineEstimatorClient() {
  const [estimationResult, setEstimationResult] = React.useState<EstimateTimelineOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyRelationships: '',
      assetTypes: '',
      location: '',
      additionalDetails: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Estimate Your Timeline</CardTitle>
          <CardDescription>
            Fill in the details below to get an AI-generated estimate. The more accurate your information, the better the estimate.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location of Estate Administration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Kuala Lumpur, Malaysia" {...field} />
                    </FormControl>
                    <FormDescription>Specify the primary state or city where the estate will be administered.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Estimating...
                  </>
                ) : (
                  'Estimate Timeline'
                )}
              </Button>
              <div className="flex items-start p-3 bg-accent/20 text-accent-foreground/80 border border-accent/30 rounded-md text-sm">
                <Lightbulb className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-accent" />
                <div>
                  <strong>Disclaimer:</strong> This tool provides an estimate based on AI analysis and typical scenarios. Actual timelines can vary significantly due to individual circumstances, legal complexities, and administrative processing times. It is not legal advice.
                </div>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {estimationResult && estimationResult.stepEstimations && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Estimated Timeline Results</CardTitle>
            <CardDescription>
              Below is the AI-generated timeline estimation based on the information you provided.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {estimationResult.stepEstimations.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {estimationResult.stepEstimations.map((step, index) => (
                  <AccordionItem value={`step-${index}`} key={index}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex flex-col w-full"> {/* Changed: Always flex-col */}
                        <span className="font-medium text-primary">{index + 1}. {step.step}</span>
                        <span className="text-sm text-foreground mt-1">{step.estimatedTimeline}</span> {/* Changed: Removed sm:ml-4, sm:mt-0 */}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
