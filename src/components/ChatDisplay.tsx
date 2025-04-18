import { useRef, useEffect } from 'react';
import ChatMessage, { Message } from './ChatMessage';
import { Skeleton } from './ui/skeleton';

interface ChatDisplayProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatDisplay({ messages, isLoading }: ChatDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col gap-2.5 p-5 overflow-y-auto mb-2.5 w-full mx-auto">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && <Skeleton className="w-[100px] h-[20px] rounded-full" />}
      <div ref={messagesEndRef} />
    </div>
  );
} 