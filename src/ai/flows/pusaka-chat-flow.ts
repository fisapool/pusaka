
'use server';
/**
 * @fileOverview A chatbot flow for PusakaPro to assist users.
 *
 * - askPusakaChat - A function that handles chat interactions.
 * - PusakaChatInput - The input type for the askPusakaChat function.
 * - PusakaChatOutput - The return type for the askPusakaChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit'; // Use 'genkit' for z as per existing project structure
import { LEGAL_GUIDE_TOPICS, ROADMAP_STEPS, DOCUMENT_CHECKLIST_ITEMS, DOCUMENT_CATEGORIES } from '@/lib/constants';

// Prepare context data from the application
const formattedLegalGuides = LEGAL_GUIDE_TOPICS.map(g => `Guide Title: ${g.title}\nSummary: ${g.summary}\nContent: ${g.content.join(' ')}`).join('\n\n---\n\n');
const formattedRoadmapSteps = ROADMAP_STEPS.map(s => `Roadmap Step: ${s.title}\nDescription: ${s.description}\nDetails: ${s.details || ''}`).join('\n\n---\n\n');
const formattedDocumentChecklist = DOCUMENT_CHECKLIST_ITEMS.map(d => `Document: ${d.title}\nDescription: ${d.description}\nCategory: ${d.category}${d.locationQuery ? `\nRelevant Office Query: ${d.locationQuery}` : ''}`).join('\n\n---\n\n');

const applicationContext = `
=== PusakaPro Application Information ===

AVAILABLE LEGAL GUIDES:
${formattedLegalGuides}

AVAILABLE ROADMAP STEPS:
${formattedRoadmapSteps}

AVAILABLE DOCUMENT CHECKLIST ITEMS:
${formattedDocumentChecklist}

=== End of PusakaPro Application Information ===
`;

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']).describe("The role of the message sender (user or AI model)."),
  content: z.string().describe("The content of the message."),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const PusakaChatInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty.").describe("The user's current message."),
  chatHistory: z.array(ChatMessageSchema).optional().describe("The previous chat history, if any."),
});
export type PusakaChatInput = z.infer<typeof PusakaChatInputSchema>;

const PusakaChatOutputSchema = z.object({
  reply: z.string().describe("The chatbot's reply to the user."),
});
export type PusakaChatOutput = z.infer<typeof PusakaChatOutputSchema>;

export async function askPusakaChat(input: PusakaChatInput): Promise<PusakaChatOutput> {
  return pusakaChatFlow(input);
}

const pusakaChatFlow = ai.defineFlow(
  {
    name: 'pusakaChatFlow',
    inputSchema: PusakaChatInputSchema,
    outputSchema: PusakaChatOutputSchema,
  },
  async (input) => {
    const systemMessage = `You are PusakaChat, a friendly and helpful AI assistant for the PusakaPro application.
PusakaPro helps users navigate Malaysian small estate administration.
Your primary goal is to answer user questions based *only* on the information provided below from the PusakaPro application context.
Be concise, polite, and helpful.
If a question is outside the scope of the provided PusakaPro information or if you cannot find the answer within the context, clearly state that the information is not available in PusakaPro or that you cannot answer that specific query with the given data.
Do not invent information or answer questions unrelated to Malaysian small estate administration as covered by the provided context.
If asked about document locations, mention that users can find relevant offices using the 'Find Office' button in the Document Checklist for certain documents.
When a user asks about a specific document or process, if the provided PusakaPro context mentions a relevant government agency (e.g., JPN, Pejabat Tanah, JPJ, Amanah Raya Berhad), try to include the agency's name in your response. This helps the user understand which agency they might need to interact with for that particular item or step.

PusakaPro Application Context:
${applicationContext}
`;

    const llmMessages: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Initial "priming" message from the model to acknowledge its role.
    llmMessages.push({ role: 'model', parts: [{ text: "Okay, I understand. I'm PusakaChat, ready to help with questions about Malaysian small estate administration based on the PusakaPro app's information. How can I assist you today?" }] });

    if (input.chatHistory) {
      for (const entry of input.chatHistory) {
        if (llmMessages.length > 20) break; // Simple history truncation
        llmMessages.push({ role: entry.role, parts: [{ text: entry.content }] });
      }
    }
    llmMessages.push({ role: 'user', parts: [{ text: input.message }] });

    try {
      const response = await ai.generate({
        prompt: {
          messages: llmMessages,
          system: systemMessage, // System instruction provided here
        },
        // model: 'googleai/gemini-pro' // Default model from genkit.ts will be used
        config: {
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
        }
      });

      const replyText = response.text;
      const finishReason = response.candidates?.[0]?.finishReason;

      if (replyText) {
        return { reply: replyText };
      } else {
        // No text in response, check finishReason
        if (finishReason === 'SAFETY') {
          console.warn("PusakaChatFlow: Response blocked due to safety settings.");
          return { reply: "I'm sorry, I cannot provide a response to that due to safety guidelines. Please try a different question." };
        } else if (finishReason === 'MAX_TOKENS') {
          console.warn("PusakaChatFlow: Response truncated due to max tokens.");
          return { reply: "The response was a bit too long to display fully. Could you ask for a more specific piece of information?" };
        } else if (finishReason === 'RECITATION') {
            console.warn("PusakaChatFlow: Response blocked due to recitation policy.");
            return { reply: "I cannot provide that information due to content policies. Please ask something else." };
        }
        // For 'STOP' with no text, or 'OTHER', or if finishReason is undefined
        console.warn(`PusakaChatFlow: AI generated no reply text. Finish reason: ${finishReason}. Response:`, JSON.stringify(response));
        return { reply: "I'm sorry, I couldn't generate a specific response for that. Could you try rephrasing or asking something else?" };
      }

    } catch (error: any) {
      console.error("Error in pusakaChatFlow calling ai.generate:", error);
      let userFriendlyMessage = "I apologize, but I encountered an error trying to process your request. Please try again later.";
      if (error.message) {
        if (error.message.includes('API key not valid') || error.message.includes('Invalid API key') || error.message.toLowerCase().includes('api key')) {
          userFriendlyMessage = "There seems to be an issue with the AI service API configuration. Please ensure it's set up correctly.";
        } else if (error.message.includes('IAM permission denied') || error.message.includes('PERMISSION_DENIED')) {
           userFriendlyMessage = "The request was denied due to a permission issue with the AI service. Please check the API setup.";
        } else if (error.message.includes('Quota exceeded') || (error.cause && (error.cause as any).status === 429) ) {
           userFriendlyMessage = "I'm experiencing high demand right now. Please try again in a few moments.";
        } else if (error.message.includes('Billing account') || error.message.includes('billing not enabled')) {
            userFriendlyMessage = "There's an issue with the project's billing configuration for the AI service.";
        } else if (error.message.toLowerCase().includes('model not found')) {
            userFriendlyMessage = "The configured AI model could not be found. Please check the service configuration.";
        }
      }
      return { reply: userFriendlyMessage };
    }
  }
);
