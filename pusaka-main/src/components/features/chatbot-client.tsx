
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, User, Bot, Loader2, X, HelpCircle, ListChecks, MapIcon } from 'lucide-react'; // Added HelpCircle, ListChecks, MapIcon
import { askPusakaChat, type PusakaChatInput, type ChatMessage } from '@/ai/flows/pusaka-chat-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DisplayMessage {
  id: string;
  role: 'user' | 'bot' | 'error';
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  { id: 'sg1', text: 'What is a small estate?', icon: HelpCircle },
  { id: 'sg2', text: 'What documents do I need?', icon: ListChecks },
  { id: 'sg3', text: 'Explain the roadmap steps.', icon: MapIcon },
];

export function ChatbotClient() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [messages, setMessages] = React.useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (messageContent?: string) => {
    const contentToSend = typeof messageContent === 'string' ? messageContent : inputValue.trim();
    if (!contentToSend || isLoading) return;

    const newUserMessage: DisplayMessage = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: contentToSend,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    if (typeof messageContent !== 'string') {
      setInputValue(''); // Clear input only if it wasn't a suggested prompt
    }
    setIsLoading(true);

    try {
      const chatHistoryForFlow: ChatMessage[] = messages
        .slice(-10) 
        .map(msg => ({
          role: msg.role === 'bot' ? 'model' : 'user', 
          content: msg.content,
        }));

      const response = await askPusakaChat({
        message: contentToSend,
        chatHistory: chatHistoryForFlow,
      });

      const newBotMessage: DisplayMessage = {
        id: Date.now().toString() + '-bot',
        role: 'bot',
        content: response.reply,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error("Error getting chat response:", error);
      toast({
        title: "Chat Error",
        description: "Sorry, I couldn't get a response. Please try again.",
        variant: "destructive",
      });
      const errorBotMessage: DisplayMessage = {
        id: Date.now().toString() + '-error',
        role: 'error', 
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setIsOpen(true)}
        aria-label="Open Chat"
      >
        <MessageSquare className="h-7 w-7" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full max-w-md flex flex-col p-0" side="right">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              PusakaChat Assistant
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground pt-1">
              Ask questions about Malaysian small estate administration based on PusakaPro's information.
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="flex-grow p-4 overflow-y-auto" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && !isLoading && (
                <div className="p-4 space-y-3">
                  <p className="text-sm text-center text-muted-foreground">
                    Not sure where to start? Try one of these:
                  </p>
                  {suggestedPrompts.map((prompt) => (
                    <Button
                      key={prompt.id}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => handleSendMessage(prompt.text)}
                    >
                      <prompt.icon className="mr-2 h-4 w-4 text-primary shrink-0" />
                      {prompt.text}
                    </Button>
                  ))}
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end gap-2",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {(msg.role === 'bot' || msg.role === 'error') && ( 
                    <Avatar className="h-8 w-8 self-start">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-3 py-2 text-sm shadow",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : msg.role === 'error'
                          ? "bg-destructive text-destructive-foreground rounded-bl-none" 
                          : "bg-secondary text-secondary-foreground rounded-bl-none" 
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                     <p className="text-xs opacity-70 mt-1 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                     <Avatar className="h-8 w-8 self-start">
                       <AvatarFallback>
                         <User className="h-5 w-5" />
                       </AvatarFallback>
                     </Avatar>
                  )}
                </div>
              ))}
              {isLoading && messages.length > 0 && ( // Show loader only if there are messages and it's loading new one
                <div className="flex justify-start items-end gap-2"> 
                   <Avatar className="h-8 w-8 self-start">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  <div className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2 shadow rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <SheetFooter className="p-4 border-t">
            <form onSubmit={handleFormSubmit} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask about PusakaPro..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                disabled={isLoading}
                autoComplete="off"
                aria-label="Chat message input"
              />
              <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
