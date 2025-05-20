// src/ai/flows/estimate-timeline.ts
'use server';
/**
 * @fileOverview Estimates the timeline for each step of the small estate administration process based on user-provided details.
 *
 * - estimateTimeline - A function that estimates the timeline for each step.
 * - EstimateTimelineInput - The input type for the estimateTimeline function.
 * - EstimateTimelineOutput - The return type for the estimateTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateTimelineInputSchema = z.object({
  familyRelationships: z
    .string()
    .describe(
      'Description of family relationships, including the number of heirs and their relationship to the deceased.'
    ),
  assetTypes: z
    .string()
    .describe('Types of assets in the estate, such as real estate, bank accounts, and vehicles.'),
  location: z.string().describe('The location where the estate is being administered.'),
  additionalDetails: z
    .string()
    .optional()
    .describe('Any additional details that may affect the timeline.'),
});
export type EstimateTimelineInput = z.infer<typeof EstimateTimelineInputSchema>;

const EstimateTimelineOutputSchema = z.object({
  stepEstimations: z.array(
    z.object({
      step: z.string().describe('The step in the small estate administration process.'),
      estimatedTimeline: z.string().describe('The estimated timeline for the step.'),
      factors: z.string().optional().describe('The factors influencing the timeline.'),
    })
  ).describe('An array of step estimations with estimated timelines and influencing factors.'),
});
export type EstimateTimelineOutput = z.infer<typeof EstimateTimelineOutputSchema>;

export async function estimateTimeline(input: EstimateTimelineInput): Promise<EstimateTimelineOutput> {
  return estimateTimelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateTimelinePrompt',
  input: {schema: EstimateTimelineInputSchema},
  output: {schema: EstimateTimelineOutputSchema},
  prompt: `You are an expert in Malaysian small estate administration.

  Based on the details provided, estimate the timeline for each step of the small estate administration process.
  Provide a reasonable estimate in weeks or months, and list the factors influencing the estimate.

  Family Relationships: {{{familyRelationships}}}
  Asset Types: {{{assetTypes}}}
  Location: {{{location}}}
  Additional Details: {{{additionalDetails}}}

  Format your response as a JSON array of step estimations.
  `,
});

const estimateTimelineFlow = ai.defineFlow(
  {
    name: 'estimateTimelineFlow',
    inputSchema: EstimateTimelineInputSchema,
    outputSchema: EstimateTimelineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
