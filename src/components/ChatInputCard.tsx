import ProjectPathButton from "./ProjectPathButton";
import ChatInput from "./ChatInput";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";

const ChatInputCard = ({
    handleChatSubmit,
    isLoading,
    inputValue,
    onInputChange,
    handleStartNewChat
}: {
    handleChatSubmit: (message: string) => void;
    isLoading: boolean;
    inputValue?: string;
    onInputChange?: (value: string) => void;
    handleStartNewChat?: () => void;
}) => {
    return (
        <div className="flex flex-col w-full mx-auto p-4 rounded-lg bg-white shadow-lg border border-gray-100">
            <div className="flex mb-2">
                <Button
                    onClick={handleStartNewChat}
                    variant="outline"
                    className="mr-2"
                >
                    <PenSquare className="size-4 mr-1" />
                    New Chat
                </Button>
                <ProjectPathButton />
            </div>

            <ChatInput
                onSubmit={handleChatSubmit}
                isLoading={isLoading}
                value={inputValue}
                onChange={onInputChange}
            />
        </div>
    )
}

export default ChatInputCard;