import ProjectPathButton from "./ProjectPathButton";
import ChatInput from "./ChatInput";

const ChatInputCard = ({ 
  handleChatSubmit, 
  isLoading 
}: { 
  handleChatSubmit: (message: string) => void;
  isLoading: boolean;
}) => {
    return (
        <div className="flex flex-col w-full mx-auto p-4 rounded-lg bg-white shadow-lg border border-gray-100">
            <ChatInput onSubmit={handleChatSubmit} isLoading={isLoading} />
            <ProjectPathButton />
        </div>
    )
}

export default ChatInputCard;