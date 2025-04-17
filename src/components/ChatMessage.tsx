export interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant' | 'system';
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`mx-0 my-2.5 p-2.5 rounded-lg max-w-[80%] ${message.role === 'user'
          ? 'ml-auto bg-blue-500 text-white self-end'
          : 'mr-auto bg-gray-100 text-gray-800 self-start'
        }`}
    >
      <div className="flex flex-col">
        <span className="font-bold mb-1.5 text-sm">
          {message.role === 'user' ? 'You' : 'Assistant'}
        </span>
        <p className="m-0 break-words">{message.text}</p>
      </div>
    </div>
  );
} 