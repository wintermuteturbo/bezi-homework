import { useRef, useEffect } from 'react';
import ChatMessage, { Message } from './ChatMessage';

interface ChatDisplayProps {
  messages: Message[];
}

export default function ChatDisplay({ messages }: ChatDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-2.5 p-5 overflow-y-auto mb-2.5 w-full mx-auto">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 