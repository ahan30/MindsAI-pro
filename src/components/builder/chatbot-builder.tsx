'use client';

import { useState, useRef, useEffect } from 'react';
import { useCompletion } from 'ai/react';
import { askMindsAiPro } from '@/ai/flows/ask-minds-ai-pro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '../icons';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotBuilder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: '/api/ask-minds-ai-pro', // We will create this API route
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep scroll at bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, completion]);
  
  // Combine user messages and AI completion into one feed
  const allMessages: Message[] = [...messages];
  if (completion) {
    // find if last message is from assistant
    const lastMessage = allMessages[allMessages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      // update last message
      lastMessage.content = completion;
    } else {
      // add new message
      allMessages.push({ role: 'assistant', content: completion });
    }
  }

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if(input) {
      setMessages((prev) => [...prev, { role: 'user', content: input }, { role: 'assistant', content: '' }]);
    }
    handleSubmit(e);
  };


  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto bg-card rounded-lg shadow-lg border">
      <div className="p-4 border-b flex items-center gap-4">
        <Avatar>
            <AvatarFallback className='bg-primary'>
                <Logo className='h-6 w-6 text-primary-foreground' />
            </AvatarFallback>
        </Avatar>
        <div>
            <h2 className="text-lg font-semibold">MindsAIPro Assistant</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500')}></span>
                {isLoading ? 'Thinking...' : 'Online'}
            </p>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {allMessages.length > 0 ? (
            allMessages.map((msg, index) => (
              <div key={index} className={cn("flex items-start gap-4", { 'justify-end': msg.role === 'user' })}>
                {msg.role === 'assistant' && (
                   <Avatar>
                        <AvatarFallback className='bg-primary'>
                           <Logo className='h-6 w-6 text-primary-foreground' />
                        </AvatarFallback>
                    </Avatar>
                )}
                <div className={cn("max-w-[75%] rounded-lg p-3 text-sm", {
                  'bg-primary text-primary-foreground': msg.role === 'user',
                  'bg-muted': msg.role === 'assistant'
                })}>
                  <p>{msg.content}</p>
                </div>
                 {msg.role === 'user' && (
                    <Avatar>
                        <AvatarFallback>
                           <User className='h-5 w-5' />
                        </AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
                <Bot className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h1 className="text-xl font-medium">Ask me anything about MindsAIPro!</h1>
                <p className='mt-2'>For example: "What can you build with the website builder?"</p>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={onFormSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <CornerDownLeft className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
