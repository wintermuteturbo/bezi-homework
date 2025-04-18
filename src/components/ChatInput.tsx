import { useState, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea"
interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function ChatInput({
  onSubmit,
  isLoading = false,
  value,
  onChange
}: ChatInputProps) {
  const [internalMessage, setInternalMessage] = useState("");

  // Use either controlled form the parent or uncontrolled input
  const message = value !== undefined ? value : internalMessage;
  const handleChange = onChange || setInternalMessage;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // support multiline input
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSubmit(message);
        // Clear input after submitting
        if (onChange) {
          onChange("");
        } else {
          setInternalMessage("");
        }
      }
    }
  };

  return (
    <div className="py-5 w-full">
      <Textarea
        value={message}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isLoading ? "Please wait..." : "Describe the Unity objects you want to create... (Press Enter to submit)"}
        rows={3}
        className="w-full"
        disabled={isLoading}
      />
    </div>
  );
} 