import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { formatCodeInText } from '../utils/codeFormatter';
import { extractCSharpCodeFromText, extractClassNameFromCode } from '../utils/codeExtractor';
import { Button } from '@/components/ui/button';
import { invoke } from '@tauri-apps/api/core';
import { SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { clsx } from 'clsx';
export interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant' | 'system';
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [hasValidCode, setHasValidCode] = useState(false);
  const formattedContent = formatCodeInText(message.text);
  const hasCode = formattedContent.some(part => part.type === 'code');
  const isUserMessage = message.role === 'user';

  // Check for valid C# code when message changes
  useEffect(() => {
    if (message.role === 'assistant') {
      const csharpCode = extractCSharpCodeFromText(message.text);
      setHasValidCode(!!csharpCode);
    }
  }, [message.text, message.role]);

  const handleSaveToUnity = async () => {
    try {
      // Get the Unity project path from localStorage
      const unityPath = localStorage.getItem("unityPath");

      if (!unityPath) {
        toast.error("Please select a Unity project folder first");
        return;
      }

      // Extract C# code from the message
      const csharpCode = extractCSharpCodeFromText(message.text);

      if (!csharpCode) {
        toast.error("No valid C# code found in the message");
        return;
      }

      // Extract class name from the C# code
      const className = extractClassNameFromCode(csharpCode);

      if (!className) {
        toast.error("Could not determine the class name from the C# code");
        return;
      }

      // Use class name for the file name
      const fileName = `${className}.cs`;

      // Save the script to the Unity project
      const scriptResult = await invoke<string>("save_unity_script_at_path", {
        scriptCode: csharpCode,
        fileName: fileName,
        unityPath: unityPath
      });

      toast.success(`Script saved: ${scriptResult}`);
    } catch (error) {
      console.error("Error saving script to Unity:", error);
      toast.error("Failed to save script to Unity");
    }
  };

  // Define styles based on message role
  const messageStyles = isUserMessage
    ? 'ml-auto bg-blue-500 text-white self-end'
    : 'pb-12 mr-auto bg-gray-100 text-gray-800 self-start';

  const codeBlockStyles = isUserMessage
    ? 'bg-blue-700 text-white'
    : 'bg-white shadow-inner border border-gray-200 rounded-md';

  return (
    <div className={`mx-0 my-2.5 p-4 rounded-lg max-w-[90%] relative ${messageStyles}`}>
      <div className="flex flex-col">
        <span className="font-bold mb-1.5 text-sm">
          {isUserMessage ? 'You' : 'Assistant'}
        </span>
        <div className="m-0 break-words">
          {formattedContent.map((part, index) =>
            part.type === 'text' ? (
              <div
                className={clsx(
                  "prose prose-sm max-w-none",
                  isUserMessage && "text-white"
                )}
                key={index}
              >
                <ReactMarkdown children={part.content} />
              </div>
            ) : (
              <>
                <pre key={index} className={`rounded-md my-4 overflow-x-auto ${codeBlockStyles}`}>
                  <div className="flex items-center px-4 py-2 text-xs border-b border-gray-100">
                    <span className="flex-1 text-gray-500 text-md">{part.language || 'code'}</span>
                  </div>
                  <code
                    className={`block p-4 text-sm ${part.language ? `language-${part.language}` : ''}`}
                    dangerouslySetInnerHTML={{ __html: part.content }}
                  />
                </pre>
                {message.role === 'assistant' && hasCode && hasValidCode && (
                  <div className="flex justify-end mb-4">
                    <Button onClick={handleSaveToUnity}>
                      <SaveIcon className="mr-2" /> Save to Unity
                    </Button>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}