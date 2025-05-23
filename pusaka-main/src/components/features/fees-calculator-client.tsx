
"use client";

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { calculateFees, type CalculateFeesInput, type CalculateFeesOutput } from '@/ai/flows/calculate-fees-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Info, Coins } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const formSchema = z.object({
  estateValue: z.coerce.number().positive("Estate value must be a positive number."),
  propertyType: z.enum(['movable_only', 'immovable_only', 'mixed'], { required_error: "Please select property type." }),
  hasWill: z.boolean().default(false),
  location: z.string().min(3, "Please specify the location (e.g., state).").max(100),
  numberOfBeneficiaries: z.coerce.number().int().min(1, "Must be at least one beneficiary."),
});

type FormData = z.infer<typeof formSchema>;

export function FeesCalculatorClient() {
  const [calculationResult, setCalculationResult] = React.useState<CalculateFeesOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estateValue: 0, 
      propertyType: undefined, 
      hasWill: false,
      location: '',
      numberOfBeneficiaries: 1,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setCalculationResult(null);
    try {
      const result = await calculateFees(data as CalculateFeesInput);
      setCalculationResult(result);
      toast({
        title: "Fees Estimated",
        description: "The AI has generated an estimated fee breakdown.",
      });
    } catch (error) {
      console.error("Error calculating fees:", error);
      toast({
        title: "Error",
        description: "Failed to calculate fees. Please try again or refine your input.",
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
          <CardTitle>Estimate Administration Fees</CardTitle>
          <CardDescription>
            Provide details about the estate to receive an AI-powered fee estimation. Remember, these are estimates.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="estateValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Estimated Estate Value (MYR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 150000" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>Enter the total approximate value of all assets.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}> 
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="movable_only">Movable Property Only (e.g., cash, EPF)</SelectItem>
                        <SelectItem value="immovable_only">Immovable Property Only (e.g., land, house)</SelectItem>
                        <SelectItem value="mixed">Mixed (Both Movable & Immovable)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Specify the nature of the assets in the estate.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasWill"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Was there a Will?</FormLabel>
                      <FormDescription>
                        Indicate if the deceased left a valid will.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (State)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Selangor, Johor, Pulau Pinang" {...field} />
                    </FormControl>
                    <FormDescription>Primary state where estate administration will occur.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberOfBeneficiaries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Beneficiaries</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 3" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>How many individuals will inherit from the estate?</FormDescription>
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
                    Calculating...
                  </>
                ) : (
                  'Calculate Estimated Fees'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {calculationResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Estimated Fees Breakdown</CardTitle>
            <CardDescription>
              The following are AI-generated estimates. Actual costs can vary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {calculationResult.estimatedFees && calculationResult.estimatedFees.length > 0 ? (
              <Accordion type="multiple" className="w-full space-y-2" defaultValue={calculationResult.estimatedFees.map((_, index) => `fee-${index}`)}>
                {calculationResult.estimatedFees.map((fee, index) => (
                  <AccordionItem value={`fee-${index}`} key={index} className="border rounded-md overflow-hidden bg-background hover:bg-secondary/20 transition-colors">
                    <AccordionTrigger className="p-4 text-left hover:no-underline">
                       <div className="flex items-center gap-3 w-full">
                        <Coins className="h-5 w-5 text-primary shrink-0" />
                        <div className="flex-1 text-left">
                          <h3 className="font-medium text-foreground">{fee.category}</h3>
                          <p className="text-sm text-primary font-semibold mt-0.5">{fee.estimatedAmount}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0 bg-secondary/10">
                      <p className="text-sm text-muted-foreground">{fee.description || "No specific description provided."}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground text-center py-4">No specific fee items were estimated for the breakdown. Please refer to the total estimate below.</p>
            )}
            
            <div className="mt-6 p-4 bg-primary/10 text-primary-foreground rounded-md">
              <h3 className="text-lg font-semibold mb-2 text-primary">Total Estimated Range:</h3>
              <p className="text-xl font-bold">{calculationResult.totalEstimatedRange}</p>
            </div>

            <div className="mt-6 flex items-start p-4 bg-accent/20 text-accent-foreground/80 border border-accent/30 rounded-md text-sm">
              <Info className="h-6 w-6 mr-3 mt-0.5 shrink-0 text-accent" />
              <div>
                <strong className="font-semibold">Important Disclaimer:</strong>
                <p className="mt-1">{calculationResult.disclaimer}</p>
              </div>
            </div>
          </CardContent>
           {calculationResult.estimatedFees && calculationResult.estimatedFees.length === 0 && (
             <CardFooter>
                <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/50 rounded-md w-full border border-border">
                    <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
                    <p className="text-md font-semibold text-foreground">Limited Estimation Detail</p>
                    <p className="text-sm text-muted-foreground mt-1">The AI could not provide a detailed fee breakdown for your specific input. Please review the total estimated range and disclaimer. Consider refining your input if you need a more detailed response, or consult with a professional.</p>
                </div>
             </CardFooter>
            )}
        </Card>
      )}
    </div>
  );
}

    