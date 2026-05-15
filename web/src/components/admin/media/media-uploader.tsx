"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MediaUploaderProps {
  onUploaded: () => void;
}

export function MediaUploader({ onUploaded }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const altRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      if (altRef.current?.value) {
        formData.set("alt", altRef.current.value);
      }

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Upload failed");
      }

      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      onUploaded();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragging
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            {fileRef.current?.files?.[0]?.type?.startsWith("image/") ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-32 rounded object-contain"
              />
            ) : (
              <p className="text-sm text-gray-500">File selected</p>
            )}
            <button
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white"
              onClick={() => setPreview(null)}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop a file here or click to browse
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF, WebP, SVG, PDF — max 10MB
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.csv,.json,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>
      <div className="mt-2">
        <Input ref={altRef} placeholder="Alt text (optional)" className="text-xs" />
      </div>
    </div>
  );
}
