import { useState } from "react";

import ChatDisplay from "./components/ChatDisplay";
import { Message } from "./components/ChatMessage";
import { sendMessageToChatGPT } from "./utils/chatgpt";
import { generateId } from "./utils/helpers";
import { extractCSharpCodeFromText, extractClassNameFromCode } from "./utils/codeExtractor";

import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button"
import ChatInputCard from "./components/ChatInputCard";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidCode, setHasValidCode] = useState(false);

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

      // Check if the response contains valid Unity C# code
      const csharpCode = extractCSharpCodeFromText(responseText);
      setHasValidCode(!!csharpCode);

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

  const handleSaveToUnity = async () => {
    try {
      // Get the Unity project path from localStorage
      const unityPath = localStorage.getItem("unityPath");

      if (!unityPath) {
        alert("Please select a Unity project folder first");
        return;
      }

      // Get the response text from the last assistant message
      const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();

      if (!lastAssistantMessage) {
        alert("No AI response available to save");
        return;
      }

      // Extract C# code from the response
      const csharpCode = extractCSharpCodeFromText(lastAssistantMessage.text);

      if (!csharpCode) {
        alert("No valid C# code found in the AI response");
        return;
      }

      // Extract class name from the C# code
      const className = extractClassNameFromCode(csharpCode);

      if (!className) {
        alert("Could not determine the class name from the C# code");
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

      alert(`Script saved: ${scriptResult}`);
    } catch (error) {
      console.error("Error saving script to Unity:", error);
      alert("Failed to save script to Unity");
    }
  };

  return (
    <main className="w-full h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-[400px]">
        <div className="max-w-[900px] mx-auto p-5">
          <ChatDisplay messages={messages} />
          <Button
            onClick={handleSaveToUnity}
            variant="outline"
            disabled={!hasValidCode}
            className="w-full my-4"
          >
            Save C# Script to Unity
          </Button>
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
