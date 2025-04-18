import { useState } from "react";
import ChatDisplay from "./components/ChatDisplay";
import { Message } from "./components/ChatMessage";
import { streamChatGPTResponse } from "./utils/chatgpt";
import { generateId } from "./utils/helpers";
import ChatInputCard from "./components/ChatInputCard";
import EmptyState from "./components/EmptyState";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleChatSubmit = async (message: string) => {
    // Add user message to the chat
    const userMessage: Message = {
      id: generateId(),
      text: message,
      role: 'user'
    };

    // Clear input field after submitting
    setInputValue("");

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for the API by extracting just the role and content
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.text
      }));

      // Create a placeholder for assistant's response
      const assistantMessageId = generateId();
      const assistantMessage: Message = {
        id: assistantMessageId,
        text: '',
        role: 'assistant'
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);

      // Stream the response from ChatGPT
      await streamChatGPTResponse(
        message,
        apiMessages,
        (chunk) => {
          // Update the message in the messages array
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, text: msg.text + chunk }
                : msg
            )
          );
        }
      );
    } catch (error) {
      // Handle error
      const errorMessage: Message = {
        id: generateId(),
        text: error instanceof Error
          ? `Error: ${error.message}`
          : "An unknown error occurred",
        role: 'assistant'
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInputValue(prompt);
    handleChatSubmit(prompt);
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setInputValue("");
  };

  return (
    <>
      <TooltipProvider>
        <main className="w-full h-screen flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pb-[200px]">
            <div className="max-w-[900px] mx-auto p-5">
              {messages.length > 0 ? (
                <ChatDisplay messages={messages} isLoading={isLoading} />
              ) : (
                <EmptyState onSelectPrompt={handlePromptSelect} />
              )}
            </div>
          </div>
          <div className="fixed bottom-5 left-0 right-0 bg-transparent">
            <div className="max-w-[900px] mx-auto">
              <ChatInputCard
                handleChatSubmit={handleChatSubmit}
                isLoading={isLoading}
                inputValue={inputValue}
                onInputChange={setInputValue}
                handleStartNewChat={handleStartNewChat}
              />
            </div>
          </div>
        </main>
      </TooltipProvider>
      <Toaster richColors closeButton />
    </>
  );
}

export default App;
