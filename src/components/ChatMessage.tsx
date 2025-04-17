import { formatCodeInText } from '../utils/codeFormatter';

export interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant' | 'system';
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const formattedContent = formatCodeInText(message.text);

  return (
    <div
      className={`mx-0 my-2.5 p-2.5 rounded-lg max-w-[90%] ${message.role === 'user'
          ? 'ml-auto bg-blue-500 text-white self-end'
          : 'mr-auto bg-gray-100 text-gray-800 self-start'
        }`}
    >
      <div className="flex flex-col">
        <span className="font-bold mb-1.5 text-sm">
          {message.role === 'user' ? 'You' : 'Assistant'}
        </span>
        <div className="m-0 break-words">
          {formattedContent.map((part, index) => 
            part.type === 'text' ? (
              <div key={index} className="whitespace-pre-wrap">{part.content}</div>
            ) : (
              <pre key={index} className={`rounded-md my-2 overflow-x-auto ${
                message.role === 'user' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-gray-800 text-gray-100'
              }`}>
                <div className="flex items-center px-4 py-2 text-xs border-b border-gray-700">
                  <span className="flex-1">{part.language || 'code'}</span>
                </div>
                <code 
                  className={`block p-4 text-sm ${part.language ? `language-${part.language}` : ''}`}
                  dangerouslySetInnerHTML={{ __html: part.content }}
                />
              </pre>
            )
          )}
        </div>
      </div>
    </div>
  );
} 