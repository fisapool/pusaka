
'use server';
/**
 * @fileOverview Estimates the potential fees for Malaysian small estate administration.
 *
 * - calculateFees - A function that estimates fees based on estate details.
 * - CalculateFeesInput - The input type for the calculateFees function.
 * - CalculateFeesOutput - The return type for the calculateFees function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateFeesInputSchema = z.object({
  estateValue: z.number().positive('Estate value must be a positive number.').describe('The total estimated value of the estate in MYR.'),
  propertyType: z.enum(['movable_only', 'immovable_only', 'mixed']).describe('The type of property in the estate (movable only, immovable only, or mixed).'),
  hasWill: z.boolean().describe('Whether the deceased left a valid will.'),
  location: z.string().min(3, 'Please specify the location (e.g., state).').describe('The state in Malaysia where the estate is primarily located, as fees can vary by state or agency.'),
  numberOfBeneficiaries: z.number().int().min(1, 'There must be at least one beneficiary.').describe('The number of beneficiaries.'),
});
export type CalculateFeesInput = z.infer<typeof CalculateFeesInputSchema>;

const FeeItemSchema = z.object({
  category: z.string().describe('The category of the fee (e.g., Land Office Application Fee, Amanah Raya Berhad Fee, Legal Professional Fee).'),
  estimatedAmount: z.string().describe('The estimated amount or range for this fee category (e.g., "MYR 100 - MYR 500", "Approximately 1% of estate value").'),
  description: z.string().optional().describe('A brief description or notes about this fee, including any assumptions made.'),
});

const CalculateFeesOutputSchema = z.object({
  estimatedFees: z.array(FeeItemSchema).describe('An array of estimated fee items.'),
  totalEstimatedRange: z.string().describe('A string representing the total estimated fee range (e.g., "MYR 1,500 - MYR 3,000").'),
  disclaimer: z.string().describe('A disclaimer stating that these are estimates and actual fees may vary, advising consultation with professionals.'),
});
export type CalculateFeesOutput = z.infer<typeof CalculateFeesOutputSchema>;

export async function calculateFees(input: CalculateFeesInput): Promise<CalculateFeesOutput> {
  return calculateFeesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateFeesPrompt',
  input: {schema: CalculateFeesInputSchema},
  output: {schema: CalculateFeesOutputSchema},
  prompt: `You are an AI assistant specialized in Malaysian small estate administration procedures and associated costs. Your task is to provide an *estimation* of potential fees involved in administering a small estate based on the user's input. The estate is considered "small" if its total value is less than MYR 5 million.

User Input:
- Total Estimated Estate Value: MYR {{{estateValue}}}
- Property Type: {{{propertyType}}}
- Has Will: {{{hasWill}}}
- Location (State): {{{location}}}
- Number of Beneficiaries: {{{numberOfBeneficiaries}}}

Based on this information, provide a breakdown of potential fees. Consider the following categories where applicable:
1.  **Land Office Fees (Pejabat Tanah / Unit Pembahagian Pusaka Kecil JKPTG):** These are usually for applications involving immovable property. They can be fixed or tiered based on estate value. Mention if these are typically lower for small estates.
2.  **Amanah Raya Berhad (ARB) Fees:** ARB may be involved if they are appointed as administrator, especially for movable property or if beneficiaries are minors. Their fees are often a percentage of the estate value, with different rates for summary administration vs. full administration.
3.  **Legal Professional Fees:** If a lawyer is engaged, their fees can vary. For small estates, they might offer fixed fees or follow a scale. This is highly variable.
4.  **Valuation Fees:** Fees for professional valuation of properties, if required.
5.  **Other Potential Costs:** e.g., newspaper advertisement costs for creditor notices (if applicable).

For each fee category:
- Provide an *estimated amount or range*. Be clear that these are not exact figures.
- Add a brief description or any assumptions made. For example, for ARB, specify if the estimate is for summary or full administration.

Output Requirements:
- \\\`estimatedFees\\\`: An array of objects, each with \\\`category\\\`, \\\`estimatedAmount\\\`, and \\\`description\\\`.
- \\\`totalEstimatedRange\\\`: A string summarizing the total estimated range of all fees.
- \\\`disclaimer\\\`: CRITICAL - Always include a strong disclaimer. It should state that these figures are *estimates only* for general guidance, based on typical scenarios for small estates in Malaysia (under MYR 5 million value). Actual fees can vary significantly based on the complexity of the estate, specific tariffs of government bodies or ARB at the time of application, choices made by the administrator (e.g., engaging lawyers), and other unforeseen circumstances. Advise the user to consult directly with the relevant authorities (Land Office, ARB) and/or a legal professional for accurate and up-to-date cost information specific to their situation.

Example for a fee item:
{
  category: "Land Office Application Fee",
  estimatedAmount: "MYR 50 - MYR 400 (depending on estate value tier)",
  description: "Fee for filing Form A at the District Land Office. Varies based on the total value of immovable property."
}

Focus on providing a realistic but clearly estimated range. Do not give exact figures unless widely known fixed statutory fees.
`
});

const calculateFeesFlow = ai.defineFlow(
  {
    name: 'calculateFeesFlow',
    inputSchema: CalculateFeesInputSchema,
    outputSchema: CalculateFeesOutputSchema,
  },
  async (input) => {
    // Ensure estateValue is treated as a number if it's not already.
    const numericInput = { ...input, estateValue: Number(input.estateValue) };
    const {output} = await prompt(numericInput);

    // Fallback disclaimer if AI fails to generate one
    const defaultDisclaimer = "The figures provided are estimates for general guidance only and are based on typical scenarios for small estates in Malaysia (under MYR 5 million value). Actual fees can vary significantly depending on the complexity of the estate, current tariffs, and professional services engaged. Please consult with relevant authorities (Land Office, Amanah Raya Berhad) and/or a legal professional for precise cost information related to your specific situation.";

    return {
        estimatedFees: output?.estimatedFees || [],
        totalEstimatedRange: output?.totalEstimatedRange || "Could not be estimated. Please refine input.",
        disclaimer: output?.disclaimer || defaultDisclaimer,
    };
  }
);
