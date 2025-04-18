import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSubmit, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // support multiline input
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSubmit(message);
        setMessage("");
      }
    }
  };

  const examplePrompts = [
    "Create a red cube at position [0,1,0] and a blue sphere at [2,1,0]",
    "Make a scene with 3 cylinders in different colors forming a triangle",
    "Generate a metallic sphere above a wooden plane"
  ];

  const useExamplePrompt = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <div>
      <div className="bg-gray-100 p-4 rounded-t-lg border border-gray-200">
        <p>Example prompts:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt, index) => (
            <Button
              key={index}
              onClick={() => useExamplePrompt(prompt)}
              variant="outline"
              type="button"
              disabled={isLoading}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>
      <div className="py-5 w-full">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Please wait..." : "Describe the Unity objects you want to create... (Press Enter to submit)"}
          rows={3}
          className="w-full"
          disabled={isLoading}
        />
      </div>
    </div>
  );
} 