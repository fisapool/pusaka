
"use client";

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LifeBuoy, Mail, MessageSquare } from 'lucide-react';

const faqs = [
  {
    id: 'faq1',
    question: "How do I use the Document Checklist?",
    answer: "Navigate to the 'Document Checklist' page from the sidebar. You can view a list of required documents, check them off as you gather them, and upload your files if you are logged in. For certain documents, a 'Find Office' button will help you locate relevant government offices on Google Maps."
  },
  {
    id: 'faq2',
    question: "How does the Timeline Estimator work?",
    answer: "Go to the 'Timeline Estimator' page. Fill in the details about the estate, such as family relationships, asset types, and location. The AI will then provide an estimated timeline for each step of the small estate administration process. Remember, these are estimates and actual times may vary."
  },
  {
    id: 'faq3',
    question: "Is the Fees Calculator accurate?",
    answer: "The 'Fees Calculator' provides AI-generated *estimates* based on the information you provide and typical scenarios. Actual fees can vary significantly based on the complexity of the estate, current government tariffs, and professional services engaged. Always consult with relevant authorities or legal professionals for precise costs."
  },
  {
    id: 'faq4',
    question: "How can I find a lawyer?",
    answer: "The 'Find a Lawyer' page allows you to enter your location. Clicking 'Search on Google Maps' will open a Google Maps search for lawyers specializing in estate law near the location you provided."
  },
  {
    id: 'faq5',
    question: "How do I use the Chatbot for assistance?",
    answer: "Click the chat bubble icon typically found at the bottom right of your screen. This will open the PusakaChat assistant. You can type your questions about Malaysian small estate administration, and the chatbot will try to answer based on the information available within the PusakaPro application (Legal Guides, Roadmap, Checklist)."
  },
  {
    id: 'faq6',
    question: "How does the 'Add to Google Calendar' feature work on the Roadmap?",
    answer: "On the 'Personalized Roadmap' page, each step has an 'Add to Google Calendar' button. Clicking this will open a new tab with a pre-filled Google Calendar event. The event title and description will be based on the roadmap step. You can then save this event to your own calendar and customize reminders."
  },
  {
    id: 'faq7',
    question: "Can I upload my documents securely?",
    answer: "Yes, if you are logged in, you can upload documents to the Document Checklist. These files are stored in your personal secure cloud storage provided by Firebase. Ensure you understand Firebase Storage security rules for your project."
  }
];

export function HelpCenterClient() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <LifeBuoy className="h-7 w-7 text-primary" />
            <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
          </div>
          <CardDescription>
            Find answers to common questions about using PusakaPro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq) => (
                <AccordionItem value={faq.id} key={faq.id} className="border rounded-md overflow-hidden bg-background hover:bg-secondary/20 transition-colors">
                  <AccordionTrigger className="p-4 text-left hover:no-underline">
                    <span className="font-medium text-foreground">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0 bg-secondary/10">
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-center">No FAQs available at this time.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="h-7 w-7 text-primary" />
            <CardTitle>Contact Support</CardTitle>
          </div>
          <CardDescription>
            Need more help? Reach out to us.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            If you can't find an answer in our FAQs or need further assistance, you can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              Use our <MessageSquare className="inline-block h-4 w-4 mr-1 text-primary" /> <strong>PusakaChat Assistant</strong> (the chat bubble on your screen) for quick questions based on app content.
            </li>
            <li>
              For technical issues or specific queries not covered, please email us at: <a href="mailto:support@pusakapro.example.com" className="text-primary hover:underline">support@pusakapro.example.com</a>. (This is a placeholder email and may not be monitored).
            </li>
          </ul>
           <div className="mt-6 p-3 bg-accent/10 text-accent-foreground/80 border border-accent/20 rounded-md text-xs">
            <strong>Note:</strong> PusakaPro provides information and tools for guidance. For legal advice specific to your situation, please consult with a qualified legal professional.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
