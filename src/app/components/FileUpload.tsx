'use client' // This file is a client-side component in a Next.js application

import React, { useState } from 'react'; // Importing useState hook from React
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIcon, Loader2Icon } from "lucide-react";

export default function FileUpload({onUpload}:{onUpload?: () => void}){
    const [file, setFile] = useState<File | null>(null); // State to hold the uploaded file
    const [uploading, setUploading] = useState(false); // State to manage uploading state

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0])
        {
            setFile(e.target.files[0]); // Setting the file state with the selected file
        }
    }

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);

        const formData = new FormData(); // Creating a new FormData object to hold the file
        formData.append('file', file); // Appending the file to the FormData object

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        }); // Sending the file to the server via a POST request

        if (res.ok && onUpload) {
            onUpload();
        } // If the upload is successful, call the onUpload callback if provided

        setUploading(false);
    }

    return (
        <div className="space-y-4 rounded-xl border p-4 shadow-md max-w-md mx-auto">
      <div>
        <Label htmlFor="file-upload" className="text-base font-semibold">
          Choose a file to upload
        </Label>
        <Input
          id="file-upload"
          type="file"
          onChange={handleChange}
          className="mt-2"
        />
        {file && (
          <p className="text-sm text-muted-foreground mt-1">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}
      </div>

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
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