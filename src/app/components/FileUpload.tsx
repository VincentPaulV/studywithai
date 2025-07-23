'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIcon, Loader2Icon } from "lucide-react";

export default function FileUpload({ onUpload }: { onUpload?: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);

    const formData = new FormData();
    files.forEach(file => formData.append('file', file));

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok && onUpload) {
      onUpload();
    }

    setUploading(false);
    setFiles([]);
  };

  return (
    <div className="space-y-4 rounded-xl border border-[#444857] bg-[#23272f] p-4 shadow-md max-w-md mx-auto">
      <div>
        <Label htmlFor="file-upload" className="text-base font-semibold text-white">
          Choose file(s) to upload
        </Label>
        <Input
          id="file-upload"
          type="file"
          multiple
          onChange={handleChange}
          className="mt-2 text-white file:text-white"
          style={{ color: "white" }}
        />
        {files.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1 text-white">
            Selected:{" "}
            <span className="font-medium">
              {files.map(f => f.name).join(", ")}
            </span>
          </p>
        )}
      </div>

      <Button
        onClick={handleUpload}
        disabled={!files.length || uploading}
        className="w-full bg-gradient-to-r from-[#444857] to-[#23272f] text-white"
      >
        {uploading ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </>
        )}
      </Button>
    </div>
  );
}