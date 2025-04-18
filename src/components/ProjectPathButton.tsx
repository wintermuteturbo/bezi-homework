import { useState } from "react";
import { chooseUnityFolder } from "../utils/chooseUnityFolder";
import { Button } from "@/components/ui/button"
import { FolderOpen } from "lucide-react";


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
            <Button variant="outline" onClick={handleSelectUnityPath}><FolderOpen /></Button>
            <p className="text-sm text-muted-foreground shadow-inner p-2 rounded-md bg-muted">Project Path: {unityPath || "Select a path to Unity Project"}</p>
        </div>
    );
}
