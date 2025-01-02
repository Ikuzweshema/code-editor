import { File, FolderOpen } from "lucide-react";
import { Separator } from "./separator";

export default function Directory() {
  return (
    <div className="flex flex-col w-full h-full border bg-muted/60">
      <div className="flex items-center gap-1 mx-1">
        <FolderOpen className="w-4 h-4" /> Files
      </div>
      <Separator />
      <div className="flex flex-col h-full">
        <FilePreview fileName="index.js" />
        <FilePreview fileName="package.json" />
      </div>
    </div>
  );
}

function FilePreview({ fileName }: { fileName: string }) {
  return (
    <div className="mx-2 w-full flex items-center  cursor-pointer ">
      <File className="w-4 h-4 " /> {fileName}
    </div>
  );
}
