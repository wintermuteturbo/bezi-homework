import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    onSelectPrompt: (prompt: string) => void;
}

export default function EmptyState({ onSelectPrompt }: EmptyStateProps) {
    const examplePrompts = [
        "Create a red cube at position [0,1,0] and a blue sphere at [2,1,0]",
        "Make a scene with 3 cylinders in different colors forming a triangle",
        "Generate a metallic sphere above a wooden plane"
    ];

    return (
        <div className="flex flex-col items-center justify-center py-10 px-5">
            <h2 className="text-lg font-medium mb-4">Get started with some examples:</h2>
            <div className="flex flex-wrap gap-2 justify-center max-w-[700px]">
                {examplePrompts.map((prompt, index) => (
                    <Button
                        key={index}
                        onClick={() => onSelectPrompt(prompt)}
                        variant="outline"
                        type="button"
                        className="text-sm"
                    >
                        {prompt}
                    </Button>
                ))}
            </div>
        </div>
    );
} 