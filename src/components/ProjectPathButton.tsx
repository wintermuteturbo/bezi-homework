import { useState } from "react";
import { chooseUnityFolder } from "../utils/chooseUnityFolder";
import { Button } from "@/components/ui/button"
import { CheckCircle, CircleAlert, FolderOpen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


export default function ProjectPathButton() {
    const [unityPath, setUnityPath] = useState<string | null>(localStorage.getItem("unityPath"));

    const handleSelectUnityPath = async () => {
        const path = await chooseUnityFolder();
        if (path) {
            localStorage.setItem("unityPath", path);
            setUnityPath(path);
        }
    };

    return (
        <div className="flex gap-2 justify-start items-center">
            <Tooltip defaultOpen={!unityPath}>
                <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleSelectUnityPath}><FolderOpen /></Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Select your Unity project folder</p>
                </TooltipContent>
            </Tooltip>
            {unityPath && <Badge variant="outline" className="border-green-500 text-green-500">Project Connected <CheckCircle /></Badge>}
            {!unityPath && <Badge variant="outline" className="border-red-500 text-red-500">Project Not Connected <CircleAlert /></Badge>}
        </div>
    );
}
