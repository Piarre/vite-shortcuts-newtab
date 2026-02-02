import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import SettingsBaseComponent, { type ChildrenBaseProps } from "./base";
import { getData, setAllData } from "@/lib/storage";
import { toast } from "sonner";

interface ImportExportDataProps extends ChildrenBaseProps {
  onSuccess?: () => void;
}

const ImportExportData = ({ title, onSuccess }: ImportExportDataProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({
        shortcuts: getData("shortcuts"),
        categories: getData("categories"),
      })
    )}`;

    const downloadAnchorNode = document.createElement("a");

    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "backup.json");

    document.body.appendChild(downloadAnchorNode);

    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    console.log("Importing file:", selectedFile?.name);

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        console.log(json);
        if (json.shortcuts && json.categories) {
          setAllData("shortcuts", json.shortcuts);
          setAllData("categories", json.categories);
          toast.success("Import successful!");
          onSuccess?.();
          setSelectedFile(null);
        } else {
          toast.error("Invalid file format.");
        }
      } catch {
        toast.error("Error reading file.");
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  return (
    <SettingsBaseComponent title={title}>
      <Card>
        <CardHeader>
          <CardTitle>Import / Export</CardTitle>
          <CardDescription>Backup your shortcuts and categories or restore from a previous backup.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed p-6 cursor-pointer transition-colors ${
              isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <Download className="mr-2 h-4 w-4" />
            <p className="text-sm text-muted-foreground text-center">
              {selectedFile ? (
                <span className="text-foreground font-medium">{selectedFile.name}</span>
              ) : (
                <>
                  Drag & drop a JSON file here, or <span className="text-primary underline">browse</span>
                </>
              )}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleExport}>
              <Upload className="h-8 w-8 text-muted-foreground" />
              Export
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={!selectedFile} onClick={handleImport}>
            Import
          </Button>
        </CardFooter>
      </Card>
    </SettingsBaseComponent>
  );
};

export default ImportExportData;
