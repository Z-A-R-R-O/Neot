"use client";

import { useState, useEffect, useCallback } from "react";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaUploader } from "@/components/admin/media/media-uploader";
import { MediaGrid } from "@/components/admin/media/media-grid";

interface MediaRecord {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  alt: string | null;
  createdAt: string;
  uploadedBy: { id: string; fullName: string | null };
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaRecord[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [mimeFilter, setMimeFilter] = useState("all");

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (mimeFilter && mimeFilter !== "all") params.set("mimeType", mimeFilter);

      const res = await fetch(`/api/admin/media?${params}`);
      if (!res.ok) throw new Error("Failed to load media");
      setMedia(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setIsLoading(false);
    }
  }, [search, mimeFilter]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  function handleDeleted(id: string) {
    setMedia((prev) => prev?.filter((m) => m.id !== id) ?? null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload and manage media files.
        </p>
      </div>

      <MediaUploader onUploaded={fetchMedia} />

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="media-search" className="text-xs">Search</Label>
          <Input
            id="media-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-60"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="media-type" className="text-xs">Type</Label>
          <Select value={mimeFilter} onValueChange={setMimeFilter}>
            <SelectTrigger id="media-type" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="application">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <LoadingScreen fullScreen={false} message="Loading media..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMedia} />
      ) : (
        <MediaGrid items={media ?? []} onDeleted={handleDeleted} />
      )}
    </div>
  );
}
