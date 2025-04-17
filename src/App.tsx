import { useState } from "react";

import ChatDisplay from "./components/ChatDisplay";
import { Message } from "./components/ChatMessage";
import { sendMessageToChatGPT } from "./utils/chatgpt";
import { generateId } from "./utils/helpers";

import ChatInputCard from "./components/ChatInputCard";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChatSubmit = async (message: string) => {
    // Add user message to the chat
    const userMessage: Message = {
      id: generateId(),
      text: message,
      role: 'user'
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for the API by extracting just the role and content
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.text
      }));

      // Send message to ChatGPT with conversation history
      const response = await sendMessageToChatGPT(message, apiMessages);

      if (response.error) {
        throw new Error(response.error);
      }

      const responseText = response.text;

      // Add ChatGPT's response to the chat
      const assistantMessage: Message = {
        id: generateId(),
        text: responseText,
        role: 'assistant'
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);
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

  return (
    <main className="w-full h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-[400px]">
        <div className="max-w-[900px] mx-auto p-5">
          <ChatDisplay messages={messages} />
        </div>
      </div>
      <div className="fixed bottom-5 left-0 right-0 bg-transparent">
        <div className="max-w-[900px] mx-auto">
          <ChatInputCard handleChatSubmit={handleChatSubmit} />
        </div>
      </div>
    </main>
  );
}

export default App;
