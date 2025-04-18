import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
interface EmptyStateProps {
    onSelectPrompt: (prompt: string) => void;
}

export default function EmptyState({ onSelectPrompt }: EmptyStateProps) {
    const examplePrompts = [
        "Generate a scene with a red cube and a blue sphere",
        "Make a scene with 3 cylinders in different colors forming a triangle",
        "Make a scene with couple of trees and a house ane explain elements and their properties in the scene"
    ];

    return (
        <div className="flex flex-col max-w-[900px] prose text-center">
            <h2>Welcome to the 3D Scene Generator</h2>
            <p>Get started by trying one of these examples or type your own prompt below</p>
            <div className="flex flex-wrap gap-3 justify-start w-full mt-4">
                {examplePrompts.map((prompt, index) => (
                    <Button
                        key={index}
                        onClick={() => onSelectPrompt(prompt)}
                        variant="outline"
                        type="button"
                        className="text-sm"
                    >
                        <Lightbulb className="size-4 mr-2 text-yellow-500" />
                        {prompt}
                    </Button>
                ))}
            </div>
        </div>
    );
} 