
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
    const systemInstruction = `You are PusakaChat, a friendly and helpful AI assistant for the PusakaPro application.
PusakaPro helps users navigate Malaysian small estate administration.
Your primary goal is to answer user questions based *only* on the information provided below from the PusakaPro application context.
Be concise, polite, and helpful.
If a question is outside the scope of the provided PusakaPro information or if you cannot find the answer within the context, clearly state that the information is not available in PusakaPro or that you cannot answer that specific query with the given data.
Do not invent information or answer questions unrelated to Malaysian small estate administration as covered by the provided context.
If asked about document locations, mention that users can find relevant offices using the 'Find Office' button in the Document Checklist for certain documents.

PusakaPro Application Context:
${applicationContext}
`;

    // Construct messages for the LLM
    // Genkit v1.x expects prompt.messages to be an array of {role, parts: [{text}]}
    const llmMessages: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add system instruction as the first user message (common practice for Gemini)
    llmMessages.push({ role: 'user', parts: [{ text: systemInstruction }] });
    llmMessages.push({ role: 'model', parts: [{ text: "Okay, I understand. I'm PusakaChat, ready to help with questions about Malaysian small estate administration based on the PusakaPro app's information. How can I assist you today?" }] });


    if (input.chatHistory) {
      for (const entry of input.chatHistory) {
        // Ensure history is not too long to avoid issues, though this is a basic implementation
        if (llmMessages.length > 20) break; // Simple history truncation
        llmMessages.push({ role: entry.role, parts: [{ text: entry.content }] });
      }
    }
    llmMessages.push({ role: 'user', parts: [{ text: input.message }] });

    try {
      const response = await ai.generate({
        prompt: { messages: llmMessages },
        // model: 'googleai/gemini-pro' // Or your configured default
        config: {
            // Example safety settings - adjust as needed
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
        }
      });

      const replyText = response.text;
      
      if (!replyText) {
        return { reply: "I'm sorry, I couldn't generate a response at this moment. Please try again." };
      }
      return { reply: replyText };

    } catch (error) {
      console.error("Error in pusakaChatFlow calling ai.generate:", error);
      return { reply: "I apologize, but I encountered an error trying to process your request. Please try again later." };
    }
  }
);
