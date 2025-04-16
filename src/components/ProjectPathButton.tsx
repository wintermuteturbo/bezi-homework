import { useState } from "react";
import { chooseUnityFolder } from "../utils/chooseUnityFolder";
import { Button } from "@/components/ui/button"
import { FolderInput } from "lucide-react";


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
            <Button variant="outline" onClick={handleSelectUnityPath}> <FolderInput /> Project Path</Button>
            <p>Current Path: {unityPath || "None selected"}</p>
        </div>
    );
}
